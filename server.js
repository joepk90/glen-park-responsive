var StaticServer = require('static-server');

var server = new StaticServer({
  rootPath: './source/',
  port: 4000
})

server.start(function() {
  console.log('Server started on port' + server.port);
});
