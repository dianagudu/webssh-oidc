<script lang="ts">
	import { signOut } from '@auth/sveltekit/client';
	import logo from '$lib/assets/webssh-oidc-square.png';
	import { errorMessage, uiBlock } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';

	const handleLogout = async () => {
		console.log('signing out ...');
		try {
			$uiBlock = true;
			signOut().then(() => {
				console.log('sign out successful');
				// console.log('loginParams', $loginParams);
				console.log('session', $page.data.session);
				// $loginParams = null;
				$page.data.session = null;
			});
		} catch {
			$uiBlock = false;
		}
	};
</script>

<nav
	class="flex justify-around py-4 bg-white/80
            backdrop-blur-md shadow-md w-full
            fixed top-0 left-0 right-0 z-10"
>
	<div class="flex items-center space-x-3">
		<img class="h-10 object-cover" src={logo} alt="webssh-oidc logo" />
		<h3 class="text-xl text-mc-gray font-semibold tracking-tight">SSH with OIDC</h3>
	</div>

	<div class="flex items-center space-x-3">
		<div class="block font-medium text-mc-blue dark:text-white">
			{$page.data.session?.user?.name ?? $page.data.session?.user?.email ?? 'User'}
		</div>

		<button
			type="button"
			id="logout"
			title="Logout"
			on:click={handleLogout}
			class="rounded h-10 cursor-pointer transition-color"
		>
			<Icon
				icon="mdi:logout"
				class="inline text-3xl font-semibold text-mc-gray hover:text-mc-orange"
			/>
		</button>
	</div>
</nav>
