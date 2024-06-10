class Rock {
    listed = false;
    listedPrice = -1;
    staked = false;

    id = "";
    name = "";
    image = "";
    owner = "";
    genesisTimestamp = 0;
    curseType = "";
    ordinalNumber = "";

    traitNum = 0;
    traits = [];
    traitsDirect = {};

    traitString = "";
    traitTableHTML = "";
    genesisDateString = "";

    floorString = "";

    //constructor() {}

    constructor(data) {
        if (data) {
            if (data.listed != undefined)
                this.inputMEMetadata(data);
            else
                this.inputMetadata(data);
        }
    }

    inputMetadata(data) {
        this.id = data['id'];
        this.name = data['meta']['name'];
        this.number = this.name.replace("#", "");
        this.image = `./rocks/${this.id}.png`

        this.inputTraitData(data);
    }

    inputTraitData(data) {
        for (let index = 0; index < data['meta']['attributes'].length; index++) {
            if (data['meta']['attributes'][index]['trait_type'] == 'Traits')
                continue;
            let attribute = data['meta']['attributes'][index];
            this.traitsDirect[attribute['trait_type']] = attribute['value'];
            this.traits.push({ [attribute['trait_type']]: attribute['value'] });
            //this.traitString += `[${attribute['trait_type']}] ${attribute['value']} | `;
            this.traitString += `<span title='${attribute["trait_type"]}'>${attribute['value']}</span><br>`;
            this.traitTableHTML += `<tr><td class='details-trait-type'>[${attribute['trait_type']}]</td><td class='details-trait-value'>${attribute['value']}</td></tr>`;
        }
        this.traitNum = this.traits.length;
        this.traitString = this.traitString.substring(0, this.traitString.length - 4);
    }

    inputHiroData(item) {
        this.genesisTimestamp = item.genesis_timestamp;
        this.genesisDateString = new Date(this.genesisTimestamp).toLocaleDateString();
        this.curseType = item.curse_type;
        this.ordinalNumber = item.number;
    }

    inputMEMetadata(item) {
        this.id = item['id'];
        this.name = item['displayName']
        this.number = this.name.replace("#", "");
        this.image = `./rocks/${this.id}.png`

        this.genesisTimestamp = Date.parse(item.genesisTransactionBlockTime);
        this.genesisDateString = new Date(this.genesisTimestamp).toLocaleDateString();
        this.curseType = item.curse_type;
        this.ordinalNumber = item.inscriptionNumber;

        this.inputTraitData(item);

        this.listed = item.listed;
        this.owner = item.owner;
        this.listedPrice = item.listedPrice;
    }

    inputMEListingData(item) {
        this.listed = item.listed;
        this.owner = item.owner;
        this.listedPrice = item.listedPrice;
    }

    getListedString() {
        if (this.listed == undefined)
            return "---";
        if (this.listed == false)
            return "no";
        return this.listedPrice / 100000000 + " btc";
    }
}

let rocksData = [];

function fillMetadata() {
    for (const rock in rocks) {
        rocksData.push(new Rock(rock));
    }
}

function getRock(id) {
    let rock = rocksData.find(item => item.id == id);
    if (rock)
        return rock;

    let rockData = rocks.find(item => item.id == id);
    rock = new Rock(rockData);

    rocksData.push(rock);
    return rock;
}

function fillMEdata() {
    let mytokens = magiceden.getMyTokens(true);
    for (const token in mytokens.items) {
        let rock = rocksData.find(item => item.id == token.id);
        if (rock) {
            rock.inputMEData(token);
        }
        else {
            console.log(`error: could not find rock: ${token.inscriptionNumber}`);
        }
    }
}