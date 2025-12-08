<script lang="ts">
	import type { SpotifyAlbum } from '$lib/types/album';

	let {
		albums = $bindable([]),
		loading = $bindable(false),
		error = $bindable(null),
		onAlbumSelect
	}: {
		albums?: SpotifyAlbum[];
		loading?: boolean;
		error?: string | null;
		onAlbumSelect?: (album: SpotifyAlbum) => void;
	} = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.getFullYear().toString();
	}

	function getBestImage(images: SpotifyAlbum['images']): string {
		// Prefer medium size (300px), fallback to small (64px), then any available
		const medium = images.find((img) => img.height === 300);
		const small = images.find((img) => img.height === 64);
		return medium?.url || small?.url || images[0]?.url || '';
	}

	function handleAlbumClick(album: SpotifyAlbum) {
		if (onAlbumSelect) {
			onAlbumSelect(album);
		}
	}
</script>

<div class="search-results">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Searching albums...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<p class="error-message">{error}</p>
		</div>
	{:else if albums.length === 0}
		<div class="empty-state">
			<p>No albums found.</p>
		</div>
	{:else}
		<div class="albums-grid">
			{#each albums as album (album.id)}
				<div
					class="album-card"
					role="button"
					tabindex="0"
					onclick={() => handleAlbumClick(album)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleAlbumClick(album);
						}
					}}
				>
					<div class="album-artwork">
						<img
							src={getBestImage(album.images)}
							alt="{album.name} artwork"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src =
									'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
							}}
						/>
					</div>
					<div class="album-info">
						<h4 class="album-name">{album.name}</h4>
						<p class="album-artist">{album.artists.map((a) => a.name).join(', ')}</p>
						<p class="album-year">{formatDate(album.release_date)}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-results {
		min-height: 200px;
	}

	.loading-state,
	.error-state,
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		text-align: center;
		color: #666;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #f3f3f3;
		border-top: 3px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.error-message {
		color: #e74c3c;
		font-weight: 500;
	}

	.albums-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
		padding: 0.5rem;
	}

	.album-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
		background: white;
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.album-card:hover {
		border-color: #3498db;
		box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
		transform: translateY(-2px);
	}

	.album-card:focus {
		outline: 2px solid #3498db;
		outline-offset: 2px;
	}

	.album-artwork {
		width: 100%;
		aspect-ratio: 1 / 1;
		margin-bottom: 0.75rem;
		border-radius: 4px;
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.album-artwork img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s ease;
	}

	.album-card:hover .album-artwork img {
		transform: scale(1.05);
	}

	.album-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.album-name {
		font-size: 0.9rem;
		font-weight: 600;
		line-height: 1.2;
		margin: 0;
		color: #333;
		line-clamp: 2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.album-artist {
		font-size: 0.8rem;
		color: #666;
		margin: 0;
		display: -webkit-box;
		line-clamp: 1;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.album-year {
		font-size: 0.75rem;
		color: #999;
		margin: 0;
	}

	@media (max-width: 768px) {
		.albums-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 0.75rem;
		}
	}

	@media (max-width: 480px) {
		.albums-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
