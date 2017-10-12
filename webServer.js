var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var path = require('path');

var ip = require("ip");
console.dir ( ip.address() );
var mySocket = 0;

app.listen(3000);

function handler(req, res) {
   var filePath = '.' + req.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });
            }
            else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                res.end(); 
            }
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}



io.sockets.on('connection', function (socket) {
    mySocket = socket;
});

var dgram = require("dgram");
var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
    if (mySocket != 0) {
        mySocket.emit('field', "" + msg);
        mySocket.broadcast.emit('field', "" + msg);
    }
});

server.on("listening", function () {
    var address = server.address(); 
    console.log( server.address().address );
    console.log("UDP SERVIDOR QUE ESCUCHA : " + address.address + ":" + address.port);
});




server.bind(41181);