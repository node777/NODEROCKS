const fs = require('graceful-fs').gracefulify(require('fs')); 
const { copyFileSync } = require('fs');
const path = require('path');
var modifiedData = new Array(10001);

// Specify the input and output folders
const inputFolder = './json';
const outputFolder = './output';
let idz={}
let jsondata={}

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
        const inputFile = path.join(outputPath, `output5.json`);
        const inputIds = path.join(outputPath, `ids.json`);

        fs.readFile(inputIds, 'utf8', (readErr, d) => {
            if (readErr) {
                console.error('Error reading file:', inputFile, readErr);
                return;
            }
            idz=JSON.parse(d);
            console.log(idz.length)
            fs.readFile(inputFile, 'utf8', (readErr, data) => {
                if (readErr) {
                    console.error('Error reading file:', inputFile, readErr);
                    return;
                }
                jsondata=JSON.parse(data)
                // console.log(data)
                // Modify the content of the file as needed
                // const modifiedData = data.toUpperCase(); // Example modification
                // data=JSON.parse(data)
                let offset=0
                for(item in jsondata){
                // for(item=9981;item<10000;item++){
                    
                    // =JSON.parse(data)[item]
                    
                    if(item!=(Number(idz[item].meta.name.split("#")[1])-1)){
                        console.log(item,Number(idz[item].meta.name.split("#")[1])-1)
                        
                        idz.splice(item, 0, {
                            "id": "unknown",
                            "meta": {
                            "name": "NodeRocks #1166"
                            }
                        })
                        // return
                        // jsondata[item].id = "unknown"
                        // offset++
                    }else{
                    }
                        jsondata[item].id = idz[item].id

                    // if(item%100==0){
                    //     console.log(`${item/100}%`)
                    // }

                    if(item==9999){
                        saveFiles()

                    }
                }
                
                // modifiedData[Number(JSON.parse(data).edition)]=JSON.parse(data)
                // if(Number(JSON.parse(data).edition)==10000){
                //     console.log(modifiedData)

                // }
            });
        });
        // }
    });
};


function saveFiles(){
    
        // Save the modified content to the output folder
        const outputFile = path.join(outputFolder, "output10.json");
        fs.writeFile(outputFile, JSON.stringify(jsondata), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Error writing file:', outputFile, writeErr);
                return;
            }

            console.log('File processed and saved:', outputFile);
        });
}
// Start processing files
processFiles(inputFolder, outputFolder);
