const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join('e:', 'car', 'service table.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetNames = workbook.SheetNames;
console.log('Sheet Names:', sheetNames);

sheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`\n--- Data for sheet: ${sheetName} ---`);
    // Log first 5 rows to understand structure
    console.log(data.slice(0, 5));
});
