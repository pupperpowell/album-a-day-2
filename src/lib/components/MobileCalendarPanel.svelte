<script lang="ts">
	import type { Album } from '$lib/types/album';

	let {
		onDateSelect,
		onAlbumSelect,
		selectedDate = $bindable(null),
		albumMap = {} as Record<string, Album>,
		isNewEntryFocused = false
	}: {
		onDateSelect?: (date: Date | null) => void;
		onAlbumSelect?: (album: Album) => void;
		selectedDate?: Date | null;
		albumMap?: Record<string, Album>;
		isNewEntryFocused?: boolean;
	} = $props();

	const sortedAlbums = $derived(
		Array.from(Object.entries(albumMap))
			.map(([dateStr, album]) => ({
				dateStr,
				date: album.listenDate,
				album
			}))
			.sort((a, b) => b.date.getTime() - a.date.getTime())
	);

	function formatDate(date: Date): string {
		const day = date.getDate();
		const suffixes = ['th', 'st', 'nd', 'rd'];
		const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : suffixes[(day % 10) - 1] || 'th';
		return (
			date
				.toLocaleDateString('en-US', {
					month: 'long',
					year: 'numeric'
				})
				.replace(/ \d{4}$/, '') + ` ${day}${suffix}`
		);
	}

	function isSelected(dateStr: string): boolean {
		if (!selectedDate) return false;
		return selectedDate.toISOString().split('T')[0] === dateStr;
	}

	function handleEntryClick(entry: { dateStr: string; date: Date; album: Album }) {
		const date = new Date(entry.date);
		selectedDate = date;
		onDateSelect?.(date);
		onAlbumSelect?.(entry.album);
	}
</script>

<div class="mobile-calendar-panel">
	{#if sortedAlbums.length === 0}
		<div class="no-entries">No album entries yet. Add your first album!</div>
	{:else}
		{#each sortedAlbums as entry (entry.dateStr)}
			<div
				class="album-entry"
				class:selected={isSelected(entry.dateStr)}
				class:dimmed={isNewEntryFocused}
				onclick={() => handleEntryClick(entry)}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						handleEntryClick(entry);
					}
				}}
			>
				<div class="date-header">{formatDate(entry.date)}</div>
				<div class="entry-content">
					<div class="album-artwork">
						{#if entry.album.artwork}
							<img
								src={entry.album.artwork}
								alt="{entry.album.name} by {entry.album.artist}"
								class="artwork-img"
							/>
						{:else}
							<div class="artwork-placeholder">🎵</div>
						{/if}
						{#if entry.album.rating}
							<div class="rating">{entry.album.rating}</div>
						{/if}
					</div>
					<div class="album-details">
						<h3>{entry.album.name}</h3>
						<p class="artist">{entry.album.artist}</p>
						{#if entry.album.notes && entry.album.notes.trim()}
							<p class="notes">
								{entry.album.notes.length > 100
									? entry.album.notes.slice(0, 100) + '...'
									: entry.album.notes}
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.mobile-calendar-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 0;
		height: 100%;
		overflow-y: auto;
	}

	.album-entry {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		background: #fafafa;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.album-entry:hover {
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.album-entry.selected {
		border-color: #2196f3;
		background: #e3f2fd;
		box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
	}

	.album-entry.dimmed {
		opacity: 0.5;
		pointer-events: none;
	}

	.date-header {
		font-size: 1.1rem;
		font-weight: 600;
		color: #333;
		margin: 0;
	}

	.entry-content {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.album-artwork {
		flex-shrink: 0;
		position: relative;
	}

	.artwork-img {
		width: 72px;
		height: 72px;
		object-fit: cover;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.artwork-placeholder {
		width: 72px;
		height: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f0f0f0;
		border-radius: 8px;
		border: 2px dashed #ccc;
		font-size: 1.8rem;
		color: #999;
	}

	.rating {
		position: absolute;
		top: 4px;
		right: 4px;
		background: #2196f3;
		color: white;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.album-details {
		flex: 1;
		min-width: 0;
	}

	.album-details h3 {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #111;
		line-height: 1.3;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.artist {
		margin: 0 0 0.5rem 0;
		color: #666;
		font-size: 0.95rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.notes {
		margin: 0;
		color: #555;
		font-size: 0.9rem;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.no-entries {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		color: #888;
		font-style: italic;
		text-align: center;
	}
</style>
