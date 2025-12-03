const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join('e:', 'car', 'service table.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('--- SUV Prices ---');
data.filter(r => (r['Car Category'] || r['Segment'] || '').toLowerCase().includes('suv'))
    .forEach(r => console.log(`${r['Service']}: ${r['Starting Price (?)']}`));

console.log('\n--- Luxury Prices ---');
data.filter(r => (r['Car Category'] || r['Segment'] || '').toLowerCase().includes('luxury'))
    .forEach(r => console.log(`${r['Service']}: ${r['Starting Price (?)']}`));
