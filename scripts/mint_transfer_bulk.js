// const mint = require('./nfts')
// const transferNFT = require('./transfer')
const fs = require('fs');
const path = require('path');


const directory = './images/bulk'

const user_addresses = [
    '0x79198Ffe6ff89ed71eFD362cF411F8982e2B61ab',   //Equipo 1
    //,
    '0x09238e58d04029c05e18b4044e56c56A992218a7',   //Equipo 3
    // ,
    '0x907cB51bAA17C0A85825f28Cc53C32A0435938a5',   //Equipo 5
    '0x05f73d32a2aBae186bD0DBCACfaDD7C79d6FA943',   //Equipo 6
    '0x35eb3F93B0149Dc8E1b3656979707299457e22Cc',   //Equipo 7
    '0xbb5a3b6902ee652eea4073abb349d892561caa29',   //Equipo 8
    // Equipo 9 (yo),
    '0x90ca446ecBE474288562BeF18D5723094b851806',   //Equipo 10
    '0x6e1A8b9c92650740f6951d13bF44F90557f89C30',   //Equipo 11
]

const images = [
    {
        url:''
    }
]

function getFilesArray(directoryPath) {
    const fileArray = [];
  
    try {
      const files = fs.readdirSync(directoryPath);
  
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
  
        // Get the file name without extension
        const fileNameWithoutExtension = path.parse(file).name;
  
        // Create an object with the specified structure
        const fileObject = {
          url: `/${file}`, // You can modify this to match your actual URL structure
          name: fileNameWithoutExtension,
          desc: '', // You can provide a description later
        };
  
        // Push the object to the array
        fileArray.push(fileObject);
      });
  
      return fileArray;
    } catch (err) {
      console.error('Error reading directory:', err);
      return null;
    }
  }
  
// Example usage
const directoryPath = '/path/to/your/directory';
const result = getFilesArray(directory);

if (result) {
console.log(result);
} else {
console.log('Failed to retrieve files array.');
}