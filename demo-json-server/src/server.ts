import { bodyParser, create, defaults, rewriter, router } from 'json-server';
import { generateMockDB } from './files';
import { customRoutes } from './routes';

const server = create();
const middlewares = defaults();

server.use(bodyParser);
server.use(middlewares);

const API_ROOT = '/api';

const localJsonDB = generateMockDB(__dirname);

setTimeout(() => {
	server.use(router(localJsonDB));
}, 100);

// you can use the one used by JSON server

server.use((req, res, next) => {
	const { method, url, body } = req;
	if (method === 'POST') {
		console.log({ url, body });
	}
	// continue the JSON Server
	next();
});

// handle  user login
server.post(`${API_ROOT}/login`, (req, res) => {
	const { body } = req;
	if ((body.username === 'admin', body.password === 'admin')) {
		body.createdAt = Date.now();
		res.status(200).json({ statusCode: 200 });
	}
});

const isAuthorized = (req) => {
	console.log({ url: req.url });
	// const isLoggedIn = localStorage.getItem('ACCESS_TOKEN')  !== null;
	return true;
};

server.use((req, res, next) => {
	if (isAuthorized(req)) {
		next(); // continue to JSOn server router
	} else {
		res.sendStatus(401);
	}
});

server.use(rewriter(customRoutes));

//server.use(router);

// port choose

const args = process.argv.slice(2);
console.log({ args });
const PORT = args[0] == '--port' ? args[1] : 3003;

server.listen(PORT, () => {
	console.info('JSON server running on port: ' + PORT);
});
