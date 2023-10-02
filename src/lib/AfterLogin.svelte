<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import MyButton from '$lib/MyButton.svelte';
	import { errorMessage, loginParams, uiBlock } from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { deployUser, getUserStatus } from './motley_cue';
	import MyCodeArea from './MyCodeArea.svelte';
	import MyBanner from './MyBanner.svelte';
	import Icon from '@iconify/svelte';

	onMount(async () => {
		try {
			$uiBlock = true;
			const token = $page.data.session?.accessToken;
			if (!token || !$loginParams) {
				throw new Error('No session or login data.');
			}
			const mcEndpoint = $loginParams?.mcEndpoint;
			let status = await getUserStatus(fetch, mcEndpoint, token);
			if (status.error) {
				$errorMessage =
					status.error +
					(`: ${status.error_description}` || `: ${status.error_details?.check_details}` || '');
			} else if (status.state === 'not_deployed') {
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

	$: sshCmd = `ssh -p ${$loginParams?.sshHost?.port} ${$loginParams?.username}@${$loginParams?.sshHost?.hostname}`;
	$: mccliCmd = `mccli --mc-endpoint ${$loginParams?.mcEndpoint
		.toString()
		.replace(/\/$/, '')} --token ${$page.data.session?.accessToken ?? ''} ssh -p ${
		$loginParams?.sshHost?.port
	} ${$loginParams?.sshHost?.hostname}`;
</script>

<MyBanner />
<div class="flex justify-end">
	<div class="block m-1 pb-0.5 font-medium text-mc-blue dark:text-white">
		{$page.data.session?.user?.name ?? $page.data.session?.user?.email ?? 'User'}
	</div>
	<button type="button" id="logout" on:click={handleLogout} class="rounded border-mc-gray w-4 m-1">
		<Icon icon="mdi:logout" class="inline fill-mc-gray stroke-mc-gray" />
	</button>
</div>
<div class="mt-8 space-6 flex flex-col gap-4">
	<MyCodeArea label="SSH commandline" id="sshCmd" value={sshCmd} />
	<MyCodeArea label="Access Token" id="token" value={$page.data.session?.accessToken ?? ''} />
	<MyCodeArea label="mccli command" id="mccliCmd" value={mccliCmd} />
	<MyButton on:click={handleSSH}>Web SSH login</MyButton>
</div>
