<script lang="ts">
	import 'xterm/css/xterm.css';
	import { onMount } from 'svelte';
	import { resize } from 'svelte-resize-observer-action';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { errorMessage, loginParams } from '$lib/stores';
	import { Terminal } from '$lib/terminal';

	let termDiv: HTMLElement;
	let term: Terminal;

	// export function resize() {
	// 	term && term.resize();
	// }

	let width: number;
	let height: number;

	function onResize(entry: ResizeObserverEntry) {
		width = entry.contentRect.width;
		height = entry.contentRect.height;
		// console.log(width, height);
		// HACK: disable resizing for firefox for now
		if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
			term && term.resize();
		}
	}

	onMount(async () => {
		const accessToken = $page.data.session?.accessToken;
		if (!accessToken || !loginParams) {
			$errorMessage = 'Please log in again.';
			goto('/');
		}
		if (termDiv) {
			term = new Terminal(termDiv);
			const ws_url = new URL(
				`${$page.url.protocol === 'https:' ? 'wss' : 'ws'}://${$page.url.hostname}:${
					$page.url.port
				}/ws/connect`
			);
			ws_url.searchParams.set('sshHostname', $loginParams?.sshHost.hostname);
			ws_url.searchParams.set('sshPort', $loginParams?.sshHost.port);
			ws_url.searchParams.set('username', $loginParams?.username);

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
				setTimeout(() => {
					goto('/');
				}, 500);
			};
			timeout = setTimeout(() => {
				$errorMessage = 'Could not connect to SSH server.';
				goto('/');
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
