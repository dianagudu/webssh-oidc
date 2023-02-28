<script lang="ts">
	import { errorMessage } from './stores';
	import { slide } from 'svelte/transition';
</script>

<div
	in:slide={{ duration: 300 }}
	out:slide={{ duration: 300 }}
	class="p-4 mb-4 text-mc-orange rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
	role="alert"
>
	<div class="flex justify-between">
		<div class="flex items-center">
			<svg
				aria-hidden="true"
				class="w-5 h-5 mr-2"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="sr-only">Info</span>
			<h3 class="text-lg font-medium">Something went wrong!</h3>
		</div>
		<button
			on:click={() => {
				$errorMessage = '';
			}}
			type="button"
			title="Dismiss"
			class="text-mc-orange bg-red-50 hover:bg-mc-orange hover:text-white font-medium rounded-lg text-sm px-2.5 py-1 focus:outline-none"
		>
			x
		</button>
	</div>
	<div class="mt-2 mb-4 text-sm">
		{$errorMessage}
	</div>
</div>
