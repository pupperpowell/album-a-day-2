<script lang="ts">
	import { page } from '$app/state';
	import NewEntryPanel from '$lib/components/NewEntryPanel.svelte';
	import CalendarPanel from '$lib/components/CalendarPanel.svelte';
	import MobileCalendarPanel from '$lib/components/MobileCalendarPanel.svelte';
	import AlbumDetailsPanel from '$lib/components/AlbumDetailsPanel.svelte';
	import type { Album } from '$lib/types/album';

	let user = $derived(page.data.user);
	let calendarData = $derived(page.data.calendarData);

	let isSearchActive = $state(false);
	let isNewEntryFocused = $state(false);
	let selectedDate = $state<Date | null>(null);
	let entryDate = $state<Date | null>(null);
	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());
	let albumMap = $state<Record<string, Album>>({});

	let showMobileCalendar = $derived(!isNewEntryFocused);

	let newEntryPanelClasses = $derived(
		isNewEntryFocused
			? 'flex-1 md:flex-none md:max-h-none overflow-y-auto'
			: 'flex-none max-h-[200px] md:max-h-none overflow-y-auto'
	);

	let showAlbumDetails = $derived(!isSearchActive && !!selectedDate);

	let gridCols = $derived(
		showAlbumDetails ? 'md:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-[1fr_2fr]'
	);

	let handleSearchActiveChange: (active: boolean) => void = (active: boolean) => {
		isSearchActive = active;
	};

	let handleNewEntryFocusChange: (focused: boolean) => void = (focused: boolean) => {
		isNewEntryFocused = focused;
	};

	let albumDetailsRef = $state<{ selectAlbum: (album: Album | null) => void } | undefined>(
		undefined
	);

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
	}

	let handleEntryCreated = (newAlbum: Album) => {
		const dateKey = newAlbum.listenDate.toISOString().split('T')[0];
		albumMap = {
			...albumMap,
			[dateKey]: newAlbum
		};
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

	// Sync initial values from server load
	$effect(() => {
		const cd = calendarData;
		if (cd) {
			currentMonth = cd.month;
			currentYear = cd.year;
			albumMap = cd.albumMap;
		}
	});

	// Watch for changes in selectedDate and albumDetailsRef to select the appropriate album
	$effect(() => {
		if (selectedDate && albumDetailsRef && albumMap) {
			const dateKey = selectedDate.toISOString().split('T')[0];
			const album = albumMap[dateKey];
			albumDetailsRef?.selectAlbum(album || null);
		}
	});

	// Watch for albumMap changes and re-trigger album selection if a date is selected
	$effect(() => {
		if (selectedDate && albumDetailsRef && albumMap) {
			const dateKey = selectedDate.toISOString().split('T')[0];
			const album = albumMap[dateKey];
			albumDetailsRef?.selectAlbum(album || null);
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

<div
	class="dashboard-container flex flex-col md:grid {gridCols} gap-4 h-screen p-4 md:p-8 transition-[grid-template-columns] duration-300"
>
	<!-- New Entry Panel - Left Side -->
	<div class="new-entry-panel border border-gray-300 rounded-lg p-3 md:p-4 {newEntryPanelClasses}">
		<NewEntryPanel
			onSearchActiveChange={handleSearchActiveChange}
			onFocusChange={handleNewEntryFocusChange}
			bind:selectedDate={entryDate}
			onEntryCreated={handleEntryCreated}
			{albumMap}
		/>
	</div>

	<!-- Mobile Calendar Panel - Center -->
	{#if showMobileCalendar}
		<div
			class="block md:hidden calendar-panel border border-gray-300 rounded-lg p-3 md:p-4 overflow-y-auto flex-1 min-h-0"
		>
			<MobileCalendarPanel
				onDateSelect={handleDateSelect}
				onAlbumSelect={handleAlbumSelect}
				bind:selectedDate
				{albumMap}
				{isNewEntryFocused}
			/>
		</div>
	{/if}

	<!-- Desktop Calendar Panel - Center -->
	<div
		class="hidden md:block calendar-panel border border-gray-300 rounded-lg p-3 md:p-4 overflow-y-auto flex-1 min-h-0"
	>
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
	{#if showAlbumDetails}
		<div
			class="album-details-panel border border-gray-300 rounded-lg p-3 md:p-4 overflow-y-auto flex-none max-h-[300px] md:max-h-none"
		>
			<AlbumDetailsPanel {selectedDate} bind:this={albumDetailsRef} />
		</div>
	{/if}
</div>
