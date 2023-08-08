// keyModel.js
const bitcoin = require('bitcoinjs-lib');
const bigInt = require('big-integer');
const ethUtil = require("ethereumjs-util");

function generateBitcoinKeys(pageNumber, keysPerPage) {
    const keys = [];
    const start = (pageNumber - BigInt(1)) * BigInt(keysPerPage);

    for (let i = 0; i < keysPerPage; i++) {
        const index = start + BigInt(i);
        const hexString = index.toString(16).padStart(64, '0');
        const privateKeyBuffer = Buffer.from(hexString, 'hex');

        try {
            const keyPair = bitcoin.ECPair.fromPrivateKey(privateKeyBuffer);

            const compressedAddress = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
            const uncompressedKeyPair = bitcoin.ECPair.fromPrivateKey(privateKeyBuffer, { compressed: false });
            const uncompressedAddress = bitcoin.payments.p2pkh({ pubkey: uncompressedKeyPair.publicKey }).address;
            const p2shAddress = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }) }).address;
            const bech32Address = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey }).address;
            const wif = keyPair.toWIF();

            keys.push({ compressedAddress, uncompressedAddress, p2shAddress, bech32Address, privateKey: hexString, wif });
        } catch (error) {
            console.error(`Error generating key for index ${i}: ${error.message}`);
            continue;
        }
    }
    return keys;
}



function generateEthereumKeys(pageNumber, keysPerPage) {
    const keys = [];
    const start = (BigInt(pageNumber) - 1n) * BigInt(keysPerPage);



    for (let i = 0; i < keysPerPage; i++) {
        const index = start + BigInt(i);
        const hexString = index.toString(16).padStart(64, '0'); // 32 baytlık bir değeri temsil eden 64 karakterli bir hex stringe dönüştürün
        const privateKeyBuffer = Buffer.from(hexString, 'hex');

        // Özel anahtarın boyutunu kontrol edin
        if (privateKeyBuffer.length !== 32) {
            console.warn(`Invalid private key length for index ${i}: ${privateKeyBuffer.length}`);
            continue;
        }

        try {
            const publicKey = ethUtil.privateToPublic(privateKeyBuffer);
            const address = "0x" + ethUtil.publicToAddress(publicKey).toString('hex'); // '0x' önekini ekleyin
            const checksumAddress = ethUtil.toChecksumAddress(address);

            keys.push({
                privateKey: privateKeyBuffer.toString('hex'),
                address: checksumAddress
            });
        } catch (error) {
            console.error(`Error generating key for index ${i}: ${error.message}`);
            continue;
        }
    }

    return keys;
}







function randomBigInt(maxValue) {
    const maxBigInt = BigInt(maxValue);
    const randomValue = BigInt(Math.floor(Math.random() * Number(maxValue))); // Generate a random BigInt within the range

    return randomValue % (maxBigInt + 1n);
}


module.exports = {
    randomBigInt,
    generateBitcoinKeys,
    generateEthereumKeys
};
