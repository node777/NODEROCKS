const axios = require('axios');
const fs = require('fs');
const util = require('util');
const fsExists = util.promisify(fs.exists);

// Path to your JSON file
const filePath = './rockList.json';


// Function to read JSON file and return an array of items
function readItemsFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}
// Main function to process each item
async function processItems() {
    try {
        const items = await readItemsFromFile(filePath);
        // console.log(items.toString());
        for (let id of items) {
            const path = `./rocks/${id}.png`;
            const alreadyExists = await fsExists(path);
            if (!alreadyExists) {
                const url = `https://api.hiro.so/ordinals/v1/inscriptions/${id}/content`;
                await downloadWithRetry(url, path);
            } else {
                // console.log(`File ${path} already exists. Skipping download.`);
            }
        }
    } catch (error) {
        // console.error('An error occurred:', error);
    }
}

// Helper function to download an image with retry logic
async function downloadWithRetry(url, path, retries = 3) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            
            headers: {
                'x-hiro-api-key': "07bd4d5f89651b294b4486a0e879a6c0" // Use the API key from environment variables
            }
        });

        const writer = fs.createWriteStream(path);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', () => reject(new Error('Failed to write the file')));
        });
    } catch (error) {
        // console.error('Error downloading the image:', error);
        if (retries > 0) {
            console.log(`Retrying in 10 seconds... Remaining retries: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 20000)); // wait for 10 seconds
            return downloadWithRetry(url, path, retries - 1);
        } else {
            // console.error('Max retries reached, moving to the next item.');
        }
    }
}
// Run the main function
processItems();