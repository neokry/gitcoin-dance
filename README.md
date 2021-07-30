OVERVIEW
- This app is responsible for displaying data related to the upcoming Gitcoin NFT tournament.
- Data is pulled from the Tournament.sol contract found [here](https://github.com/upstateinteractive/gitcoin-nft-tournament) and the ZKSync L2.
- Created with NextJS and TailwindCSS


SETUP
- Create a .env.local file and fill out the parameters as outlined in .env.sample
- To get a complete tournament view use this sample contract and tournament id

    ```jsx
    NEXT_PUBLIC_TOURNAMENT_ADDRESS="0x466AF141B3EC0b0adD67C600676DD972ab464515"
    NEXT_PUBLIC_TOURNAMENT_ID="4"
    ```

- Run the app using

    ```jsx
    npm install
    npm run dev
    ```
