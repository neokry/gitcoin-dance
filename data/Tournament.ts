import { Provider } from '@ethersproject/providers'
import { BigNumber } from 'ethers';
import { Tournament as TournamentContract, Tournament__factory as TournamentFactory } from "../typechain";

export class Tournament {
    public provider: Provider;
    public chainId: number;
    public tournament: TournamentContract;

    constructor(provider: Provider, chainId: number, tournamentAddress: string) {
        this.provider = provider;
        this.chainId = chainId;
        this.tournament = TournamentFactory.connect(tournamentAddress, provider);
    }

    public async getWallets(tournamentId: number): Promise<string[]> {
        return this.tournament.getWallets(tournamentId);
    }

    public async getTokenAddresses(tournamentId: number): Promise<string[]> {
        return this.tournament.getTokenAddresses(tournamentId);
    }

    public async getTokenIds(tournamentId: number): Promise<BigNumber[]> {
        return this.tournament.getTokenIds(tournamentId);
    }

    public async getCurrentBalances(tournamentId: number): Promise<BigNumber[]> {
        return this.tournament.getCurrentBalances(tournamentId);
    }

    public async getBracketWinners(tournamentId: number): Promise<number[]> {
        return this.tournament.getBracketWinners(tournamentId);
    }

    public async getCurrentRound(tournamentId: number): Promise<BigNumber> {
        return this.tournament.getCurrentRound(tournamentId);
    }
}