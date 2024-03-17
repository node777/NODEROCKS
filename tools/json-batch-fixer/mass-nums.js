const fs = require('graceful-fs').gracefulify(require('fs')); 
const { copyFileSync } = require('fs');
const path = require('path');
var modifiedData = new Array(10001);

// Specify the input and output folders
const inputFolder = './json';
const outputFolder = './output';
let idz={}

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Function to read, modify, and save each file
const processFiles = (inputPath, outputPath) => {
    fs.readdir(outputPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        // for(i=1;i<=10000;i++){
        const inputIds = path.join(outputPath, `output10.json`);

        fs.readFile(inputIds, 'utf8', (readErr, d) => {
            if (readErr) {
                console.error('Error reading file:', inputFile, readErr);
                return;
            }
            idz=JSON.parse(d);
            console.log(idz.length)
            
            for(item in idz){
                // for(item=9981;item<10000;item++){
                    // delete idz[item].meta.description
                    // delete idz[item].meta.edition
                    // delete idz[item].meta.date
                    // delete idz[item].meta.imageHash
                    // =JSON.parse(data)[item]
                    let traitNum=idz[item].meta.attributes.length;
                    let msrs=[
                        "#662",
                        "#8070",
                        "#2023",
                        "#7660",
                        "#4380",
                        "#3754",
                        "#182",
                        "#2294",
                        "#465",
                        "#9660",
                        "#3439",
                        "#7115",
                        "#127",
                        "#1263",
                        "#211",
                        "#5531",
                        "#3510",
                        "#4693",
                        "#2206",
                        "#9544",
                        "#7115",
                        "#18",
                        "#1823",
                        "#4693",
                        "#8919",
                        "#9882",
                        "#1263",
                        "#8888",
                        "#211",
                        "#2206",
                        "#9660",
                        "#8744",
                        "#2023",
                        "#662",
                        "#3257",
                        "#3265",
                        "#8671",
                        "#8225",
                        "#18",
                        "#4068",
                        "#5990",
                        "#8919",
                        "#8888",
                        "#9882",
                        "#7564",
                        "#8744",
                    ]
                    if(msrs.includes(idz[item].meta.name)){
                        idz[item].meta.attributes.push(
                            { "trait_type": "Secret", "value": "META SECRET" }
                        )
                    }
                    
                    idz[item].meta.attributes.push(
                        { "trait_type": "Traits", "value": String(traitNum) }
                    )
                    if(item%100==0){
                    console.log(traitNum)

                        console.log(`${item/100}%`)
                    }
                    if(item==9999){
                        saveFiles()

                    }
                }
        });
        // }
    });
};


function saveFiles(){
    
        // Save the modified content to the output folder
        const outputFile = path.join(outputFolder, "output15.json");
        fs.writeFile(outputFile, JSON.stringify(idz), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Error writing file:', outputFile, writeErr);
                return;
            }

            console.log('File processed and saved:', outputFile);
        });
}
// Start processing files
processFiles(inputFolder, outputFolder);
