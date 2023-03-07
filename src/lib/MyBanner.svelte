<script lang="ts">
	import logo from '$lib/assets/mccli-notext.svg';
	import MyAlert from '$lib/MyAlert.svelte';
	import { errorMessage } from '$lib/stores';
</script>

<div>
	<img class="mx-auto h-12 w-auto" src={logo} alt="motley-cue logo" />
	<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-mc-gray">SSH with OIDC</h2>
</div>
{#if $errorMessage}
	<MyAlert />
{/if}
