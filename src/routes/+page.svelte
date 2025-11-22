<script lang="ts">
	import NewEntryPanel from '$lib/components/NewEntryPanel.svelte';
	import CalendarPanel from '$lib/components/CalendarPanel.svelte';
	import AlbumDetailsPanel from '$lib/components/AlbumDetailsPanel.svelte';
</script>

<div class="dashboard-container">
	<!-- New Entry Panel - Left Side -->
	<div class="panel new-entry-panel">
		<NewEntryPanel />
	</div>

	<!-- Calendar Panel - Center -->
	<div class="panel calendar-panel">
		<CalendarPanel />
	</div>

	<!-- Album Details Panel - Right Side -->
	<div class="panel album-details-panel">
		<AlbumDetailsPanel />
	</div>
</div>

<style>
	.dashboard-container {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 1rem;
		height: 100vh;
		padding: 1rem;
	}

	.panel {
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 1rem;
		overflow-y: auto;
	}

	.new-entry-panel {
		grid-column: 1;
	}

	.calendar-panel {
		grid-column: 2;
	}

	.album-details-panel {
		grid-column: 3;
	}
</style>
