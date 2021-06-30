import { Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers';
import { Tournament as TournamentContract, Tournament__factory as TournamentFactory } from "../typechain";

export class Tournament {
    public provider: Provider;
    public chainId: number;
    public tournamentContract: TournamentContract;

    constructor(provider: Provider, chainId: number, tournamentAddress: string) {
        this.provider = provider;
        this.chainId = chainId;
        this.tournamentContract = TournamentFactory.connect(tournamentAddress, provider);
    }

    public async getWallets(tournamentId: number): Promise<string[]> {
        return this.tournamentContract.getWallets(tournamentId);
    }

    public async getTokenAddresses(tournamentId: number): Promise<string[]> {
        return this.tournamentContract.getTokenAddresses(tournamentId);
    }

    public async getTokenIds(tournamentId: number): Promise<BigNumber[]> {
        return this.tournamentContract.getTokenIds(tournamentId);
    }

    public async getCurrentBalances(tournamentId: number): Promise<BigNumber[]> {
        return this.tournamentContract.getCurrentBalances(tournamentId);
    }

    public async getBracketWinners(tournamentId: number): Promise<number[]> {
        return this.tournamentContract.getBracketWinners(tournamentId);
    }

    public async getCurrentRound(tournamentId: number): Promise<BigNumber> {
        return this.tournamentContract.getCurrentRound(tournamentId);
    }
}