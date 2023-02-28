<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { errorMessage, loginParams } from '$lib/stores';
	import { onMount } from 'svelte';
	import 'xterm/css/xterm.css';

	type WsCloseType = {
		code: number;
		data: string;
	};

	let termDiv: HTMLDivElement;
	onMount(async () => {
		const accessToken = $page.data.session?.access_token;
		if (!accessToken || !loginParams) {
			$errorMessage = 'Please log in again.';
			goto('/');
		}
		const xterm = await import('xterm');
		if (termDiv) {
			var term = new xterm.Terminal({
				scrollback: 1000,
				scrollOnUserInput: true,
				smoothScrollDuration: 100,
				cursorBlink: true,
				cursorStyle: 'block',
				theme: {
					background: '#000000',
					foreground: '#ffffff'
				}
			});

			term.open(termDiv);
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
</script>

<div class="flex justify-center">
	<div
		bind:this={termDiv}
		class="m-20 overflow-hidden rounded bg-black p-2 shadow-md shadow-neutral-400"
	/>
</div>

<style>
	:global(.xterm-viewport) {
		overflow-y: hidden !important;
	}
</style>
