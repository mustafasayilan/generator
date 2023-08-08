const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const keyController = require('./controllers/keyController');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Statik dosyaları sunmak için 'public' klasörünü ve 'node_modules' klasörünü belirtin
app.use(express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', { keys: null });
});

app.get('/:coinType/:pageNumber', keyController.generateKeys);


app.post('/save-keys', (req, res) => {
    console.log('Yeni kayıt var ');
    const data = req.body;
    const line = `Compressed: ${data.compressedAddress}, Uncompressed: ${data.uncompressedAddress} , WIF ${data.pkey}\n`;

    fs.appendFile('bulunanlar.txt', line, (err) => {
        if (err) {
            console.error('Dosyaya yazılırken hata oluştu:', err);
            return res.status(500).send('Dosyaya yazılırken bir hata oluştu.');
        }
        res.send('Başarıyla kaydedildi!');
    });
});

app.post('/save-keys-eth', (req, res) => {
    console.log('Yeni kayıt var ');
    const data = req.body;
    const line = `Address: ${data.address}, WIF ${data.privateKey}\n`;

    fs.appendFile('bulunanlar.txt', line, (err) => {
        if (err) {
            console.error('Dosyaya yazılırken hata oluştu:', err);
            return res.status(500).send('Dosyaya yazılırken bir hata oluştu.');
        }
        res.send('Başarıyla kaydedildi!');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
