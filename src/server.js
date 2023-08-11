import http from 'http';
import socketIo from 'socket.io';
import express from 'express';
import { routes } from './routes';
import { db } from './db';
import * as admin from 'firebase-admin';
import credentials from "./configs/credentials.json";
import {protectRoute} from "./routes/protect-route";
import {getConversation} from "./db/get-conversation";
import {listenerCreaters} from "./event-listeners";

admin.initializeApp({
	credential: admin.credential.cert(credentials),
});

const app = express();

app.use(express.json());

routes.forEach(route => {
	app[route.method](route.path, protectRoute, route.handler);
});

const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: '*',
		methods: '*',
	}
});

io.use(async (socket, next) => {
	if(!socket.handshake.query || !socket.handshake.query.token) {
		socket.emit('error', 'You need to include an auth token');
	}

	const user = await admin.auth().verifyIdToken(
		socket.handshake.query.token,
	);

	socket.user = user;

	next();
});

io.on('connection', async (socket) => {
	const {conversationId} = socket.handshake.query;
	console.log('A new Client connected to socket.io');

	const conversation = await getConversation(conversationId);
	socket.join(conversation._id.toString());
	socket.emit('initialMessages', conversation.messages);

	listenerCreaters.forEach(createListener => {
		const listener = createListener(socket, io);
		socket.on(listener.name, listener.handler);
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected')
	});
});

const start = async () => {
	await db.connect('mongodb://127.0.0.1:27017');
	await server.listen(8080);
	console.log('Server is listening on port 8080')
};

start();