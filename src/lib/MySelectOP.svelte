<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { OP } from '$lib/types';

	import { slide } from 'svelte/transition';
	import { clickOutside } from './clickoutside';

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
		const op = (e.target as HTMLDivElement).innerText.trim();
		selectedOp = op;
		dispatch('select', { id: op, url: new URL(op) });
	}

	function handleExpand() {
		if (!disabled) expand = !expand;
	}

	let expand = false;
</script>

<svelte:window
	on:keydown={(e) => {
		if (!expand) return;
		if (e.key === 'Escape') expand = false;
	}}
/>

<div>
	<label for="op" class="block font-medium text-mc-gray pt-4 pb-2 pl-1"
		>OIDC identity provider</label
	>

	<div
		class="relative select-none h-10 text-mc-gray text-sm px-3 pt-2 border focus:outline-none focus:ring-mc-blue-400 focus:border-mc-blue-400 rounded-md"
		class:disabled
		on:click={handleExpand}
		on:keydown
		use:clickOutside
		on:outsideclick={() => (expand = false)}
	>
		<div class:expanded={!disabled && expand} class:selected={!expand && selectedOp}>
			{#if selectedOp}
				{selectedOp}
			{:else}
				{supportedOps === undefined
					? selectInfo.loading
					: !Object.values(supportedOps).length
					? selectInfo.noops
					: selectInfo.choose}
			{/if}
		</div>
		<div class="absolute top-1 -right-2 h-full w-10 flex items-center justify-center">
			<svg
				class="w-6 h-6 fill-current text-mc-gray"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
			>
				<path d="M7 6l-3 3-3-3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
			</svg>
			<!-- ⌄ -->
		</div>
		{#if expand}
			<div
				transition:slide={{ duration: 400 }}
				class="absolute top-10 left-0 w-full bg-gray-100 z-10 bg-white shadow-md rounded-md overflow-clip"
				on:click|stopPropagation={handleExpand}
				on:keydown
			>
				{#each Object.values(supportedOps || {}) as op}
					<div
						class="p-2 cursor-pointer hover:bg-mc-blue-200 hover:text-white"
						on:click={handleOPSelect}
						on:keydown
					>
						{op}
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- <select
		id="op"
		name="op"
		{disabled}
		value={selectedOp}
		on:change={handleOPSelect}
		class="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-mc-gray placeholder-gray-500 focus:z-10 focus:border-mc-blue-400 focus:outline-none focus:ring-mc-blue-400 sm:text-sm"
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
	</select> -->
</div>

<style lang="postcss">
	.expanded {
		@apply border-mc-blue-400 ring-mc-blue-400;
		@apply text-mc-gray-300;
	}
	.disabled {
		@apply cursor-not-allowed;
		@apply opacity-50 bg-gray-100;
	}
	.selected {
		@apply text-mc-gray;
	}
</style>
