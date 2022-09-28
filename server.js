const http = require('http'); 
const CONSTANTS = require('./utils/constants.js');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const { PORT, CLIENT } = CONSTANTS;


// Create the HTTP server
const server = http.createServer((req, res) => {
  const filePath = ( req.url === '/' ) ? '/public/index.html' : req.url;

  // determine the contentType by the file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  if (extname === '.js') contentType = 'text/javascript';
  else if (extname === '.css') contentType = 'text/css';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(`${__dirname}/${filePath}`, 'utf8').pipe(res);
});



// creating the WebSocket Server using the HTTP server with ws framework
const wsServer = new WebSocket.Server({server});

// responding to connection events 
wsServer.on('connection', (socket) => {
  // passing on the message to broadcast function
  socket.on('message', (data) => {
    broadcast(data, socket)
  })
  // logging when new client is connected 
  console.log('New client connected!');
});


function broadcast(data, socketToOmit) {
  //implement the broadcast pattern. Exclude the emitting socket. Data is message. 
    wsServer.clients.forEach(connectedClient => {
      if(connectedClient.readyState === WebSocket.OPEN && connectedClient != socketToOmit) {
        connectedClient.send(data)
      }
    })

}

//start the server listening on localhost:8080
server.listen(PORT, () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});




/* const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 8080}, () => {
    console.log('server started')
})

wss.on('connection', (ws) => {

    
    ws.on('message', (data) => {
        console.log('data received ' + data)
        ws.send(data)
    })
})
wss.on('listening', ()=> {
    console.log('server is listening to port 8080')
}) */