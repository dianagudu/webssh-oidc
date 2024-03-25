<script lang="ts">
	import 'xterm/css/xterm.css';
	import { createEventDispatcher, onMount } from 'svelte';
	import { resize } from 'svelte-resize-observer-action';
	import { errorMessage } from '$lib/stores';
	import type { Terminal } from '$lib/terminal';
	import { signOut } from '@auth/sveltekit/client';
	import type { TerminalSessionInfo } from '$lib/server/sessions';

	export let sessionInfo: TerminalSessionInfo;
	export let loginParams: {
		wsUrl: string;
		sshHost: { hostname: string; port: number };
		sshUser: string;
		accessToken: string;
	};

	let termDiv: HTMLElement;
	let term: Terminal | undefined;
	let width: number;
	let height: number;

	function onResize(entry: ResizeObserverEntry) {
		width = entry.contentRect.width;
		height = entry.contentRect.height;
		console.log(width, height);
		// HACK: disable resizing for firefox for now
		if (navigator.userAgent.toLowerCase().indexOf('firefox') == -1) {
			term && term.resize();
		}
	}

	const dispatch = createEventDispatcher<{ closed: TerminalSessionInfo }>();

	function closeTerminal() {
		dispatch('closed', sessionInfo);
	}

	onMount(async () => {
		if (!loginParams || !loginParams.accessToken) {
			$errorMessage = 'Please log in again.';
			await signOut();
		}

		const libterm = await import('$lib/terminal');
		const wsConnectUrl = new URL(loginParams.wsUrl + '/connect');
		wsConnectUrl.searchParams.set('sshHostname', loginParams.sshHost.hostname);
		wsConnectUrl.searchParams.set('sshPort', loginParams.sshHost.port.toString());
		wsConnectUrl.searchParams.set('username', loginParams.sshUser);

		if (termDiv) {
			term = new libterm.Terminal(termDiv);
			// connect to websocket and timeout after a few seconds
			const ws = new WebSocket(wsConnectUrl, loginParams.accessToken);

			let timeout: NodeJS.Timeout | undefined = undefined;
			ws.onopen = () => {
				if (timeout) clearTimeout(timeout);
			};
			ws.onclose = (ev: CloseEvent) => {
				if (ev.code !== 1000) {
					// 1000 = normal close (https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
					$errorMessage = ev.reason;
				}
				setTimeout(async () => {
					// await signOut();
					closeTerminal();
				}, 500);
			};
			ws.onerror = async (ev: Event) => {
				$errorMessage = 'Could not connect to SSH server.';
				// await signOut();
				closeTerminal();
			};

			timeout = setTimeout(async () => {
				$errorMessage = 'Could not connect to SSH server.';
				// await signOut();
				closeTerminal();
			}, 3000);

			term.initSocket(ws);
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
