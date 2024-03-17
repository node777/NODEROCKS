const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Function to convert JSON to CSV
function jsonToCsv(jsonFileName, csvFileName) {
  // Read JSON file
  const jsonData = JSON.parse(fs.readFileSync(jsonFileName, 'utf8'));
  const ids = jsonData.map(item => item.id);

  // Converting to CSV format
  const csvContent = ids.join(',');
  
  // Writing to a CSV file
  fs.writeFileSync(csvFileName, csvContent, 'utf8');
}

// Example usage
const jsonFileName = 'output/output4.json';
const csvFileName = 'output/id.csv';

jsonToCsv(jsonFileName, csvFileName);
