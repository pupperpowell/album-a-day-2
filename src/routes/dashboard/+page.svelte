<script lang="ts">
	import { page } from '$app/stores';
	import NewEntryPanel from '$lib/components/NewEntryPanel.svelte';
	import CalendarPanel from '$lib/components/CalendarPanel.svelte';
	import AlbumDetailsPanel from '$lib/components/AlbumDetailsPanel.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import type { Album } from '$lib/types/album';

	let user = $derived($page.data.user);
	let calendarData = $derived($page.data.calendarData);

	let isSearchActive = $state(false);
	let isNewEntryFocused = $state(false);
	let selectedDate = $state<Date | null>(null);
	let entryDate = $state<Date | null>(null);
	let currentMonth = $state(calendarData?.month || new Date().getMonth());
	let currentYear = $state(calendarData?.year || new Date().getFullYear());
	let albumMap = $state<Record<string, Album>>(calendarData?.albumMap || {});

	let handleSearchActiveChange: (active: boolean) => void = (active: boolean) => {
		isSearchActive = active;
	};

	let handleNewEntryFocusChange: (focused: boolean) => void = (focused: boolean) => {
		isNewEntryFocused = focused;
	};

	let albumDetailsRef: { selectAlbum: (album: Album | null) => void } | undefined;

	function handleDateSelect(date: Date | null) {
		selectedDate = date;
		// Also update the entry date when a date is selected from calendar
		entryDate = date;
	}

	function handleAlbumSelect(album: Album) {
		if (albumDetailsRef) {
			albumDetailsRef.selectAlbum(album);
		}
	}

	async function handleMonthChange(month: number, year: number) {
		currentMonth = month;
		currentYear = year;

		// Fetch new calendar data for the selected month
		try {
			const response = await fetch(`/api/calendar?month=${month}&year=${year}`);
			if (response.ok) {
				const data = await response.json();
				if (data.success) {
					albumMap = data.data.albumMap;
				}
			}
		} catch (error) {
			console.error('Error fetching calendar data:', error);
		}
	}

	let handleEntryCreated = async () => {
		await handleMonthChange(currentMonth, currentYear);
	};

	function handleGlobalClick(event: MouseEvent) {
		// Check if the click was inside the calendar panel
		const target = event.target as HTMLElement;
		const isInsideCalendar = target.closest('.calendar-panel');

		// If clicking outside the calendar and there's a selected date, clear it
		if (!isInsideCalendar && selectedDate) {
			selectedDate = null;
		}
	}

	// Watch for changes in selectedDate and albumDetailsRef to select the appropriate album
	$effect(() => {
		if (selectedDate && albumDetailsRef && albumMap) {
			const dateKey = selectedDate.toISOString().split('T')[0];
			const album = albumMap[dateKey];
			albumDetailsRef.selectAlbum(album || null);
		}
	});

	// Add global click listener when component mounts
	$effect(() => {
		document.addEventListener('click', handleGlobalClick);
		return () => {
			document.removeEventListener('click', handleGlobalClick);
		};
	});
</script>

<!-- <div class="dashboard-header">
	<UserProfile {user} />
</div> -->

<div
	class="dashboard-container"
	class:search-active={isSearchActive}
	class:has-selected-date={selectedDate}
>
	<!-- New Entry Panel - Left Side -->
	<div class="panel new-entry-panel">
		<NewEntryPanel
			onSearchActiveChange={handleSearchActiveChange}
			onFocusChange={handleNewEntryFocusChange}
			bind:selectedDate={entryDate}
			onEntryCreated={handleEntryCreated}
		/>
	</div>

	<!-- Calendar Panel - Center -->
	<div class="panel calendar-panel">
		<CalendarPanel
			onDateSelect={handleDateSelect}
			onAlbumSelect={handleAlbumSelect}
			bind:selectedDate
			{currentMonth}
			{currentYear}
			{albumMap}
			onMonthChange={handleMonthChange}
			{isNewEntryFocused}
		/>
	</div>

	<!-- Album Details Panel - Right Side -->
	{#if selectedDate}
		<div class="panel album-details-panel">
			<AlbumDetailsPanel {selectedDate} bind:this={albumDetailsRef} />
		</div>
	{/if}
</div>

<style>
	.dashboard-container {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 1rem;
		height: 100vh;
		padding: 2rem;
		transition: grid-template-columns 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.dashboard-container.search-active {
		grid-template-columns: 1fr 2fr 0fr;
	}

	.dashboard-container:not(.has-selected-date) {
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
