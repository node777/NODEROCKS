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
        const inputIds = path.join(outputPath, `output12.json`);

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
                    for(t in idz[item].meta.attributes){
                        let a =idz[item].meta.attributes[t]
                        if(a.trait_type=="Traits"){
                            idz[item].meta.attributes[t].value=String(idz[item].meta.attributes[t].value)
                        }
                    }
                    
                    if(item%100==0){

                        console.log(`${item/100}%`)
                    }
                    if(item==9999){
                        saveFiles()

                    }
                    // if(item!=(idz[item].meta.edition-1)){
                    //     console.log(item, Number(idz[item].meta.edition-1))
                    // }
                }
            // fs.readFile(inputFile, 'utf8', (readErr, data) => {
            //     if (readErr) {
            //         console.error('Error reading file:', inputFile, readErr);
            //         return;
            //     }
            // // console.log(data)
            // // Modify the content of the file as needed
            // // const modifiedData = data.toUpperCase(); // Example modification
            // // data=JSON.parse(data)
                
            //     // modifiedData[Number(JSON.parse(data).edition)]=JSON.parse(data)
            //     // if(Number(JSON.parse(data).edition)==10000){
            //     //     console.log(modifiedData)

            //     // }
            // });
        });
        // }
    });
};


function saveFiles(){
    
        // Save the modified content to the output folder
        const outputFile = path.join(outputFolder, "output13.json");
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
