import { BigNumber, EventFilter } from "ethers";
import { hexZeroPad, id } from "ethers/lib/utils";
import { Tournament } from "./Tournament";
import { Provider } from '@ethersproject/providers'

export type RoundHistory = {
  round: BigNumber;
  bracketWinners: number[];
  playersScores?: BigNumber[];
}

export type TournamentResult = {
  bracketWinner: number;
  playersScores?: BigNumber[];
}

export type TournamentData = {
  wallets?: string[];
  tokenAddresses?: string[];
  tokenIds?: BigNumber[];
  currentBalances?: BigNumber[];
  bracketWinners?: number[];
  currentRound?: BigNumber;
  roundHistory?: RoundHistory[];
  tournamentResult?: TournamentResult;
};

export type TournamentFetchRequest = {
  data?: TournamentData;
  error?: string;
};

export class TournamentFetcher {
  tournament: Tournament;
  tournamentId: number;
  tournamentData: TournamentData;
  tournamentAddress: string;
  provider: Provider;

  constructor(provider: Provider, chainId: number, address: string, tournamentId: number) {
    this.tournament = new Tournament(provider, chainId, address);
    this.tournamentId = tournamentId;
    this.tournamentAddress = address;
    this.tournamentData = {};
    this.provider = provider;
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

  fetchRoundHistory = async () => {
    const filter = this.tournament.tournamentContract.filters.RoundEnded(this.tournamentId);
    const roundEndEvents = await this.tournament.tournamentContract.queryFilter(filter);
    
    const roundHistory = roundEndEvents.map(event => {
      const { args } = event;
      return { round: args[1], bracketWinners: args[2], playersScores: args[3] }
    })

    this.tournamentData.roundHistory = roundHistory;
  };

  fetchTournamentResult = async () => {
    const filter = this.tournament.tournamentContract.filters.TournamentEnded(this.tournamentId);
    const roundEndEvent = await this.tournament.tournamentContract.queryFilter(filter);
    
    if(roundEndEvent.length > 0) {
      const { args } = roundEndEvent[0];
      const result = { bracketWinner: args[1], playersScores: args[2] }
  
      this.tournamentData.tournamentResult = result; 
    }
  }

  fetchTournamentData = async (): Promise<TournamentFetchRequest> => {
    const group = [];

    group.push(this.fetchWallets());
    group.push(this.fetchTokenAddresses());
    group.push(this.fetchTokenIds());
    group.push(this.fetchCurrentBalances());
    group.push(this.fetchBracketWinners());
    group.push(this.fetchCurrentRound());
    group.push(this.fetchRoundHistory());
    group.push(this.fetchTournamentResult());

    try {
      await Promise.all(group);
      return { data: this.tournamentData };
    } catch (err) {
      return { error: "Error loading data: " + err };
    }
  };
}
