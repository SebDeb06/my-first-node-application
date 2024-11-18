const express = require(`express`);
const path = require(`path`);
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');

const app = express();
const port = 3000;

const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
});

const broadcastReload = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === 1){
            client.send('reload');
        }
    });
};

fs.watch(path.join(__dirname, 'public'), { recursive: true}, (eventType, filename) => {
    console.log(`File changed: ${filename}`);
    broadcastReload();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'aboutpage.html'));
});

app.get('/rune', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'is-it-true.html'));
});

app.get('/egil', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view', 'it-is-a-int.html'));
});

wss.on('connection', (ws) => {
    console.log('WebSocket connected');
});

server.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})