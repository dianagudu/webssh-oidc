<script lang="ts">
	import { onMount } from 'svelte';
	import TerminalComponent from '$lib/TerminalComponent.svelte';

	let terminalComponent: TerminalComponent;
	let observedDiv: HTMLDivElement;
	// let RO: ResizeObserver = new ResizeObserver((entries) => {
	// 	for (let entry of entries) {
	// 		const width = entry.contentBoxSize[0].inlineSize;
	// 		const height = entry.contentBoxSize[0].blockSize;
	// 		console.log(width, height);
	// 	}
	// 	terminalComponent.resize();
	// });

	// onMount(() => {
	// 	console.log(observedDiv);
	// 	RO.observe(observedDiv);
	// 	() => {
	// 		RO.unobserve(observedDiv);
	// 		RO.disconnect();
	// 	};
	// });
</script>

<div class="flex h-screen items-center justify-center">
	<div bind:this={observedDiv} class="m-0 lg:p-20 sm:p-0 w-full max-w-6xl max-h-screen">
		<TerminalComponent bind:this={terminalComponent} />
	</div>
</div>
