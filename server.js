const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const keyController = require('./controllers/keyController');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
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

io.on('connection', (socket) => {
    //console.log('Bir kullanıcı bağlandı');

    socket.on('sendData', (encryptedData) => {
        const data = JSON.parse(atob(encryptedData));
        // Burada data'yı işleyebilirsiniz.
        const line = `Compressed: ${data.compressedAddress}, Uncompressed: ${data.uncompressedAddress}, p2sh: ${data.p2shAddress} , bech32Address: ${data.bech32Address}  , WIF ${data.pkey}\n`;
        fs.appendFile('bulunanlar.txt', line, (err) => {
            if (err) {
                console.error('Dosyaya yazılırken hata oluştu:', err);
            }
        });
    });

    socket.on('sendDataEth', (encryptedData) => {
        const data = JSON.parse(atob(encryptedData));
        const line = `Address: ${data.address}, WIF ${data.privateKey}\n`;
        fs.appendFile('bulunanlar.txt', line, (err) => {
            if (err) {
                console.error('Dosyaya yazılırken hata oluştu:', err);
            }
        });
    });

    socket.on('disconnect', () => {
        //console.log('Kullanıcı bağlantıyı kesti');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
