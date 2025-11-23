<script lang="ts">
	import type { Album } from '$lib/types/album';

	let {
		selectedDate = $bindable(null)
	}: {
		selectedDate?: Date | null;
	} = $props();

	let selectedAlbum = $state<Album | null>(null);

	function closeDetails() {
		selectedDate = null;
		selectedAlbum = null;
	}

	function editEntry() {
		// TODO: Implement edit functionality
		console.log('Editing entry:', selectedAlbum);
	}

	function deleteEntry() {
		// TODO: Implement delete functionality
		console.log('Deleting entry:', selectedAlbum);
	}

	// This function would be called from the calendar when an album is selected
	export function selectAlbum(album: Album) {
		selectedAlbum = album;
	}
</script>

<div class="album-details-panel">
	{#if selectedDate}
		<div class="panel-content">
			<h2 class="text-center">Album Details</h2>

			{#if selectedAlbum}
				<div class="album-info">
					<div class="album-header">
						<div class="album-artwork">
							<img src={selectedAlbum.artwork} alt="{selectedAlbum.name} artwork" />
						</div>
						<div class="album-basic-info">
							<h3>{selectedAlbum.name}</h3>
							<p class="artist">{selectedAlbum.artist}</p>
							<p class="release-date">Released: {selectedAlbum.releaseDate}</p>
						</div>
					</div>

					<div class="album-metadata">
						<div class="genres">
							<h4>Genres</h4>
							<div class="genre-tags">
								{#each selectedAlbum.genres as genre}
									<span class="genre-tag">{genre}</span>
								{/each}
							</div>
						</div>

						<div class="rating">
							<h4>Your Rating</h4>
							<div class="rating-display">
								<span class="rating-number">{selectedAlbum.rating}/10</span>
								<div class="rating-stars">
									{#each Array(10) as _, i}
										<span class="star" class:filled={i < selectedAlbum.rating}>★</span>
									{/each}
								</div>
							</div>
						</div>

						<div class="listen-date">
							<h4>Listened On</h4>
							<p>{selectedAlbum.listenDate.toLocaleDateString()}</p>
						</div>
					</div>

					<div class="notes">
						<h4>Your Notes</h4>
						<p class="notes-content">{selectedAlbum.notes || 'No notes added'}</p>
					</div>

					<div class="actions">
						<button onclick={editEntry}>Edit Entry</button>
						<button onclick={deleteEntry} class="delete-btn">Delete Entry</button>
						<button onclick={closeDetails}>Close</button>
					</div>
				</div>
			{:else}
				<div class="date-selection">
					<div class="selected-date">
						<h3>Selected Date</h3>
						<p class="date-display">
							{selectedDate.toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					</div>
					<div class="no-album">
						<div class="placeholder-icon">🎵</div>
						<p>No album found for this date</p>
						<p class="hint">Add an album entry for this date to see details here</p>
					</div>
					<div class="actions">
						<button onclick={closeDetails}>Close</button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty panel with just border -->
		<div class="empty-panel"></div>
	{/if}
</div>

<style>
	.album-details-panel {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.panel-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		padding: 1rem;
	}

	.empty-panel {
		height: 100%;
		/* Just the border from the parent is visible */
	}

	.album-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}

	.date-selection {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}

	.selected-date {
		text-align: center;
		padding: 1rem;
		background-color: #f5f5f5;
		border-radius: 4px;
	}

	.selected-date h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.date-display {
		font-size: 1.1rem;
		font-weight: 600;
		color: #2196f3;
		margin: 0;
	}

	.no-album {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1;
		gap: 1rem;
	}

	.album-header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.album-artwork {
		flex-shrink: 0;
	}

	.album-artwork img {
		width: 120px;
		height: 120px;
		border-radius: 8px;
		object-fit: cover;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.album-basic-info {
		flex: 1;
	}

	.album-basic-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
	}

	.artist {
		font-weight: 600;
		color: #666;
		margin: 0.25rem 0;
	}

	.release-date {
		font-size: 0.9rem;
		color: #888;
		margin: 0.25rem 0;
	}

	.album-metadata {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.genres h4,
	.rating h4,
	.listen-date h4,
	.notes h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #333;
	}

	.genre-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.genre-tag {
		background-color: #e3f2fd;
		color: #1976d2;
		padding: 0.25rem 0.5rem;
		border-radius: 12px;
		font-size: 0.8rem;
	}

	.rating-display {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.rating-number {
		font-weight: bold;
		font-size: 1.2rem;
	}

	.rating-stars {
		display: flex;
		gap: 0.1rem;
	}

	.star {
		color: #ddd;
		font-size: 1.2rem;
	}

	.star.filled {
		color: #ffc107;
	}

	.notes-content {
		background-color: #f9f9f9;
		padding: 0.75rem;
		border-radius: 4px;
		border-left: 3px solid #2196f3;
		white-space: pre-wrap;
		min-height: 60px;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		margin-top: auto;
	}

	.delete-btn {
		background-color: #f44336;
		color: white;
	}

	.delete-btn:hover {
		background-color: #d32f2f;
	}

	.no-selection {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1;
		gap: 1rem;
	}

	.placeholder-icon {
		font-size: 3rem;
		opacity: 0.5;
	}

	.no-selection p {
		margin: 0;
		color: #666;
	}

	.hint {
		font-size: 0.9rem;
		color: #999;
	}
</style>
