<script lang="ts">
	import SearchResults from './SearchResults.svelte';
	import type { SpotifyAlbum, Album } from '$lib/types/album';
	import { spotifyToAlbum } from '$lib/utils/album';

	let { onSearchActiveChange } = $props();
	let searchQuery = $state('');
	let searchResults = $state<SpotifyAlbum[]>([]);
	let selectedSpotifyAlbum = $state<SpotifyAlbum | null>(null);
	let selectedAlbum = $state<Omit<Album, 'rating' | 'notes' | 'listenDate'> | null>(null);
	let rating = $state(0);
	let notes = $state('');
	let isLoading = $state(false);
	let searchError = $state<string | null>(null);
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;

	// Debounced search function
	function performSearch() {
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		if (!searchQuery.trim()) {
			searchResults = [];
			searchError = null;
			return;
		}

		searchTimeout = setTimeout(async () => {
			isLoading = true;
			searchError = null;

			try {
				const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
				if (!response.ok) {
					throw new Error('Search failed');
				}
				const data = await response.json();
				const rawResults = data.albums || [];
				searchResults = filterAlbums(rawResults);
			} catch (error) {
				console.error('Search error:', error);
				searchError = 'Failed to search albums. Please try again.';
				searchResults = [];
			} finally {
				isLoading = false;
			}
		}, 500); // 500ms debounce
	}

	// Filter albums to only include albums and remove duplicates
	function filterAlbums(albums: SpotifyAlbum[]): SpotifyAlbum[] {
		// First filter to only include albums (not singles, compilations, etc.)
		const albumTypeFiltered = albums.filter((album) => album.album_type === 'album');

		// Then remove duplicates (same name and same primary artist ID)
		const seen = new Set<string>();
		const deduplicated = albumTypeFiltered.filter((album) => {
			const primaryArtist = album.artists[0];
			if (!primaryArtist) return false;

			const key = `${album.name.toLowerCase()}-${primaryArtist.id}`;
			if (seen.has(key)) {
				return false; // Skip duplicate
			}
			seen.add(key);
			return true;
		});

		return deduplicated;
	}

	// Watch for search query changes
	$effect(() => {
		performSearch();
	});

	function handleAlbumSelect(album: SpotifyAlbum) {
		selectedSpotifyAlbum = album;
		selectedAlbum = spotifyToAlbum(album);
	}

	function createEntry() {
		// TODO: Implement entry creation
		console.log('Creating entry:', { selectedAlbum, rating, notes });
	}

	function clearSelection() {
		selectedSpotifyAlbum = null;
		selectedAlbum = null;
		rating = 0;
		notes = '';
	}
</script>

<div class="new-entry-panel">
	<h2 class="text-center">New Entry</h2>

	<div class="search-section">
		<input
			id="search"
			type="text"
			bind:value={searchQuery}
			placeholder="Enter album or artist name"
			onfocus={() => onSearchActiveChange?.(true)}
			onblur={() => onSearchActiveChange?.(false)}
		/>
	</div>

	<!-- Search Results -->
	{#if searchQuery.trim() || searchResults.length > 0}
		<div class="album-selection">
			<h3>Search Results</h3>
			<SearchResults
				bind:albums={searchResults}
				bind:loading={isLoading}
				bind:error={searchError}
				onAlbumSelect={handleAlbumSelect}
			/>
		</div>
	{/if}

	<!-- Selected Album and Entry Form -->
	{#if selectedAlbum}
		<div class="entry-form">
			<h3>Create Entry</h3>

			<div class="selected-album">
				<div class="album-header">
					<div class="album-artwork">
						<img
							src={selectedAlbum.artwork}
							alt="{selectedAlbum.name} artwork"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src =
									'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
							}}
						/>
					</div>
					<div class="album-info">
						<h4>{selectedAlbum.name}</h4>
						<p class="artist">{selectedAlbum.artist}</p>
						<p class="release-date">Released: {selectedAlbum.releaseDate}</p>
						{#if selectedSpotifyAlbum?.external_urls.spotify}
							<a
								href={selectedSpotifyAlbum.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								class="spotify-link"
							>
								View on Spotify →
							</a>
						{/if}
					</div>
				</div>
				<button class="clear-selection" onclick={clearSelection}>✕ Clear Selection</button>
			</div>

			<div class="rating-section">
				<label for="rating">Rating</label>
				<input id="rating" type="number" min="1" max="10" bind:value={rating} placeholder="1-10" />
			</div>

			<div class="notes-section">
				<label for="notes">Notes</label>
				<textarea id="notes" bind:value={notes} placeholder="Your thoughts on this album..."
				></textarea>
			</div>

			<button onclick={createEntry} disabled={!selectedAlbum || rating < 1 || rating > 10}>
				Create Entry
			</button>
		</div>
	{/if}
</div>

<style>
	.new-entry-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.search-section,
	.album-selection,
	.entry-form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.search-section input {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.search-section input:focus {
		outline: none;
		border-color: #3498db;
		box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
	}

	.selected-album {
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 8px;
		position: relative;
	}

	.album-header {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.album-artwork {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		border-radius: 4px;
		overflow: hidden;
		background-color: #eee;
	}

	.album-artwork img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.album-info {
		flex: 1;
	}

	.album-info h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		color: #333;
	}

	.album-info .artist {
		margin: 0.25rem 0;
		font-weight: 600;
		color: #666;
	}

	.album-info .release-date {
		margin: 0.25rem 0;
		font-size: 0.9rem;
		color: #888;
	}

	.spotify-link {
		display: inline-block;
		margin-top: 0.5rem;
		color: #1db954;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.spotify-link:hover {
		text-decoration: underline;
	}

	.clear-selection {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: none;
		border: none;
		font-size: 1.2rem;
		color: #999;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
	}

	.clear-selection:hover {
		color: #666;
	}

	.rating-section,
	.notes-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rating-section input,
	.notes-section textarea {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.rating-section input:focus,
	.notes-section textarea:focus {
		outline: none;
		border-color: #3498db;
		box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
	}

	textarea {
		min-height: 80px;
		resize: vertical;
		font-family: inherit;
	}

	button {
		padding: 0.75rem 1rem;
		background-color: #3498db;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:hover:not(:disabled) {
		background-color: #2980b9;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
