<script lang="ts">
	import type { Album } from '$lib/types/album';
	import { imageCache, getOptimalArtworkUrl } from '$lib/utils/imageCache';

	let {
		album,
		day,
		selected = false,
		isFuture = false,
		isNewEntryFocused = false,
		onclick
	}: {
		album: Album | null;
		day: number;
		selected?: boolean;
		isFuture?: boolean;
		isNewEntryFocused?: boolean;
		onclick?: () => void;
	} = $props();

	let imageLoaded = $state(false);
	let imageError = $state(false);
	let cachedImageUrl = $state<string | null>(null);
	let randomRotation = $state(0);

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	function handleImageError() {
		imageError = true;
	}

	// Generate random rotation on mount
	$effect(() => {
		randomRotation = Math.random() * 6 - 3; // Random between -3 and 3 degrees
	});

	// Load and cache image when component mounts or album changes
	$effect(() => {
		if (album?.artwork && !imageError) {
			const optimalUrl = getOptimalArtworkUrl(album.artwork, 150);
			if (optimalUrl) {
				imageCache.getImage(optimalUrl).then((cached) => {
					if (cached) {
						cachedImageUrl = cached;
					}
				});
			}
		} else {
			cachedImageUrl = null;
		}
	});
</script>

<div
	class="album-day"
	class:has-album={album}
	class:selected
	class:future-dimmed={isFuture && isNewEntryFocused}
	onclick={handleClick}
	role="button"
	tabindex={0}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}}
>
	<div class="day-number">{day}</div>
	{#if album}
		<div class="album-thumbnail" style="transform: rotate({randomRotation}deg);">
			{#if album.artwork && !imageError && cachedImageUrl}
				<img
					src={cachedImageUrl}
					alt="{album.name} by {album.artist}"
					title="{album.name} by {album.artist} (Rating: {album.rating}/10)"
					onload={handleImageLoad}
					onerror={handleImageError}
					class:loaded={imageLoaded}
				/>
			{:else if album.artwork && !imageError}
				<!-- Fallback to original URL while caching -->
				<img
					src={getOptimalArtworkUrl(album.artwork, 150) || album.artwork}
					alt="{album.name} by {album.artist}"
					title="{album.name} by {album.artist} (Rating: {album.rating}/10)"
					onload={handleImageLoad}
					onerror={handleImageError}
					class:loaded={imageLoaded}
				/>
			{:else}
				<div class="album-placeholder">
					<div class="placeholder-icon">🎵</div>
				</div>
			{/if}
			{#if album.rating}
				<div class="rating-indicator">{album.rating}</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.album-day {
		border: 1px solid #ddd;
		aspect-ratio: 1 / 1;
		padding: 0.25rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		position: relative;
		transition: all 0.2s ease;
		min-height: 120px;
	}

	.album-day:hover {
		background-color: #f5f5f5;
		border-color: #999;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.album-day:focus {
		background-color: #ffb74d;
	}

	.album-day.has-album {
		background-color: #fff3e0;
		border-color: #ffb74d;
	}

	.album-day.selected {
		background-color: #e3f2fd;
		border-color: #2196f3;
		box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.3);
	}

	.day-number {
		/* font-weight: bold; */
		margin-bottom: 0;
		font-size: 0.9rem;
		color: #333;
		position: relative;
		z-index: 2;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 2px 4px;
		border-radius: 3px;
		align-self: flex-start;
		margin-left: 4px;
		margin-top: 4px;
		flex-shrink: 0;
	}

	.album-thumbnail {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-top: -8px;
		min-height: 0;
	}

	.album-thumbnail img {
		max-width: 110%;
		max-height: 110%;
		border-radius: 4px;
		object-fit: cover;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
		opacity: 0;
		transition:
			opacity 0.3s ease,
			transform 0.2s ease;
	}

	.album-thumbnail img.loaded {
		opacity: 1;
	}

	.album-placeholder {
		width: 110%;
		height: 110%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		border-radius: 4px;
		border: 1px dashed #ccc;
	}

	.placeholder-icon {
		font-size: 1.5rem;
		opacity: 0.5;
	}

	.rating-indicator {
		position: absolute;
		top: 2px;
		right: 2px;
		background-color: #2196f3;
		color: white;
		border-radius: 50%;
		width: 16px;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		font-weight: bold;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.album-day.future-dimmed {
		opacity: 0.4;
		pointer-events: none;
	}
</style>
