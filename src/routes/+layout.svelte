<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { uiBlock } from '$lib/stores';
</script>

<div class="relative grid grid-rows-[1fr] h-fit min-h-full w-screen sm:w-4/5 mx-auto pb-14 pt-24">
	<slot />

	<div class="absolute bottom-0 left-0 right-0 h-10 text-center text-mc-blue">
		<p>
			<a href="/privacy"> Privacy Policy </a> |
			<a href="https://github.com/dianagudu/webssh-oidc">
				<Icon icon="mdi:github" class="inline" /> Source
			</a>
			|
			<a href="mailto:m-contact@lists.kit.edu"
				><Icon icon="mdi:at" class="inline" /> Developer Contact</a
			>
		</p>
	</div>

	{#if $uiBlock}
		<!-- loading overlay -->
		<div
			class="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center"
		>
			<div class="flex items-center">
				<!-- <span class="text-3xl mr-4 text-gray-400">Loading</span> -->
				<!-- loading icon -->
				<svg
					class="animate-spin h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				<!-- end loading icon -->
			</div>
		</div>
		<!-- end loading overlay -->
	{/if}
</div>
