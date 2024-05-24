

var magiceden = {
    baseMEurl: "https://api-mainnet.magiceden.dev/v2/ord/btc/",
    apikey: "",
    options: {method: 'GET', headers: {accept: 'application/json', Authorization: `Bearer ${this.apikey}`}},

    sleep: ms => new Promise(r => setTimeout(r, ms)),
    retryWaitTime: 2000,

    async mecall(url, params, retries = 2) {
        const fullurl = `${this.baseMEurl}${url}?collectionSymbol=noderocks&${params}`;
        const response = await fetch(fullurl, options);
        if (!response.ok)
        {
            if (retries > 0) {
                console.log(`call to ${fullurl} failed. Retrying in ${(retryWaitTime / 1000)} seconds.`)
                await sleep(retryWaitTime);
                retries = retries - 1;
                return mecall(url, retries);
            }
            return undefined;
        }

        return await response.json();
    },

    async getMyTokens(includeUnlisted = true) {
        return await mecall("tokens", `ownerAddress=${bitprint.getCurrentAddress()}&showAll=${includeUnlisted.toString()}`);
    },

    async getTokens(includeUnlisted = true) {
        return await mecall("tokens", `showAll=${includeUnlisted.toString()}`);
    }
}