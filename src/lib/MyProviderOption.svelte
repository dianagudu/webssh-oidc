<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { providers, generic, type Provider } from '$lib/providers';

	export let provider_issuer: string;

	const dispatch = createEventDispatcher<{ click: string }>();

	let provider: Provider = {
		name: provider_issuer,
		logo: generic.logo
	};

	function selectProvider(e: Event) {
		dispatch('click', provider_issuer);
	}

	onMount(async () => {
		if (provider_issuer in providers) {
			provider = providers[provider_issuer];
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<div class="grid grid-flow-col justify-start h-5 mb-1" on:click={selectProvider}>
	<img class="mx-2 my-2 h-3 w-auto" src={provider.logo} />
	<div class="mx-2 align-middle">{provider.name}</div>
</div>
