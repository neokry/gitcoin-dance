import { useContext, useEffect, useState } from "react";
import { TournamentDataContext } from "../context/TournamentDataContext";
import { Fragment } from "react";
import useSWR from "swr";
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";

export default function usePlayer(playerIndex: number, round: number): { funds: number, getPlayerFunds: () => void } {
    const { tournament } = useContext(TournamentDataContext);
    const { zkData } = useContext(ZKSyncDataContext);
    const swr = useSWR("https://api.zksync.io/api/v0.1/tokens");
    const [funds, setFunds] = useState<number>(0);

    //pulls player score data from contract
    const getRoundScores = (queryRound: number) => {
        if (!tournament.data) return;
        const { roundHistory } = tournament.data;

        if (!roundHistory) return;
        const roundData = roundHistory.find(
            (x) => x.round.toNumber() === queryRound
        );

        if (!roundData) return;
        const { playersScores } = roundData;
        if (playersScores) return playersScores[playerIndex].toNumber();
    };

    const getPlayerFunds = () => {
        if (!tournament.data || !swr.data || playerIndex < 0) return;
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
        } else if (tournament.data && round === 1) {
            const {
                data: { tournamentResult },
            } = tournament;
            if (tournamentResult && tournamentResult.playersScores)
                playerFunds = tournamentResult.playersScores[playerIndex].toNumber();
        } else {
            //get round score from contract
            playerFunds = getRoundScores(round) ?? 0;
        }

        if (playerFunds < 0) playerFunds = 0;
        setFunds(playerFunds);
    }

    useEffect(() => {
        getPlayerFunds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playerIndex])

    return { funds, getPlayerFunds }
}