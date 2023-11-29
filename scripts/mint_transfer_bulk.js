const mint = require('../scripts/nfts')
const transferNFT = require('../scripts/transfer')
const fs = require('fs');
const path = require('path');


const directory = './images/bulk'

const user_addresses = [
    '0x79198Ffe6ff89ed71eFD362cF411F8982e2B61ab',   //Equipo 1
    //,
    '0x09238e58d04029c05e18b4044e56c56A992218a7',   //Equipo 3
    '0x947d9640703f2F11bbd6CCcf63D001C421d6ae67',   //Equipo 4
    '0x907cB51bAA17C0A85825f28Cc53C32A0435938a5',   //Equipo 5
    '0x05f73d32a2aBae186bD0DBCACfaDD7C79d6FA943',   //Equipo 6
    '0xD698C796Ddb76AC0716cEc75D74A13c0A7A078EE',   //Equipo 7
    '0xbb5a3b6902ee652eea4073abb349d892561caa29',   //Equipo 8
    // Equipo 9 (nosotros),
    '0x90ca446ecBE474288562BeF18D5723094b851806',   //Equipo 10
    '0x6e1A8b9c92650740f6951d13bF44F90557f89C30',   //Equipo 11
]

const descs = ['Andres con el pelo largo','Foto en el tec durante la pandemia','Live morin reaction','Cumpleanos de Morin','Salida a plaza hierro','Foto en el bano de sistemas','Salida con todos','Despues de salir del ulitmo examen de Uriel','Primera ida a waldos']

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
          url: `${directory}/${file}`, // You can modify this to match your actual URL structure
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
const images = getFilesArray(directory);


for (let index = 0; index < images.length; index++) {
  images[index].desc = descs[index];
}
console.log(images)

async function ExecuteBulk(){
  const mintedNFTs = []

  for(image of images){
    const nft = await mint.wholeMintProcess(image.url,image.name,image.desc)
    mintedNFTs.push(nft)
  }

  console.log(mintedNFTs);

  const transactions = [];
  if(mintedNFTs.length === user_addresses.length){
    for (let index = 0; index < user_addresses.length; index++) {
      const tx = await transferNFT.transferNFT(user_addresses[index],mintedNFTs[index].tokenId)
      transactions.push(tx)
      
    }
  }
  console.log(transactions)
}

ExecuteBulk();

/*
[
  {
    transaction: '0x061ea7ce0e70b9243be904f12332cede23d9683d23b05cc6d8df857e856e3e88',
    tokenId: 2
  },
  {
    transaction: '0x96083f46f9e3f84843099d1f7c2f3bb2ed3e32f68b637cde838312a46fe5eae6',
    tokenId: 3
  },
  {
    transaction: '0x57b08261f2c5baa4ead2b68000824e871f34825b2b5246e69ac7d1151ea32ba2',
    tokenId: 4
  },
  {
    transaction: '0x25420587b9e5e96441f82a47da549a502405fd6f579cf9685e92aa41d06b28ab',
    tokenId: 5
  },
  {
    transaction: '0xd8fbb44bd7b5f385c01bd34c2a0c2d1ec67b14bb0995d1c1b484afeed3952b4b',
    tokenId: 6
  },
  {
    transaction: '0x59fe83e8aada1aef1c17933fea9c79b433547408150da31f896237390facde64',
    tokenId: 7
  },
  {
    transaction: '0x9c503de3682b152dfec9dcd10c63c8634a9b9f9d2f6cf2a7e154a2f8b5e241cc',
    tokenId: 8
  },
  {
    transaction: '0xb867be544ec34dcf1f7234305f4615bc46a85dd71cb9c3f281951c1c9d855db0',
    tokenId: 9
  },
  {
    transaction: '0x50a13dc1016a8306813683e8891f92891925fa8a7ebd283f66f71e368f3975fc',
    tokenId: 10
  }
]
*/