import { handler } from './build/handler.js';
import { NodeSSH } from 'node-ssh';
import express from 'express';
import ews from 'express-ws';

const ssh = new NodeSSH();
const app = express();
ews(app);
var router = express.Router();
// var routerSvelte = express.Router()

const CLOSE_REASON = {
	normal: { code: 1000, data: 'Websocket was closed normally' },
	logout: { code: 4000, data: 'User logged out' },
	error: { code: 4001, data: 'An error occurred' },
	timeout: { code: 4002, data: 'Session timed out' }
};

router.ws('/connect', function (ws, req) {
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
	(async () => {
		// console.log({ accessToken });
		ssh
			.connect({
				host: sshHostname,
				port: sshPort,
				username: username,
				tryKeyboard: true,
				onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
					// console.log(
					// 	'onKeyboardInteractive',
					// 	{ name },
					// 	{ instructions },
					// 	{ instructionsLang },
					// 	{ prompts }
					// );
					if (prompts.length > 0 && prompts[0].prompt.includes('Access Token')) {
						finish([accessToken]);
					}
				}
			})
			.then(async () => {
				ssh
					.requestShell({
						term: 'xterm-256color'
					})
					.then((shell) => {
						shell.addListener('data', (chunk) => {
							// console.log('LISTENER: ' + chunk.toString('utf8'));
							ws.send(chunk.toString('utf8'));
						});
						shell.addListener('close', () => {
							// console.log('SHELL CLOSED');
							ws.close(CLOSE_REASON.normal.code, CLOSE_REASON.normal.data);
						});
						shell.addListener('error', (err) => {
							// console.log('SHELL ERROR: ' + err);
							ws.close(CLOSE_REASON.error.code, CLOSE_REASON.error.data + ': ' + err);
						});
						ws.on('message', (msg) => {
							// console.log('SEND: ' + msg);
							shell.write(msg);
						});
					});
			})
			.catch((err) => {
				console.log('Something went wrong when trying to start SSH session: ' + err);
				ws.close(CLOSE_REASON.error.code, 'SSH connect - ' + err);
			});
	})();
});

// routerSvelte.use(handler)
// app.use('/svelte', routerSvelte)
app.use('/ws', router);
app.use(handler);

app.listen(8444, async () => {
	console.log('Started server on port 8444.');
});

export { app };
