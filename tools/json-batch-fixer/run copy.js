const fs = require('graceful-fs').gracefulify(require('fs')); 
const path = require('path');
var modifiedData = new Array(10001);

// Specify the input and output folders
const inputFolder = './json';
const outputFolder = './output';

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

// Function to read, modify, and save each file
const processFiles = (inputPath, outputPath) => {
    fs.readdir(inputPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        for(i=1;i<=10000;i++){
            const inputFile = path.join(inputPath, `${i}.json`);

            fs.readFile(inputFile, 'utf8', (readErr, data) => {
                if (readErr) {
                    console.error('Error reading file:', inputFile, readErr);
                    return;
                }
                // console.log(data)
                // Modify the content of the file as needed
                // const modifiedData = data.toUpperCase(); // Example modification
                // data=JSON.parse(data)
                modifiedData[Number(JSON.parse(data).edition)]=JSON.parse(data)
                if(Number(JSON.parse(data).edition)==10000){
                    console.log(modifiedData)

                    saveFiles()
                }
            });
        }
    });
};


function saveFiles(){
    
        // Save the modified content to the output folder
        const outputFile = path.join(outputFolder, "output.json");
        fs.writeFile(outputFile, JSON.stringify(modifiedData), 'utf8', writeErr => {
            if (writeErr) {
                console.error('Error writing file:', outputFile, writeErr);
                return;
            }

            console.log('File processed and saved:', outputFile);
        });
}
// Start processing files
processFiles(inputFolder, outputFolder);
