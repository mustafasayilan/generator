const bigInt = require('big-integer');
const ethUtil = require('ethereumjs-util');

exports.generateEthereumKeys = (req, res) => {
    const pageNumber = req.params.pageNumber || 1;
    const keysPerPage = 128; // Varsayılan olarak 128 adres oluşturulacak.
    const keys = generateEthereumKeys(pageNumber, keysPerPage);

    res.render('eth', {
        keys: keys,
        currentPage: pageNumber,
        randomNumber: bigInt.randBetween(1, bigInt(2).pow(256)).toString()
    });
};

function generateEthereumKeys(pageNumber, keysPerPage) {
    const keys = [];
    const start = bigInt(pageNumber).multiply(keysPerPage);
    for (let i = 0; i < keysPerPage; i++) {
        const index = start.add(i);
        const privateKeyBuffer = Buffer.from(index.toString(16), 'hex'); // Bu satırı değiştirdik
        const publicKey = ethUtil.privateToPublic(privateKeyBuffer);
        const address = ethUtil.publicToAddress(publicKey).toString('hex');
        keys.push(address);
    }
    return keys;
}

