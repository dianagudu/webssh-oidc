<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { errorMessage, loginParams } from '$lib/stores';
	import { onMount } from 'svelte';
	import 'xterm/css/xterm.css';
	import ResizeObserver from 'resize-observer-polyfill';

	let termDiv: HTMLDivElement;
	let handleResize: () => void = () => {};
	let RO: ResizeObserver = new ResizeObserver((entries) => {
		for (let entry of entries) {
			// console.log('resize');
			// console.log({ entry });
			handleResize();
		}
	});

	onMount(async () => {
		const accessToken = $page.data.session?.accessToken;
		if (!accessToken || !loginParams) {
			$errorMessage = 'Please log in again.';
			goto('/');
		}
		if (termDiv) {
			const { Terminal } = await import('xterm');
			const { FitAddon } = await import('xterm-addon-fit');
			const { WebLinksAddon } = await import('xterm-addon-web-links');

			let term = new Terminal({
				scrollback: 1000,
				scrollOnUserInput: true,
				smoothScrollDuration: 100,
				rows: 40,
				cols: 80,
				cursorBlink: true,
				cursorStyle: 'block',
				fontFamily: 'Fira Code, monospace',
				fontSize: 12,
				theme: {
					background: 'mc-gray-600',
					foreground: 'mc-gray-100'
				}
			});

			// load all addons
			const fitAddon = new FitAddon();
			term.loadAddon(fitAddon);
			term.loadAddon(new WebLinksAddon());

			term.open(termDiv);
			fitAddon.fit();
			term.focus();

			handleResize = () => {
				if (fitAddon) {
					fitAddon.fit();
				}
			};
			RO.observe(termDiv);

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
</script>

<div class="flex min-h-full items-center justify-center">
	<div class="m-0 lg:p-20 sm:p-0 w-full max-w-6xl">
		<div
			class="rounded overflow-clip bg-black shadow-md shadow-neutral-400 p-2"
			bind:this={termDiv}
		/>
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
