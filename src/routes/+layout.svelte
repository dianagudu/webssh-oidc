<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import { uiBlock } from '$lib/stores';
</script>

<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
	<slot />

	<div class="footer text-mc-blue">
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

<style>
	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 2.5rem;
		text-align: center;
	}
</style>
