<script lang="ts">
	import Markdown from '$lib/Markdown.svelte';
	import { onMount } from 'svelte';

	let privacy_path = '/docs/privacy.md';
	let privacy = 'No privacy policy found.';

	onMount(async () => {
		const response = await fetch(new Request(privacy_path));
		if (response.ok) {
			privacy = await response.text();
		}
	});
</script>

<Markdown source={privacy} />
