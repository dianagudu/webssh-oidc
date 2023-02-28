<script lang="ts">
	export let label: string;
	export let value: string;

	function setClipboard(text: string) {
		var type = 'text/plain';
		var blob = new Blob([text], { type });
		var data = [new ClipboardItem({ [type]: blob })];

		navigator.clipboard.write(data).then(
			function () {
				/* success */
				// console.log('copied text to clipboard');
			},
			function () {
				/* failure */
			}
		);
	}
	const selectAll = (e: Event) => {
		if (e.target instanceof HTMLTextAreaElement) {
			e.target.select();
			setClipboard(e.target.value);
		}
	};

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
			if (controlled && controlled instanceof HTMLTextAreaElement) {
				let textarea = controlled as HTMLTextAreaElement;
				textarea.select();
				setClipboard(textarea.value);
				button.innerHTML = '✓';
				button.disabled = true;
				setTimeout(() => {
					// clear selection, reset button
					textarea.setSelectionRange(null, null);
					button.innerHTML = '🗎';
					button.disabled = false;
				}, 1000);
			}
		}
	};
</script>

<div>
	<label for="token" class="block font-medium text-mc-gray dark:text-white m-1 px-2.5">
		{label}
	</label>

	<div class="relative">
		<textarea id="token" readonly class="textarea" {value} on:click={selectAll} />
		<button
			aria-controls="token"
			class="absolute top-0 right-0 -translate-y-full m-1 px-4 p-2.5 text-mc-gray rounded opacity-50 hover:opacity-100"
			on:click={copyToClipboard}
		>
			🗎
		</button>
	</div>
</div>

<style lang="postcss">
	.textarea {
		@apply block resize-none p-2.5 w-full text-sm text-mc-gray bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500;
		@apply dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
	}
</style>
