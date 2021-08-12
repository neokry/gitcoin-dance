import { useContext, useEffect, useState } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";

export default function usePlayer(playerIndex: number, round: number): { funds: number, getPlayerFunds: () => void } {
    const { tournament } = useContext(TournamentDataContext);
    const { zkData } = useContext(ZKSyncDataContext);
    const [funds, setFunds] = useState<number>(0);

    //pulls player score data from contract
    const getRoundScores = (queryRound: number) => {
        if (!tournament.data) return;
        const { roundHistory } = tournament.data;

        if (!roundHistory) return;
        const roundData = roundHistory.find(
            (x) => x.round.toNumber() === queryRound
        );

        //Get position of winners from last round
        //This is required because the player scores array is order like the bracket winners array
        const lastRoundData = roundHistory.find(x => x.round.toNumber() === queryRound + 1);
        let position = -1;
        if (lastRoundData) {
            position = lastRoundData.bracketWinners.findIndex(x => x == playerIndex);
        }

        if (queryRound == 1 && position) {
            const {
                data: { tournamentResult },
            } = tournament;
            console.log("res", tournamentResult?.playersScores)
            if (tournamentResult && tournamentResult.playersScores)
                return tournamentResult.playersScores[position].toNumber();
        }

        if (!roundData) return;
        const { playersScores } = roundData;
        console.log("last round", lastRoundData?.bracketWinners);
        if (playersScores) {
            if (position !== -1) return playersScores[position].toNumber();
            else return playersScores[playerIndex].toNumber();
        };
    };

    const getPlayerFunds = () => {
        if (!tournament.data || playerIndex < 0) return;
        const { data } = tournament;
        const isCurrentRound = round === data.currentRound?.toNumber();

        let playerFunds = 0;
        if (zkData.data && data.wallets && isCurrentRound) {
            //Get players funds from zkSync
            const player = data.wallets[playerIndex];
            const playerTotal = zkData.data.accountsTotals?.find(
                (x) => x.address.toLowerCase().localeCompare(player.toLowerCase()) === 0
            );

            //Subtract current funds from prev round score
            if (tournament.data && tournament.data.currentBalances) {
                const balance = tournament.data.currentBalances[playerIndex];
                if (playerTotal)
                    playerFunds = playerTotal.totalBalanceUSD - balance.toNumber();
            }
        } else {
            //get round score from contract
            playerFunds = getRoundScores(round) ?? 0;
        }

        if (playerFunds < 0) playerFunds = 0;
        setFunds(playerFunds);
        console.log("funds3", playerFunds)
    }

    useEffect(() => {
        getPlayerFunds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerIndex, zkData.data, tournament.data])

    return { funds, getPlayerFunds }
}