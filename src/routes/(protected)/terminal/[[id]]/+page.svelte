<script lang="ts">
	import TerminalTab from './TerminalTab.svelte';

	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { signOut } from '@auth/sveltekit/client';
	import { errorMessage, uiBlock } from '$lib/stores';
	import TerminalComponent from '$lib/TerminalComponent.svelte';

	import type { APIEndpoints, APIResponses, APIParams } from '../../api/terminal/[action]/+server';
	import type { TerminalSessionInfo } from '$lib/server/sessions';

	type JSONValue = string | number | boolean | JSONObject | JSONArray | null;
	type JSONObject = { [member: string]: JSONValue };
	type JSONArray = JSONValue[];

	async function APIFetch<T extends APIEndpoints>(s: T, ...args: APIParams[T]) {
		const response = await fetch(`/api/terminal/${s}/`, {
			method: 'POST',
			body: JSON.stringify(args),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const json = await response.json();
		const fetchData = json.data as APIResponses[typeof s];

		return fetchData;
	}

	let terminalOrder: string[] = [];

	export let data: PageData;

	const loginParams = {
		wsUrl: data.wsUrl,
		sshHost: {
			hostname: data.userSession.sshHostname,
			port: data.userSession.sshPort
		},
		sshUser: data.username,
		accessToken: data.accessToken
	};

	let terminals = data.userSession.terminals;

	onMount(async () => {
		if (!data.username) {
			errorMessage.set('No ssh username found.');
			console.error('No ssh username found. Signing out.');
			await signOut();
			$uiBlock = false;
		}

		if (data.userSession.terminals.length === 0) {
			addTerminal();
		} else {
			terminalOrder = data.userSession.terminals.map((t) => t.id);
		}

		$uiBlock = false;
	});

	async function addTerminal() {
		const apiResponse = await APIFetch('create', { name: `Terminal ${terminals.length}` });

		if (!apiResponse.success) {
			errorMessage.set('Failed to create terminal');
			return;
		}

		const newTerm = apiResponse.data;

		terminals = [...terminals, newTerm];
		terminalOrder = [...terminalOrder, newTerm.id];
	}

	function focusTerminal(tinfo: TerminalSessionInfo) {
		const index = terminals.findIndex((t) => t.id === tinfo.id);
		const termDiv = document.querySelector(`#terminal${index} textarea`) as HTMLTextAreaElement;
		if (termDiv) termDiv.focus();
		else console.error('Could not find terminal div');
	}

	async function removeTerminal(tinfo: TerminalSessionInfo) {
		const apiResponse = await APIFetch('delete', { id: tinfo.id });

		if (!apiResponse.success) {
			errorMessage.set('Failed to delete terminal');
			return;
		}

		terminals = terminals.filter((t) => t.id !== tinfo.id);
		terminalOrder = terminalOrder.filter((id) => id !== tinfo.id);

		if (terminals.length === 0) await signOut();
		else focusTerminal(terminals[terminals.length - 1]);
	}

	function shiftToFront(event: CustomEvent<TerminalSessionInfo>) {
		const tinfo = event.detail;
		terminalOrder = [...terminalOrder.filter((id) => id !== tinfo.id), tinfo.id];
		focusTerminal(tinfo);
	}

	function confirmUnload(event: BeforeUnloadEvent) {
		if (terminals.length > 0) {
			event.preventDefault();
			const msg = 'You have active terminals. Are you sure you want to leave?';
			event.returnValue = msg;
			return msg;
		}
	}
</script>

<!-- <svelte:window on:beforeunload={confirmUnload} /> -->

<div class="w-screen max-w-6xl max-h-screen">
	{#if data.username === ''}
		<p>Could not get SSH username</p>
	{:else}
		<div class="flex flex-col">
			<div class="flex flex-row px-2 gap-0.5 flex-wrap">
				{#each terminals as tinfo, i}
					<TerminalTab
						tabInfo={tinfo}
						isActive={tinfo.id == terminalOrder[terminalOrder.length - 1]}
						on:clicked={shiftToFront}
						on:closed={() => removeTerminal(tinfo)}
					/>
				{/each}
				<button
					class="px-2 hover:text-mc-orange leading-none"
					on:click={addTerminal}
					hidden={terminals.length == 0}
					><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							d="M7.007 12a.75.75 0 0 1 .75-.75h3.493V7.757a.75.75 0 0 1 1.5 0v3.493h3.493a.75.75 0 1 1 0 1.5H12.75v3.493a.75.75 0 0 1-1.5 0V12.75H7.757a.75.75 0 0 1-.75-.75"
						/><path
							fill="currentColor"
							fill-rule="evenodd"
							d="M7.317 3.769a42.502 42.502 0 0 1 9.366 0c1.827.204 3.302 1.643 3.516 3.48c.37 3.157.37 6.346 0 9.503c-.215 1.837-1.69 3.275-3.516 3.48a42.5 42.5 0 0 1-9.366 0c-1.827-.205-3.302-1.643-3.516-3.48a40.903 40.903 0 0 1 0-9.503c.214-1.837 1.69-3.276 3.516-3.48m9.2 1.49a41.001 41.001 0 0 0-9.034 0A2.486 2.486 0 0 0 5.29 7.424a39.402 39.402 0 0 0 0 9.154a2.486 2.486 0 0 0 2.193 2.164c2.977.332 6.057.332 9.034 0a2.486 2.486 0 0 0 2.192-2.164a39.401 39.401 0 0 0 0-9.154a2.486 2.486 0 0 0-2.192-2.163"
							clip-rule="evenodd"
						/></svg
					></button
				>
			</div>
			<div class="grid grid-cols-1 grid-rows-1">
				{#each terminals as tinfo, i}
					<div
						id={`terminal${i}`}
						class="inset-0 terminal"
						style="z-index: {terminalOrder.indexOf(tinfo.id)};"
					>
						<TerminalComponent
							sessionInfo={tinfo}
							{loginParams}
							on:closed={() => removeTerminal(tinfo)}
						/>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.terminal {
		grid-area: 1 / 1 / 2 / 2;
	}
</style>
