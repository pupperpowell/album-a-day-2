<script lang="ts">
	import AlbumDay from './AlbumDay.svelte';
	import type { Album } from '$lib/types/album';

	let {
		onDateSelect,
		selectedDate = $bindable(null)
	}: {
		onDateSelect?: (date: Date | null) => void;
		selectedDate?: Date | null;
	} = $props();

	let currentMonth = $state(new Date().getMonth());
	let currentYear = $state(new Date().getFullYear());

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const daysInMonth = $derived(() => {
		return new Date(currentYear, currentMonth + 1, 0).getDate();
	});

	const firstDayOfMonth = $derived(() => {
		return new Date(currentYear, currentMonth, 1).getDay();
	});

	const trailingDays = $derived((7 - ((firstDayOfMonth() + daysInMonth()) % 7)) % 7);

	function previousMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	}

	function selectDate(day: number) {
		selectedDate = new Date(currentYear, currentMonth, day);
		if (onDateSelect) {
			onDateSelect(selectedDate);
		}
		// TODO: Load album entries for selected date
		console.log('Selected date:', selectedDate);
	}

	function getAlbumForDay(day: number): Album | null {
		// TODO: Return album data for specific day
		return null;
	}

	function handleAlbumClick(album: Album) {
		// TODO: Handle album click to show details
		console.log('Album clicked:', album);
	}
</script>

<div class="calendar-panel">
	<h2 class="text-center">Album Calendar</h2>

	<div class="calendar-header">
		<button onclick={previousMonth}>‹</button>
		<h3>{monthNames[currentMonth]} {currentYear}</h3>
		<button onclick={nextMonth}>›</button>
	</div>

	<div class="calendar-grid">
		<!-- Day headers -->
		<div class="day-header">Sun</div>
		<div class="day-header">Mon</div>
		<div class="day-header">Tue</div>
		<div class="day-header">Wed</div>
		<div class="day-header">Thu</div>
		<div class="day-header">Fri</div>
		<div class="day-header">Sat</div>

		<!-- Empty cells for days before month starts -->
		{#each Array(firstDayOfMonth()) as _}
			<div class="day-cell empty"></div>
		{/each}

		<!-- Days of the month -->
		{#each Array(daysInMonth()) as _, i}
			{@const day = i + 1}
			{@const album = getAlbumForDay(day)}
			<AlbumDay
				{album}
				{day}
				onclick={() => {
					selectDate(day);
					if (album) handleAlbumClick(album);
				}}
			/>
		{/each}

		<!-- Empty cells for days after month ends -->
		{#each Array(trailingDays) as _}
			<div class="day-cell empty"></div>
		{/each}
	</div>

	<div class="calendar-info">
		{#if selectedDate}
			<p>Selected: {selectedDate.toLocaleDateString()}</p>
			<!-- TODO: Show albums for selected date -->
		{:else}
			<p>Click on a date to see album details</p>
		{/if}
	</div>
</div>

<style>
	.calendar-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
		flex: 1;
	}

	.day-header {
		text-align: center;
		font-weight: bold;
		padding: 0.5rem;
		border-bottom: 1px solid #ccc;
	}

	.day-cell {
		border: 1px solid #ddd;
		aspect-ratio: 1 / 1;
		padding: 0.25rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.day-cell:hover {
		background-color: #f5f5f5;
	}

	.day-cell.selected {
		background-color: #e3f2fd;
		border-color: #2196f3;
	}

	.day-cell.empty {
		cursor: default;
		background-color: #f9f9f9;
	}

	.day-cell.has-album {
		background-color: #fff3e0;
	}

	.day-number {
		font-weight: bold;
		margin-bottom: 0.25rem;
	}

	.album-artwork {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.album-artwork img {
		max-width: 100%;
		max-height: 50px;
		border-radius: 4px;
		object-fit: cover;
	}

	.calendar-info {
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 4px;
		text-align: center;
	}
</style>
