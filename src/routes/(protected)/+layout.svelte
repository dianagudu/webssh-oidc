<script>

	import NavBar from "$lib/NavBar.svelte";

</script>

<div class="grid grid-rows-[auto_1fr] h-full min-h-fit justify-center relative">
    <NavBar/>
    <div><slot/></div>
</div>