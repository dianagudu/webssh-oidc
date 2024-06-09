<script lang="ts">
	import Icon from '@iconify/svelte';

	export let icon: string;
	export let text: string;
	export let callback: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="cursor-pointer grid grid-flow-col justify-start h-8 hover:bg-gray-100"
	on:click={callback}
>
	<Icon {icon} class="my-1 mx-2" />
	<div class="align-middle text-nowrap text-start px-1">{text}</div>
</div>
