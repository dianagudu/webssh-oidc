<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import { signOut } from '@auth/sveltekit/client';
	import { uiBlock } from '$lib/stores';
	import TerminalComponent from '$lib/TerminalComponent.svelte';
    
    export let data: PageData;
    console.log({data})

    onMount(async () => {
        if (!data.accessToken || !data.loginParams || !data.username) {
            console.error('No access token or login params found');
            await signOut();
            $uiBlock = false;
        }
 
        $uiBlock = false;
    });
</script>


<div class="w-screen max-w-6xl max-h-screen">
    <TerminalComponent 
        accessToken={data.accessToken ?? ''}
        loginParams={data.loginParams}
        username={data.username}
    />
</div>