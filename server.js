// @ts-check

import { handler } from './build/handler.js';
import { NodeSSH } from 'node-ssh';
import express from 'express';
import ews from 'express-ws';

const port = 8444;

const app = express();
ews(app);
var router = express.Router();

const CLOSE_REASON = {
	normal: { code: 1000, data: 'Websocket was closed normally' },
	logout: { code: 4000, data: 'User logged out' },
	error: { code: 4001, data: 'An error occurred' },
	timeout: { code: 4002, data: 'Session timed out' }
};

router.ws('/connect', async function (ws, req) {
	const accessToken = req.headers['sec-websocket-protocol'];
	const sshHostname = req.query.sshHostname?.toString();
	const sshPort = Number(req.query.sshPort?.toString());
	const username = req.query.username?.toString();

	if (!accessToken) {
		ws.close(CLOSE_REASON.error.code, "Missing 'sec-websocket-protocol' header");
		return;
	}
	if (!sshHostname) {
		ws.close(CLOSE_REASON.error.code, "Missing 'sshHostname' query parameter");
		return;
	}
	if (!sshPort) {
		ws.close(CLOSE_REASON.error.code, "Missing 'sshPort' query parameter");
		return;
	}
	if (!username) {
		ws.close(CLOSE_REASON.error.code, "Missing 'username' query parameter");
		return;
	}

	const ssh = new NodeSSH();
	const sshConnection = await ssh
		.connect({
			host: sshHostname,
			port: sshPort,
			username: username,
			tryKeyboard: true,
			onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
				if (prompts.length > 0 && prompts[0].prompt.includes('Access Token')) {
					finish([accessToken]);
				}
			}
		})
		.catch((err) => {
			console.error(CLOSE_REASON.error.code, 'Failed to connect to SSH server');
			ws.close(CLOSE_REASON.error.code, 'Failed to connect to SSH server');
			return null;
		});

	if (!sshConnection) return;

	// console.log('connected.', sshConnection.isConnected());

	const channel = await sshConnection
		.requestShell({
			term: 'xterm-256color'
		})
		.catch((err) => {
			console.log(err);
			ws.close(CLOSE_REASON.error.code, 'Failed to open shell');
			return null;
		});

	// console.log('shell opened:', channel === null ? 'no' : 'yes');
	if (!channel) return;

	channel.addListener('data', (data) => {
		ws.send(data.toString('utf8'));
	});

	channel.addListener('close', () => {
		ws.close(CLOSE_REASON.normal.code, CLOSE_REASON.normal.data);
	});

	channel.addListener('error', (err) => {
		// console.log('Dead.');
		ws.close(CLOSE_REASON.error.code, CLOSE_REASON.error.data + ': ' + err);
	});

	ws.on('resize', (msg) => {
		// console.log('RESIZE: ', { msg });
		channel.setWindow(msg.rows, msg.cols, msg.height, msg.width);
	});

	ws.on('message', (msg) => {
		if (channel.writable) {
			channel.write(msg);
		} else {
			console.warn('Channel not writable. Message dismissed: ', msg);
		}
	});

	ws.on('close', () => {
		// console.log('out.');
		try {
			channel.close();
			sshConnection.dispose();
		} catch (_) {
			console.warn('some oopsie happened.');
		}
	});
});

app.set('trust proxy', 1);
app.use('/ws', router);
app.use(handler);

app.listen(port, async () => {
	console.log(`Started server on port ${port}.`);
});

export { app };
