const keyModel = require('../models/keyModel');

exports.generateKeys = (req, res) => {
    const coinType = req.params.coinType; // Rota parametresinden coin tipini al
    const pageNumber = BigInt(req.params.pageNumber); // Rota parametresinden sayfa numarasını al
    const keysPerPage = 128;
    const totalKeys = 904625697166532776746648320380374280100293470930272690489102837043110636675; // Örnek olarak kullanıldı. Gerçekte bu bilgiyi bir API'den veya veritabanından alabilirsiniz.
    const totalPages = (BigInt(totalKeys) / BigInt(keysPerPage)).toString();
    const randomPage = keyModel.randomBigInt(totalKeys)

    let keys;
    let viewFile = 'index'; // Varsayılan olarak index.ejs dosyasını kullan

    switch (coinType) {
        case "btc":
            keys = keyModel.generateBitcoinKeys(pageNumber, keysPerPage);
            break;
        case "eth":
            keys = keyModel.generateEthereumKeys(pageNumber, keysPerPage);
            viewFile = 'eth'; // coinType "eth" ise eth.ejs dosyasını kullan
            break;
        default:
            return res.send("Invalid coin type");
    }

    res.render(viewFile, {keys, totalPages, currentPage: req.params.pageNumber, coinType, randomNumber: randomPage.toString()});
};
