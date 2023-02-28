<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hostSchema, resetHost, isValidHost, type Host } from '$lib/types';
	import { z } from 'zod';

	export let title: string;
	export let host: Host;
	export let defaultHost: Host;
	export let disabled = false;
	export let showProtocol = false;
	export let customise: boolean;

	let myForm: HTMLFormElement;

	const dispatch = createEventDispatcher<{ change: Host }>();
	const dispatchReset = createEventDispatcher();

	let errorStates: { [index: string]: boolean } = {
		hostname: false,
		port: false
	};

	function formChange(e: Event) {
		try {
			const fd = new FormData(myForm);
			const data = Object.fromEntries(fd.entries());
			host = hostSchema.parse(data);
			dispatch('change', host);
			errorStates = {
				hostname: false,
				port: false
			};
		} catch (err) {
			console.log({ err }, err instanceof z.ZodError);
			if (err instanceof z.ZodError) {
				const zerr: z.ZodError = err;
				zerr.errors.forEach((e) => {
					if (e.path[0] in errorStates) errorStates[e.path[0]] = true;
				});
			} else if (err instanceof Error) {
				errorStates = {
					hostname: true,
					port: true
				};
			}
		}
	}

	function handleCustomise(e: Event) {
		customise = (e.target as HTMLInputElement).checked;
		if (customise) {
			host = { ...resetHost };
			dispatchReset('reset');
		} else {
			host = { ...defaultHost };
			dispatch('change', host);
		}
		errorStates = {
			hostname: false,
			port: false
		};
	}
</script>

<div class="flex flex-row place-content-between pt-4 pb-2 px-1">
	<div>
		<label for="hostname" class="block font-medium text-mc-gray">{title}</label>
	</div>
	<div class="flex">
		<span class="ml-3 font-medium text-mc-gray pr-2">customise</span>
		<label class="inline-flex relative items-center cursor-pointer">
			<input
				type="checkbox"
				checked={customise}
				disabled={!isValidHost(defaultHost) || disabled}
				on:change={handleCustomise}
				class="sr-only peer"
			/>
			<div class="checkbox peer" />
		</label>
	</div>
</div>
<form on:change={formChange} bind:this={myForm}>
	<div class="flex flex-row dualinput">
		{#if showProtocol}
			<select
				id="protocol"
				name="protocol"
				value={host.protocol}
				disabled={!customise || disabled}
				required
			>
				<option value="http">http</option>
				<option value="https">https</option>
			</select>
		{/if}
		<input
			id="hostname"
			name="hostname"
			type="text"
			placeholder="hostname"
			value={host.hostname}
			disabled={!customise || disabled}
			required
			class:error_state={errorStates.hostname}
			class:middle-child={showProtocol}
		/>
		<input
			id="port"
			name="port"
			type="number"
			placeholder="port"
			value={host.port > 0 ? host.port : null}
			disabled={!customise || disabled}
			required
			class:error_state={errorStates.port}
		/>
	</div>
</form>

<style lang="postcss">
	.dualinput {
		input {
			@apply relative block px-3 py-2 w-full appearance-none rounded-md border focus:z-10 focus:outline-none sm:text-sm;
			@apply border-gray-300 text-mc-gray placeholder-gray-300 focus:border-indigo-500 focus:ring-indigo-500;
			@apply disabled:opacity-50;
		}

		input:first-child {
			@apply rounded-r-none;
		}

		input:last-child {
			@apply rounded-l-none w-24;
		}

		.middle-child {
			@apply rounded-none;
		}
		.error_state {
			@apply border-mc-orange text-mc-orange;
		}

		select {
			@apply relative block px-3 py-2 w-full appearance-none rounded-md border focus:z-10 focus:outline-none sm:text-sm;
			@apply border-gray-300 text-mc-gray placeholder-gray-300 focus:border-indigo-500 focus:ring-indigo-500;
			@apply disabled:opacity-50;
			@apply rounded-r-none w-28;
		}
	}

	.checkbox {
		@apply w-11 h-6 rounded-full;
		@apply bg-gray-200 after:bg-white after:border-gray-300 peer-checked:bg-blue-600 peer-checked:after:border-white peer-focus:ring-blue-300;
		@apply after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:border after:rounded-full after:h-5 after:w-5 after:transition-all;
		@apply peer-focus:ring-4;
		@apply peer-checked:after:translate-x-full;
	}
</style>
