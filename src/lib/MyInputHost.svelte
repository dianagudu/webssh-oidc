<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hostSchema, resetHost, isValidHost, type Host } from '$lib/types';
	import { z } from 'zod';
	import MySelect from './MySelect.svelte';

	export let disabled = false;
	export let showProtocol = false;
	export let title: string;
	
	export let defaultHost: Host;
	export let host: Host;

	let internalHost: Host = host;

	function setHost(newHost: Host) {
		if (JSON.stringify(newHost) !== JSON.stringify(host)) {
			host = newHost;
			dispatch('change', host);
		}
	}

	let customise = JSON.stringify(host) !== JSON.stringify(defaultHost);

	let myForm: HTMLFormElement;
	let protocol: string | undefined = host?.protocol;

	const dispatch = createEventDispatcher<{ change: Host }>();

	let errorStates: { [index: string]: boolean } = {
		hostname: false,
		port: false,
		protocol: false
	};

	function formChange(e: Event) {
		console.log("FORM CHANGE")
		try {
			errorStates = {
				hostname: false,
				port: false,
				protocol: false
			};
			const fd = new FormData(myForm);
			if (showProtocol) fd.append('protocol', protocol ?? '');
			const data = Object.fromEntries(fd.entries());
			console.log({ data });
			const newHost = hostSchema.parse(data);
			//n more validation here
			setHost(newHost);
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
					port: true,
					protocol: true
				};
			}
		}
	}

	function handleCustomise(e: Event) {
		console.log("HANDLE CUSTOMISE")
		customise = (e.target as HTMLInputElement).checked;
		if (customise) {
			// internalHost = { ...resetHost };
			// dispatchReset('reset');
		} else {
			internalHost = { ...defaultHost };
			// dispatch('change', host);
		}
		errorStates = {
			hostname: false,
			port: false,
			protocol: false
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
	<div class="dualinput" class:triple={showProtocol}>
		{#key internalHost}
		{#if showProtocol}
			<MySelect
				name="protocol"
				hasError={errorStates.protocol}
				value={internalHost.protocol}
				disabled={!customise || disabled}
				values={['http', 'https']}
				descriptionTexts={{
					loading: '...',
					novals: '',
					choose: '--'
				}}
				on:select={({ detail }) => {
					protocol = detail;
					formChange(new Event('change'));
				}}
			>
				<div slot="selectedValue" let:value>
					{value}
				</div>
				<div slot="option" let:value>
					{value}
				</div>
			</MySelect>
		{/if}
		<input
			id="hostname"
			name="hostname"
			type="text"
			placeholder="hostname"
			value={internalHost.hostname}
			disabled={!customise || disabled}
			required
			class:error_state={errorStates.hostname}
			class:middle-child={showProtocol}
			class="min-w-0"
		/>
		<input
			id="port"
			name="port"
			type="number"
			placeholder="port"
			value={internalHost.port > 0 ? internalHost.port : ''}
			disabled={!customise || disabled}
			required
			class:error_state={errorStates.port}
		/>
		<!-- {internalHost.port} -->
		{/key}
	</div>
</form>

<style lang="postcss">
	.dualinput {
		@apply grid gap-0;
		@apply grid-cols-[1fr,6rem];

		&.triple {
			@apply grid-cols-[5rem,1fr,6rem];
		}

		input {
			@apply relative block px-3 py-2 appearance-none rounded-md border focus:z-10 focus:outline-none sm:text-sm;
			@apply text-mc-gray placeholder-gray-300 focus:border-mc-blue-400 focus:ring-mc-blue-400;
			@apply disabled:bg-gray-100 disabled:opacity-50;
		}

		input:first-child {
			@apply rounded-r-none;
		}

		input:last-child {
			@apply rounded-l-none;
		}

		.middle-child {
			@apply rounded-none;
		}
		.error_state {
			@apply border-mc-orange text-mc-orange;
		}
	}

	.checkbox {
		@apply w-11 h-6 rounded-full;
		@apply bg-gray-200 after:bg-white peer-checked:bg-mc-blue-400 peer-checked:after:border-white peer-focus:ring-mc-blue-200;
		@apply after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:border after:rounded-full after:h-5 after:w-5 after:transition-all;
		@apply peer-focus:ring-4;
		@apply peer-checked:after:translate-x-full;
	}
</style>
