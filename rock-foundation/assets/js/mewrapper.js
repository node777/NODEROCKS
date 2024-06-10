var magiceden = {
    baseMEWrapperurl: "http://duckduckduck.io/",

    beforeParamsChar: "/", //for real ME it'd be: "?"
    collectionSymbol: "", //for real ME it'd be: "collectionSymbol=noderocks&"
    
    sleep: ms => new Promise(r => setTimeout(r, ms)),
    retryWaitTime: 2000,

    mecall:async(url, params, retries = 0) => {
        let fullurl = `${magiceden.baseMEWrapperurl}${url}`;
        if (params) {
            fullurl += `${magiceden.beforeParamsChar}${magiceden.collectionSymbol}${params}`;
        }
        else {
        }

        console.log(fullurl);
        const response = await fetch(fullurl, magiceden.options);
        if (!response.ok)
        {
            if (retries > 0) {
                console.log(`call to ${fullurl} failed. Retrying in ${(retryWaitTime / 1000)} seconds.`)
                await magiceden.sleep(retryWaitTime);
                retries = retries - 1;
                return magiceden.mecall(url, retries);
            }
            return undefined;
        }
        let json = await response.json();
        console.log(json);
        return json;
    },

    getMyTokens:async(includeUnlisted = true) => {
        let result = await magiceden.mecall("tokens", `${bitprint.wallet.address}`); //"bc1prvdtyd9zhnfqhnzpqq3jkjp5c7xu8lg77ld4senfj427ew8pux8s0vf0du"); //has 163 tokens
        //let result = await magiceden.mecall("tokens", "bc1prvdtyd9zhnfqhnzpqq3jkjp5c7xu8lg77ld4senfj427ew8pux8s0vf0du"); //has 163 tokens
        //let result = await magiceden.mecall("tokens", "bc1pduhc4kd3ctkkfhlfg0hz44nfd5k5f9v6uxu4w2wmj3actpd6wc3sg6uu6l"); //has a secret token
        
        return result.tokens;
    },

    getTokens:async(ownerAddress) => {
        return await magiceden.mecall("tokens", `ownerAddress=${ownerAddress}`);
    },

    getFloors:async(includeUnlisted = true) => {
        let result = await magiceden.mecall("floors");
        return result.floors;
    },
}