<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import MyButton from '$lib/MyButton.svelte';
	import { errorMessage, loginParams, uiBlock } from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { deployUser, getUserStatus } from './motley_cue';
	import MyCodeArea from './MyCodeArea.svelte';

	onMount(async () => {
		try {
			$uiBlock = true;
			const token = $page.data.session?.access_token;
			const mcEndpoint = $loginParams?.mcEndpoint;
			let status = await getUserStatus(fetch, mcEndpoint, token);
			if (status.state === 'not_deployed') {
				let deployment = await deployUser(fetch, mcEndpoint, token);
				$loginParams.username = deployment.credentials.ssh_user;
			} else {
				$loginParams.username = status.message.split(' ')[1];
			}
		} catch (e) {
			$errorMessage = 'Please log in again.';
			await signOut();
		} finally {
			$uiBlock = false;
		}
	});

	const handleSSH = async () => {
		goto('/ssh');
	};

	const handleLogout = async () => {
		console.log('signing out ...');
		try {
			$uiBlock = true;
			await signOut();
		} catch {
			$uiBlock = false;
		}
	};
</script>

<div class="flex justify-end">
	<div class="block m-1 pb-0.5 font-medium text-mc-blue dark:text-white">
		{$page.data.session?.user?.name}
	</div>
	<button type="button" id="logout" on:click={handleLogout} class="rounded border-mc-gray w-4 m-1">
		<svg
			class="fill-mc-gray stroke-mc-gray"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
				d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
			/>
		</svg>
	</button>
</div>
<div class="mt-8 space-6 rounded-md shadow-sm flex flex-col gap-4">
	<MyCodeArea
		label="SSH commandline"
		id="sshCmd"
		value={`ssh -p ${$loginParams?.sshHost?.port} ${$loginParams?.username}@${$loginParams?.sshHost?.hostname}`}
	/>
	<MyCodeArea label="Access Token" id="token" value={$page.data.session?.access_token ?? ''} />
	<MyCodeArea
		label="mccli command"
		id="mccliCmd"
		value={`mccli ssh --mc-endpoint ${$loginParams?.mcEndpoint.toString()} --iss ${
			$loginParams?.op
		} --token ${$page.data.session?.access_token ?? ''} ${$loginParams?.sshHost?.hostname}`}
	/>
	<MyButton on:click={handleSSH}>Web SSH login</MyButton>
</div>
