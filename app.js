var WebSocketServer = require('ws').Server;
var appengine = require('appengine');
var http = require('http');
var express = require('express');
var app = express();

var server = http.createServer(app);
app.use(express.static(__dirname + '/public'));
app.use(appengine.middleware.base);

app.get('/_ah/health', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
});

app.get('/_ah/start', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
});

/*app.get('/_ah/stop', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
  process.exit();
});*/

server.listen(8080, '0.0.0.0');

var wss = new WebSocketServer({host: '0.0.0.0', port: 3000});
wss.on('connection', function(ws){
  console.log('socket connected');

  ws.on('message', function incoming(data){
    console.log('message received: '+data);
    ws.send('you say: '+data);
  });

  ws.on('error', function error(err){
    console.log('socket closed by error: '+err);
    ws.terminate();
  });
});

wss.on('error', function(err){
  console.log('server closed by error: '+err);
  server.close();
});
