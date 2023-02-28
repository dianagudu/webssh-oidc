<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { OP } from '$lib/types';

	export let supportedOps: { [index: string]: any } | undefined;
	export let disabled = false;
	export let selectedOp: string | undefined;

	const selectInfo = {
		loading: 'Loading...',
		noops: 'No supported OPs',
		choose: 'Choose from supported OPs'
	};

	const dispatch = createEventDispatcher<{ select: OP }>();

	function handleOPSelect(e: Event) {
		const op = (e.target as HTMLSelectElement).value;
		console.log(e.target as HTMLSelectElement);
		console.log({ op });
		dispatch('select', { id: op, url: new URL(op) });
	}
</script>

<div>
	<label for="op" class="block font-medium text-mc-gray pt-4 pb-2 pl-1"
		>OIDC identity provider</label
	>

	<select
		id="op"
		name="op"
		{disabled}
		value={selectedOp}
		on:change={handleOPSelect}
		class="block w-full rounded-md border border-gray-300 px-3 py-2 text-mc-gray placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
	>
		<option value={undefined} disabled selected
			>{supportedOps === undefined
				? selectInfo.loading
				: !Object.values(supportedOps).length
				? selectInfo.noops
				: selectInfo.choose}</option
		>
		{#if supportedOps !== undefined}
			{#each Object.values(supportedOps) as op}
				<option value={op}>{op}</option>
			{/each}
		{/if}
	</select>
</div>
