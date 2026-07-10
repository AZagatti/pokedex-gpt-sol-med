<script lang="ts">
	import { titleCase } from '$lib/utils/format';
	let { type }: { type: string } = $props();
</script>

<span class="type-badge type-{type}">{titleCase(type)}</span>
