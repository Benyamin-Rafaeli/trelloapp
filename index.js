const jsonServer = require('json-server');
const auth = require('json-server-auth');

const server = jsonServer.create();

const defaults = jsonServer.defaults({ static: '.' });
const busboy = require('connect-busboy');
const history = require('connect-history-api-fallback');
const middleware = require('./middleware');

const router = jsonServer.router('./public/data/data.json');

server.db = router.db;
server.use(history());
server.use(defaults);
server.use(busboy());
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/users/*': '/600/users/$1',
}));
server.use(auth);
server.use(jsonServer.bodyParser);
server.use(middleware);

server.use(router);
const app = server.listen(3000, () => {
  console.log('🚀 Trello app is up and running at:\n');
  console.log('\x1b[4m\x1b[33m%s\x1b[0m', 'http://localhost:3000\n'); // yellow
  console.log('Enjoy!');
});

const io = require('socket.io')(app);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('updatedBoard', () => {
    console.log('something got updated');
  });
});