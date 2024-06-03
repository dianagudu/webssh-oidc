<script lang="ts">
	import Icon from '@iconify/svelte';

	export let label: string;
	export let value: string;
	export let id: string;

	let selected = false;
	let disabled = false;
	let icon = 'mdi:content-copy';

	const copyToClipboard = (e: Event) => {
		if (value) {
			function copySuccessful() {
				selected = true;
				icon = 'mdi:check';
				disabled = true;
				setTimeout(() => {
					// clear selection, reset button
					selected = false;
					icon = 'mdi:content-copy';
					disabled = false;
				}, 300);
			}
			navigator.clipboard.writeText(value).then(copySuccessful, () => {});
		}
	};
</script>

<div>
	<label for={id} class="block font-medium text-mc-gray dark:text-white m-1 px-2.5">
		{label}
	</label>

	<div class="relative">
		<span {id} class="textarea" class:selected>{value}</span>
		<button
			{disabled}
			class="absolute top-0 right-0 -translate-y-full m-1 px-4 p-2.5 text-mc-gray rounded opacity-50 hover:opacity-100"
			on:click|stopPropagation={copyToClipboard}
		>
			<Icon {icon} class="inline" />
		</button>
	</div>
</div>

<style lang="postcss">
	.textarea {
		word-wrap: break-word;
		white-space: pre-wrap;
		@apply font-mono;
		@apply block resize-none p-2.5 w-full text-sm text-mc-gray bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500;
		/* @apply dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500; */
	}

	.selected {
		@apply bg-blue-400 text-white;
		/* @apply dark:bg-mc-blue dark:text-white; */
	}
</style>
