<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { errorMessage, loginParams } from '$lib/stores';
	import { onMount } from 'svelte';
	import 'xterm/css/xterm.css';
	import { FitAddon } from 'xterm-addon-fit';
	import { WebLinksAddon } from 'xterm-addon-web-links';
	import ResizeObserver from 'svelte-resize-observer';

	type WsCloseType = {
		code: number;
		data: string;
	};

	let fitAddon: FitAddon;
	let termDiv: HTMLDivElement;

	onMount(async () => {
		const accessToken = $page.data.session?.accessToken;
		if (!accessToken || !loginParams) {
			$errorMessage = 'Please log in again.';
			goto('/');
		}
		let xterm = await import('xterm');
		if (termDiv) {
			let term = new xterm.Terminal({
				scrollback: 1000,
				scrollOnUserInput: true,
				smoothScrollDuration: 100,
				rows: 48,
				cols: 160,
				cursorBlink: true,
				cursorStyle: 'block',
				fontFamily: 'Fira Code, monospace',
				fontSize: 12,
				theme: {
					background: 'mc-gray-600',
					foreground: 'mc-gray-100'
				}
			});

			// loadd all addons
			fitAddon = new FitAddon();
			term.loadAddon(fitAddon);
			term.loadAddon(new WebLinksAddon());

			term.open(termDiv);
			fitAddon.fit();
			term.focus();

			const ws_url = new URL('ws://localhost:8444/ws/connect');
			ws_url.searchParams.set('sshHostname', $loginParams?.sshHost.hostname);
			ws_url.searchParams.set('sshPort', $loginParams?.sshHost.port);
			ws_url.searchParams.set('username', $loginParams?.username);

			let timeout: NodeJS.Timeout | undefined = undefined;

			// connect to websocket and timeout after a few seconds
			const ws = new WebSocket(ws_url, accessToken);
			ws.onopen = () => {
				if (timeout) {
					clearTimeout(timeout);
				}
			};
			ws.onmessage = (event) => {
				term.write(event.data);
			};
			ws.onclose = (ev: CloseEvent) => {
				console.log('WebSocket closed', { ev });
				if (ev.code !== 1000) {
					// 1000 = normal close (https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
					$errorMessage = ev.reason;
				}
				setTimeout(() => {
					goto('/');
				}, 500);
			};
			timeout = setTimeout(() => {
				$errorMessage = 'Could not connect to SSH server.';
				goto('/');
			}, 3000);

			return term.onKey(({ key }) => {
				ws.send(key);
			});
		}
	});

	function handleResize(e: CustomEvent) {
		if (fitAddon) {
			fitAddon.fit();
		}
	}
</script>

<div class="m-0 p-20">
	<div
		class="rounded overflow-clip bg-black shadow-md shadow-neutral-400 p-2"
		bind:this={termDiv}
	/>
	<div class="absolute top-0 bottom-0 left-0 right-0">
		<ResizeObserver on:resize={handleResize} />
	</div>
</div>

<style>
	:global(.xterm .xterm-viewport) {
		/* see : https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440 */
		width: initial !important;
		overflow-y: hidden !important;
	}

	:global(.xterm .xterm-scroll-area) {
		visibility: hidden;
	}
</style>
