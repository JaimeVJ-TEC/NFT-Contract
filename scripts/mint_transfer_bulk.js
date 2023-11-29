const mint = require('../scripts/nfts')
const transferNFT = require('../scripts/transfer')
const fs = require('fs');
const path = require('path');


const directory = './images/bulk'

const user_addresses = [
]

const descs = []

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
