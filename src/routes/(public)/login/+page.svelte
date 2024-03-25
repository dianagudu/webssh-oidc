<script lang="ts">
	import LoginComponent from '$lib/LoginComponent.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full max-w-2xl space-y-8">
	<LoginComponent providers={data.providers} />
</div>
