<script lang="ts">
	import { onMount } from 'svelte';
	import { errorMessage, uiBlock } from '$lib/stores';
	import MyCodeArea from '$lib/MyCodeArea.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const loginParams = {
		user: data.session?.user.name ?? data.session?.user.email ?? data.session?.user.id ?? 'User',
		accessToken: data.accessToken,
		mcEndpoint: data.userSession.mcEndpoint,
		sshHost: {
			hostname: data.userSession.sshHostname,
			port: data.userSession.sshPort
		},
		sshUser: data.username,
		// pretty print json with new lines
		profile: data.session?.profile
	};
	console.log('profile:', loginParams.profile);

	onMount(async () => {
		$uiBlock = false;
	});
</script>

<div class="w-screen max-w-4xl px-4 mt-8 space-6 flex flex-col gap-4">
	<h1 class="text-2xl font-semibold text-mc-gray">Welcome, {loginParams.user}!</h1>
	<p class="text-mc-gray">
		You are logged in with the OIDC provider: <span class="font-semibold text-mc-orange"
			>{loginParams.profile?.iss}</span
		>.
		<br />
		Your local username is: <span class="font-semibold text-mc-orange">{loginParams.sshUser}</span>.
	</p>
	<MyCodeArea
		label="User info from OIDC provider"
		id="sshCmd"
		value={JSON.stringify(loginParams.profile, null, ' ')}
	/>
</div>
