<script lang="ts">
	import NewEntryPanel from '$lib/components/NewEntryPanel.svelte';
	import CalendarPanel from '$lib/components/CalendarPanel.svelte';
	import AlbumDetailsPanel from '$lib/components/AlbumDetailsPanel.svelte';

	let isSearchActive = $state(false);
	let selectedDate = $state<Date | null>(null);

	let handleSearchActiveChange: (active: boolean) => void = (active: boolean) => {
		isSearchActive = active;
	};

	function handleDateSelect(date: Date | null) {
		selectedDate = date;
	}

	function handleGlobalClick(event: MouseEvent) {
		// Check if the click was inside the calendar panel
		const target = event.target as HTMLElement;
		const isInsideCalendar = target.closest('.calendar-panel');

		// If clicking outside the calendar and there's a selected date, clear it
		if (!isInsideCalendar && selectedDate) {
			selectedDate = null;
		}
	}

	// Add global click listener when component mounts
	$effect(() => {
		document.addEventListener('click', handleGlobalClick);
		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	});
</script>

<div class="dashboard-container" class:search-active={isSearchActive}>
	<!-- New Entry Panel - Left Side -->
	<div class="panel new-entry-panel">
		<NewEntryPanel onSearchActiveChange={handleSearchActiveChange} />
	</div>

	<!-- Calendar Panel - Center -->
	<div class="panel calendar-panel">
		<CalendarPanel onDateSelect={handleDateSelect} bind:selectedDate />
	</div>

	<!-- Album Details Panel - Right Side -->
	<div class="panel album-details-panel">
		<AlbumDetailsPanel {selectedDate} />
	</div>
</div>

<style>
	.dashboard-container {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 1rem;
		height: 100vh;
		padding: 1rem;
		transition: grid-template-columns 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.dashboard-container.search-active {
		grid-template-columns: 1fr 2fr 0fr;
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
		transition: opacity 0.3s ease;
	}

	.dashboard-container.search-active .album-details-panel {
		opacity: 0;
		pointer-events: none;
	}
</style>
