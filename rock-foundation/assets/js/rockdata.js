class Rock {
    listed = false;
    listedPrice = -1;
    staked = false;

    id = "";
    name = "";
    image = "";
    owner = "";

    traitNum = 0;
    traits = [];

    traitString = "";
    traitListHTML = "";

    //constructor() {}

    constructor(data) {
        this.inputMetadata(data);
    }

    inputMetadata(data) {
        this.id = data['id'];
        this.name = data['meta']['name'];
        this.image = `./rocks/${this.id}.png`

        for (let index = 0; index < data['meta']['attributes'].length; index++) {
            let attribute = data['meta']['attributes'][index];
            this[attribute['trait_type']] = attribute['value'];
            this.traits.push({ [attribute['trait_type']]: attribute['value'] });
            //this.traitString += `[${attribute['trait_type']}] ${attribute['value']} | `;
            this.traitString += `<span title='${attribute["trait_type"]}'>${attribute['value']}</span><br>`;
            this.traitListHTML += `<span class='details-trait-type'>[${attribute['trait_type']}]</span> <span class='details-trait-value'>${attribute['value']}</span><br>`;
        }
        this.traitNum = this.traits.length;
        this.traitString = this.traitString.substring(0, this.traitString.length - 4);
    }

    inputMEData(item) {
        this.listed = item.listed;
        this.owner = item.owner;
        this.listedPrice = item.listedPrice;
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
        let rock = rocksData.find(item => item.id == token.inscriptionNumber);
        if (rock) {
            rock.inputMEData(token);
        }
        else {
            console.log(`error: could not find rock: ${token.inscriptionNumber}`);
        }
    }
}