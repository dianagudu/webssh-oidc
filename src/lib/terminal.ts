import { Terminal as xterm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

export class Terminal {
	handle: xterm;
	elementRef: HTMLElement;
	socket: WebSocket | undefined;
	_fitAddon: FitAddon;

	constructor(target: HTMLElement) {
		this.elementRef = target;
		this._fitAddon = new FitAddon();
		this.handle = new xterm({
			windowsMode: window.navigator.userAgent.match(/Windows/g) ? true : false,
			scrollback: 1000,
			scrollOnUserInput: true,
			smoothScrollDuration: 100,
			rows: 40,
			cols: 80,
			cursorBlink: true,
			cursorStyle: 'bar',
			fontFamily: 'Fira Code, monospace',
			fontSize: 12,
			theme: {
				background: 'mc-gray-600',
				foreground: 'mc-gray-100'
			},
			allowProposedApi: true
		});
		this.handle.loadAddon(this._fitAddon);
		this.handle.loadAddon(new WebLinksAddon());

		this.handle.open(this.elementRef);
		this._fitAddon.fit();
		this.handle.focus();
	}

	public initSocket(socket: WebSocket) {
		this.socket = socket;
		this.handle.onData((data) => {
			socket.send(data);
		});

		socket.addEventListener('message', (event) => {
			this.handle.write(event.data);
		});
	}

	public resize() {
		if (this._fitAddon) {
			this._fitAddon.fit();
		}
	}
}
