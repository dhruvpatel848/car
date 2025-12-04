const xlsx = require('xlsx');
const path = require('path');

const file = 'e:/car/service table.xlsx';
const workbook = xlsx.readFile(file);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const fs = require('fs');

const output = {
    headers: data[0],
    rows: data.slice(1).filter(row => row.length > 0)
};

fs.writeFileSync('excel_dump.json', JSON.stringify(output, null, 2));
console.log('Data written to excel_dump.json');
