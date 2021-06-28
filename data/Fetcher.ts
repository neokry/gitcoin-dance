import { BigNumber } from "ethers";
import { Tournament } from "../data/Tournament";
import { Provider } from '@ethersproject/providers';

export type TournamentData = {
  wallets?: string[];
  tokenAddresses?: string[];
  tokenIds?: BigNumber[];
  currentBalances?: BigNumber[];
  bracketWinners?: number[];
  currentRound?: BigNumber;
};

export type TournamentFetchRequest = {
  data?: TournamentData;
  error?: string;
};

export class Fetcher {
  tournament: Tournament;
  tournamentId: number;
  tournamentData: TournamentData;

  constructor(provider: Provider, chainId: number, tournamentAddress: string, tournamentId: number) {
    this.tournament = new Tournament(provider, chainId, tournamentAddress);
    this.tournamentId = tournamentId;
    this.tournamentData = {};
  }

  fetchWallets = async () => {
    const wallets = await this.tournament.getWallets(this.tournamentId);
    this.tournamentData.wallets = wallets;
  };

  fetchTokenAddresses = async () => {
    const tokenAddresses = await this.tournament.getTokenAddresses(
      this.tournamentId
    );
    this.tournamentData.tokenAddresses = tokenAddresses;
  };

  fetchTokenIds = async () => {
    const tokenIds = await this.tournament.getTokenIds(this.tournamentId);
    this.tournamentData.tokenIds = tokenIds;
  };

  fetchCurrentBalances = async () => {
    const currentBalances = await this.tournament.getCurrentBalances(
      this.tournamentId
    );
    this.tournamentData.currentBalances = currentBalances;
  };

  fetchBracketWinners = async () => {
    const bracketWinners = await this.tournament.getBracketWinners(
      this.tournamentId
    );
    this.tournamentData.bracketWinners = bracketWinners;
  };

  fetchCurrentRound = async () => {
    const currentRound = await this.tournament.getCurrentRound(
      this.tournamentId
    );
    this.tournamentData.currentRound = currentRound;
  };

  fetchTournamentData = async (): Promise<TournamentFetchRequest> => {
    const group = [];

    group.push(this.fetchWallets());
    group.push(this.fetchTokenAddresses());
    group.push(this.fetchTokenIds());
    group.push(this.fetchCurrentBalances());
    group.push(this.fetchBracketWinners());
    group.push(this.fetchCurrentRound());

    try {
      await Promise.all(group);
      return { data: this.tournamentData };
    } catch (err) {
      return { error: "Error loading data: " + err };
    }
  };
}
