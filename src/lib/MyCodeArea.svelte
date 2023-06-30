<script lang="ts">
	export let label: string;
	export let value: string;
	export let id: string;

	let selected = false;

	// const selectAll = (e: Event) => {
	// 	if (e.target instanceof HTMLSpanElement) {
	// 		// e.target.select();
	// 		setClipboard(e.target.textContent ?? '');
	// 	}
	// };

	const copyToClipboard = (e: Event) => {
		// console.log($page.data.session);
		// get the id of the textarea to copy
		if (e.target && e.target instanceof HTMLButtonElement) {
			let button = e.target as HTMLButtonElement;
			let id = button.attributes?.getNamedItem('aria-controls')?.value ?? undefined;
			if (id === undefined) {
				return;
			}
			let controlled = document.getElementById(id);
			if (controlled && controlled instanceof HTMLSpanElement) {
				let textarea = controlled as HTMLSpanElement;
				selected = true;
				if (textarea.textContent) {
					function copySuccessful() {
						button.innerHTML = '✓';
						button.disabled = true;
						setTimeout(() => {
							// clear selection, reset button
							// textarea.setSelectionRange(null, null);
							selected = false;
							button.innerHTML = '🗎';
							button.disabled = false;
						}, 300);
					}
					navigator.clipboard.writeText(textarea.textContent).then(copySuccessful, () => {});
				}
			}
		}
	};
</script>

<div>
	<label for={id} class="block font-medium text-mc-gray dark:text-white m-1 px-2.5">
		{label}
	</label>

	<div class="relative">
		<!-- <textarea {id} readonly rows={numRows} class="textarea" {value} on:click={selectAll} /> -->
		<span {id} class="textarea" class:selected>{value}</span>
		<button
			aria-controls={id}
			class="absolute top-0 right-0 -translate-y-full m-1 px-4 p-2.5 text-mc-gray rounded opacity-50 hover:opacity-100"
			on:click={copyToClipboard}
		>
			🗎
		</button>
	</div>
</div>

<style lang="postcss">
	.textarea {
		word-wrap: break-word;
		@apply font-mono;
		@apply block resize-none p-2.5 w-full text-sm text-mc-gray bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500;
		/* @apply dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500; */
	}

	.selected {
		@apply bg-blue-400 text-white;
		/* @apply dark:bg-mc-blue dark:text-white; */
	}
</style>
