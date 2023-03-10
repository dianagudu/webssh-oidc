<script lang="ts">
	import { onMount } from 'svelte';
	import { signIn } from '@auth/sveltekit/client';

	import MyBanner from './MyBanner.svelte';
	import MyInputHost from '$lib/MyInputHost.svelte';
	import MySelect from '$lib/MySelect.svelte';
	import MyButton from '$lib/MyButton.svelte';
	import { isValidHost, hostSchema, resetHost, type Host } from '$lib/types';
	import { loadOpInfo, loadOps } from '$lib/motley_cue';
	import { errorMessage, loginParams, uiBlock } from '$lib/stores';
	import CONFIG from './config';

	// default settings
	let defaultSsh = { ...resetHost };
	let defaultMc = { ...resetHost };
	let defaultOps: { [key: string]: string };
	let defaultMcEndpoint: URL;

	// settings for SSH server
	let sshHost = { ...resetHost };
	let validSsh = false;

	// initial settings for motley-cue
	let mcHost = { ...resetHost };
	let validMc = false;
	let mcEndpoint: URL;

	// selected OIDC provider from drop-down list
	let supportedOps: { [key: string]: string } | undefined;
	let selectedOp: string | undefined = undefined;
	let hasSelectedOp = false;
	let canSubmit = false;

	let opList: string[] | undefined;

	$: {
		if (supportedOps) {
			opList = Object.values(supportedOps);
		} else {
			opList = undefined;
		}
	}

	onMount(async () => {
		try {
			$uiBlock = true;
			// load default settings from environment variables or use sane defaults
			try {
				defaultSsh = hostSchema.parse(CONFIG.sshHost);
				sshHost = { ...defaultSsh };
				validSsh = isValidHost(sshHost);
			} catch (e) {
				console.error(`Invalid SSH host: ${CONFIG.sshHost}`);
			}

			try {
				defaultMcEndpoint = new URL(CONFIG.mcEndpoint);
				defaultMc = hostSchema.parse({
					hostname: defaultMcEndpoint.hostname,
					port: defaultMcEndpoint.port,
					protocol: defaultMcEndpoint.protocol.substring(0, defaultMcEndpoint.protocol.length - 1)
				});
				mcHost = { ...defaultMc };
				validMc = isValidHost(mcHost);
				mcEndpoint = defaultMcEndpoint;
			} catch (e) {
				console.error(`Invalid Motley Cue API endpoint: ${CONFIG.mcEndpoint}`);
			}

			defaultOps = await loadOps(fetch, mcEndpoint);
			supportedOps = { ...defaultOps };
		} catch (e) {
			defaultMc = { ...resetHost };
			mcHost = { ...resetHost };
			validMc = false;
			$errorMessage = 'No motley-cue server running, please use a custom one.';
		} finally {
			$uiBlock = false;
		}
	});

	const clear = () => {
		$errorMessage = '';
		supportedOps = undefined;
		hasSelectedOp = false;
		selectedOp = undefined;
	};

	let timeout: NodeJS.Timeout | undefined = undefined;
	const debouncedReloadOPs = (e: CustomEvent<Host>) => {
		clearTimeout(timeout);
		clear();
		timeout = setTimeout(() => reloadOPs(e), 200);
	};
	const debouncedResetOPs = () => {
		clearTimeout(timeout);
		clear();
		timeout = setTimeout(() => resetOPs(), 200);
	};

	const reloadOPs = async ({ detail }: CustomEvent<Host>) => {
		mcHost = { ...detail };
		mcEndpoint = new URL(mcHost.protocol + '://' + mcHost.hostname + ':' + mcHost.port);
		validMc = false;

		// for the default motley_cue server, use the pre-loaded OPs
		if (JSON.stringify(mcHost) === JSON.stringify(defaultMc)) {
			supportedOps = defaultOps;
			validMc = true;
			return;
		}

		// for other motley_cue servers, load the OPs from the server
		try {
			$uiBlock = true;
			supportedOps = await loadOps(fetch, mcEndpoint);
			validMc = true;
		} catch (e) {
			supportedOps = {};
			$errorMessage = 'Failed to load OIDC providers from motley_cue server';
		} finally {
			$uiBlock = false;
		}
	};
	const resetOPs = () => {
		supportedOps = {};
		mcHost = { ...resetHost };
		validMc = false;
		hasSelectedOp = false;
		selectedOp = undefined;
	};

	$: canSubmit = validSsh && validMc && hasSelectedOp;

	const handleLogin = async () => {
		try {
			$uiBlock = true;
			let op = 'google';
			op = 'deep-hdc';
			// op = 'helmholtz-dev';
			op = 'egi-dev';
			let scope = 'openid profile email';
			let opInfo = await loadOpInfo(fetch, mcEndpoint, selectedOp);
			console.log(opInfo);
			scope = opInfo.scopes.join(' ');
			$loginParams = {
				mcEndpoint,
				op,
				scope,
				sshHost,
				username: ''
			};
			await signIn(op, { scope });
		} catch {
			$uiBlock = false;
			$errorMessage = 'Failed to login';
		}
	};
</script>

<div class="bg-white rounded-lg shadow sm:max-w-[70%] mx-auto p-10">
	<MyBanner />
	<form class="mt-8 space-y-6" action="#" method="POST" on:submit|preventDefault={handleLogin}>
		<input type="hidden" name="remember" value="true" />
		<div class="-space-y-px rounded-md">
			<MyInputHost
				title="motley_cue"
				host={mcHost}
				defaultHost={defaultMc}
				showProtocol={true}
				customise={JSON.stringify(defaultMc) === JSON.stringify(resetHost)}
				on:change={debouncedReloadOPs}
				on:reset={debouncedResetOPs}
				disabled={$uiBlock}
			/>
			<MyInputHost
				title="SSH"
				host={sshHost}
				defaultHost={defaultSsh}
				customise={JSON.stringify(defaultSsh) === JSON.stringify(resetHost)}
				disabled={$uiBlock}
				on:change={({ detail }) => {
					sshHost = { ...detail };
					validSsh = true;
				}}
				on:reset={() => {
					sshHost = { ...resetHost };
					validSsh = false;
				}}
			/>
			<div>
				<label for="op" class="block font-medium text-mc-gray pt-4 pb-2 pl-1"
					>OIDC identity provider</label
				>
				<div class="text-sm">
					<MySelect
						name="op"
						values={opList}
						descriptionTexts={{
							loading: 'Loading...',
							novals: 'No supported OPs',
							choose: 'Choose from supported OPs'
						}}
						value={selectedOp}
						disabled={$uiBlock || !supportedOps || !Object.values(supportedOps).length}
						on:select={({ detail }) => {
							selectedOp = detail;
							hasSelectedOp = true;
						}}
					/>
				</div>
			</div>
		</div>

		<div>
			<MyButton disabled={!canSubmit || $uiBlock} on:click={handleLogin}>
				<span class="absolute inset-y-0 left-0 flex items-center pl-3">
					<!-- Heroicon name: mini/lock-closed -->
					<svg
						class="h-5 w-5 text-mc-blue-400 group-hover:text-mc-blue-300"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
				Log in
			</MyButton>
		</div>
	</form>
</div>
