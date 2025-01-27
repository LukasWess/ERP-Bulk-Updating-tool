const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

async function processFolders() {
  try {
    await fs.ensureDir(path.dirname(config.outputFile));
    
    const folders = (await fs.readdir(config.inputDirectory))
      .sort() // Sort folders alphabetically for consistent numbering
      .filter(f => f.startsWith('SB') && f.includes('NPS') && f.includes('#'));

    const records = folders.map((folder, index) => {
      const record = {};
      Object.entries(config.columnMappings).forEach(([column, mapper]) => {
        try {
          record[column] = mapper(folder, index);
        } catch (error) {
          console.warn(`Error in ${folder}: ${error.message}`);
          record[column] = 'INVALID';
        }
      });
      return record;
    });

    // Write the "Articles" header
    const csvWriter = createObjectCsvWriter({
      path: config.outputFile,
      header: [{ title: 'Articles' }],
      fieldDelimiter: ';', // Use semicolon as the field separator
      alwaysQuote: true
    });
    await csvWriter.writeRecords([{ Articles: 'Articles' }]);

    // Write the column headers
    const columnHeaders = Object.keys(config.columnMappings).map(col => ({
      id: col,
      title: col
    }));
    const csvWriterWithColumns = createObjectCsvWriter({
      path: config.outputFile,
      header: columnHeaders,
      append: true,
      fieldDelimiter: ';', // Use semicolon as the field separator
      alwaysQuote: true
    });
    await csvWriterWithColumns.writeRecords([Object.fromEntries(columnHeaders.map(header => [header.id, header.title]))]);

    // Write the records
    await csvWriterWithColumns.writeRecords(records);
    console.log(`Generated CSV with ${records.length} valid entries`);

  } catch (error) {
    console.error('Processing failed:', error.message);
  }
}

processFolders();