import { ethers } from "ethers";
import * as zksync from "zksync"
import { AccountState, Network, Tokens } from "zksync/build/types";

export type ZKData = {
    accountsTotals?: ZKAccountBalanceUSD[];
    overallTotal?: number;
    tokens?: Tokens;
}

export type ZKAccountBalanceUSD = {
    address: string,
    totalBalanceUSD: number
}

export class ZKSyncFetcher {
    public syncHttpProvider?: zksync.Provider;
    public tokens?: Tokens;
    private tokenPrices: {
        [token: string]: number;
    } = {}

    public async connect(chainId: number) {
        const network = ethers.providers.getNetwork(chainId).name;
        this.syncHttpProvider = await zksync.getDefaultProvider(network as Network);
    }

    public async fetchZKData(addresses: string[]): Promise<ZKData> {
        const accounts = await this.fetchAccounts(addresses);
        if(!this.tokens) await this.fetchTokens();
        const accountsTotals = await this.fetchBalances(accounts);
        const overallTotal = this.getAllAccountTotals(accountsTotals);
        return { accountsTotals,  overallTotal, tokens: this.tokens};
    }

    public async fetchZKBalances(addresses: string[]): Promise<ZKAccountBalanceUSD[]> {
        const accounts = await this.fetchAccounts(addresses);
        if(!this.tokens) await this.fetchTokens();
        return await this.fetchBalances(accounts);
    }

    private getAllAccountTotals(balances: ZKAccountBalanceUSD[]): number {
        let total = 0;
        balances.map(balance => {
            total += balance.totalBalanceUSD;
        })
        return total;
    }

    private async fetchAccounts(addresses: string[]): Promise<AccountState[]> {
        if(!this.syncHttpProvider) throw new Error("ZKSync provider not connected");;

        const accountBatch: Promise<AccountState>[] = [];
        addresses.map(address => {
            const tx = this.syncHttpProvider!.getState(address);
            accountBatch.push(tx);
        })

        return await Promise.all(accountBatch);
    }

    private async fetchBalances(accounts: AccountState[]): Promise<ZKAccountBalanceUSD[]> {
        const balanceBatch: Promise<ZKAccountBalanceUSD>[] = [];
        accounts.map(async account => 
            balanceBatch.push(this.getAccountBalanceInUSD(account))
        )

        const balances = await Promise.all(balanceBatch);
        return balances;
    }

    private async getAccountBalanceInUSD(account: AccountState): Promise<ZKAccountBalanceUSD> {
        const verifiedBalance = account.committed.balances;
        let total = 0;
        for (let token in verifiedBalance) {
            const bal = verifiedBalance[token];
            const price = await this.tokenPriceLookup(token);

            if(!price) throw new Error("Could not find token price");

            const tokenInfo = this.tokens![token];
            const formattedBalance = ethers.utils.formatUnits(bal.toString(), tokenInfo.decimals)

            const usd = parseFloat(formattedBalance) * price;

            total += usd
        }
        return { address: account.address, totalBalanceUSD: total };
    }

    private async tokenPriceLookup(token: string): Promise<number | void> {
        if(!this.syncHttpProvider) throw new Error("ZKSync provider not connected");
        const lookup = this.tokenPrices[token];
        if(lookup) return lookup;

        const price = await this.syncHttpProvider!.getTokenPrice(token);
        this.tokenPrices[token] = price;
        return price;
    }

    private async fetchTokens(): Promise<Tokens | void> {
        if(!this.syncHttpProvider) throw new Error("ZKSync provider not connected");
        this.tokens = await this.syncHttpProvider!.getTokens();
    }
}