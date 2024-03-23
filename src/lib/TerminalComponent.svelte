<script lang="ts">
	import 'xterm/css/xterm.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resize } from 'svelte-resize-observer-action';
	import type { LoginParams } from '$lib/types';
	// import type { TerminalSessionInfo } from '$lib/server/terminalsessions';
	import { errorMessage } from '$lib/stores';
	import type { Terminal } from '$lib/terminal';
	import { signOut } from '@auth/sveltekit/client';

	// export let id: TerminalSessionInfo;
	export let accessToken: string;
	export let loginParams: LoginParams;
	export let username: string;

	let termDiv: HTMLElement;
	let term: Terminal | undefined;
	let width: number;
	let height: number;

	const WS_URL = "ws://localhost:8445/ws/connect";
	const ws_url = new URL(WS_URL);
	ws_url.searchParams.set('sshHostname', loginParams.sshHost.hostname);
	ws_url.searchParams.set('sshPort', loginParams.sshHost.port.toString());
	ws_url.searchParams.set('username', username);


	function onResize(entry: ResizeObserverEntry) {
		width = entry.contentRect.width;
		height = entry.contentRect.height;
		console.log(width, height);
		// HACK: disable resizing for firefox for now
		if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
			term && term.resize();
		}
	}

	onMount(async () => {
		console.log('TerminalComponent mounted', { accessToken, loginParams });
		if (!accessToken || !loginParams || !username) {
			$errorMessage = 'Please log in again.';
			await signOut();
		}

		const libterm = await import('$lib/terminal');

		if (termDiv) {
			term = new libterm.Terminal(termDiv);
			// connect to websocket and timeout after a few seconds
			const ws = new WebSocket(ws_url, accessToken);
			term.initSocket(ws);

			let timeout: NodeJS.Timeout | undefined = undefined;
			ws.onopen = () => {
				if (timeout) {
					clearTimeout(timeout);
				}
			};
			ws.onclose = (ev: CloseEvent) => {
				// console.log('WebSocket closed', { ev });
				if (ev.code !== 1000) {
					// 1000 = normal close (https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
					$errorMessage = ev.reason;
				}
				setTimeout(async () => {
					await signOut();
				}, 500);
			};
			ws.onerror = async (ev: Event) => {
				console.error('WebSocket error', { ev });
				$errorMessage = 'Could not connect to SSH server.';
				await signOut();
			};
			timeout = setTimeout(async () => {
				$errorMessage = 'Could not connect to SSH server.';
				await signOut();
			}, 3000);
		}
	});
</script>

<div
	class="rounded overflow-clip bg-black shadow-md shadow-neutral-400 p-2"
	bind:this={termDiv}
	use:resize={onResize}
/>

<style>
	:global(.xterm .xterm-viewport) {
		/* see : https://github.com/xtermjs/xterm.js/issues/3564#issuecomment-1004417440 */
		width: initial !important;
		height: initial !important;
		overflow-y: hidden !important;
	}

	:global(.xterm .xterm-scroll-area) {
		visibility: hidden;
	}
</style>
