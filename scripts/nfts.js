require('dotenv').config();
const fs = require('fs');
const formData = require('form-data');
const {ethers} = require('ethers');
const axios = require('axios')

const contract = require("../artifacts/contracts/NFTContract.sol/Argram.json");

const {
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    API_URL,
    PRIVATE_KEY,
    PUBLIC_KEY,
    CONTRACT_ADDRESS
} = process.env;

async function createImgInfo(image_url){
    const authResponse = await axios.get("https://api.pinata.cloud/data/testAuthentication", {
        headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
        },
    });
    console.log(authResponse)

    const stream = fs.createReadStream(image_url)
    const data = new formData();
    data.append("file",stream);
    const fileResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
            headers:{
                "Content-Type":`multipart/form-data; bundary=${data._boundary}`,
                pinata_api_key:PINATA_API_KEY,
                pinata_secret_api_key:PINATA_SECRET_KEY
            }
        }
    )

    const {data:fileData={}} = fileResponse;
    const {IpfsHash} = fileData;
    const fileIPFS = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
    return fileIPFS;
}

// createImgInfo();
// https://gateway.pinata.cloud/ipfs/QmUZwDcvuhLtqcsC45J3NdUXBWrS5Yyeek62Na3PDsJLWt

async function createJsonInfo(fileIPFS,name,desc) {
    const metadata = {
        image: image_url,
        name: name,
        description: desc,
        attributes: [
            { "trait_type": "color", "value": "yellow" },
            { "trait_type": "background", "value": "white" },
        ]
    }
    const pinataJSONBody = {
        pinataContent: metadata
    }
    const jsonResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        pinataJSONBody,
        {
            headers: {
                "Content-Type": "application/json",
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY
            }
        }
    )
    const { data: jsonData = {} } = jsonResponse;
    const { IpfsHash } = jsonData;
    const tokenURI = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
    return tokenURI;
}

// createJsonInfo();
//https://gateway.pinata.cloud/ipfs/QmefQPgKcYJ7pwMCdsoRUH1evVq1T3DdmwZT1wmak2VTKy

async function mintNFT(tokenURI){
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const etherInterface= new ethers.utils.Interface(contract.abi);
    const nonce = await provider.getTransactionCount(PUBLIC_KEY,"latest");
    const gasPrice = await provider.getGasPrice();
    const network = await provider.getNetwork();
    const {chainId} = network;
    const transaction={
        from: PUBLIC_KEY,
        to: CONTRACT_ADDRESS,
        nonce,chainId,gasPrice,
        data:etherInterface.encodeFunctionData("mintNFT",
        [
            PUBLIC_KEY,
            tokenURI
        ])
    }
    const estimateGas = await provider.estimateGas(transaction);
    transaction["gasLimit"] = estimateGas;
    const signedTx = await wallet.signTransaction(transaction);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    await transactionReceipt.wait();
    const hash = transactionReceipt.hash;
    console.log("Your Transactions hash is:",hash)

    const receipt = await provider.getTransactionReceipt(hash);
    const {logs} = receipt;
    const tokenInBigNumber = ethers.BigNumber.from(logs[0].topics[3]);
    const tokenId= tokenInBigNumber.toNumber();
    console.log("NFT token id: ",tokenId);

    return {transaction: hash, tokenId:tokenId}
}

async function wholeMintProcess(image_url,name,desc){
    const fileIPFS = await createImgInfo(image_url);
    const tokenURI = await createJsonInfo(fileIPFS,name,desc);
    const result = await mintNFT(tokenURI);
    return result;
}

export default wholeMintProcess;