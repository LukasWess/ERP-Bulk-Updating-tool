// config.js
module.exports = {
    inputDirectory: './input',
    outputFile: './output/erp-import.csv',
    columnMappings: {
      'Number': (_, index) => `PF-SB-${String(index + 1).padStart(5, '0')}`,
      'Description': (folderName) => {
        return folderName;
      },
      'Type': () => '1',
      'GroupName': () => 'Spectacle Blind - SB',
      'Weight': (folderName) => {
        const match = folderName.match(/NPS\s*(\d+(\.\d+)?)#/);
        if (!match) throw new Error('Invalid folder format');
        const pressureClass = match[1];
        return `${pressureClass}`;
      },
      'Width': (folderName) => {
        const match = folderName.match(/SB\s*(\d+(\.\d+)?)NPS/);
        if (!match) throw new Error('Invalid folder format');
        const npsSize = match[1].replace('.', ',');
        return npsSize;
      },
      'Length': () => '100',
      'Height': () => '100',
      'QuantityFormulaId': () => '1',
      'MeasureUnitForInventoryQty': () => 'pcs',
      'MeasureUnit': () => 'pcs',
      'SupplierNumber': () => '2'
    }
  };
Ønkset navn: 
  npsSize, pressureclass, FF, "Specticleblind"

  //modellbilde fra pdf inkluderes '
  //inkludere step fil. 