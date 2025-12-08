<script lang="ts">
	import type { Album } from '$lib/types/album';

	let {
		album,
		day,
		onclick
	}: {
		album: Album | null;
		day: number;
		onclick?: () => void;
	} = $props();

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}
</script>

<div
	class="album-day"
	class:has-album={album}
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
		<div class="album-thumbnail">
			<img
				src={album.artwork}
				alt="{album.name} by {album.artist}"
				title="{album.name} by {album.artist} (Rating: {album.rating}/10)"
			/>
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

	.day-number {
		/* font-weight: bold; */
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		color: #333;
	}

	.album-thumbnail {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.album-thumbnail img {
		max-width: 100%;
		max-height: 50px;
		border-radius: 4px;
		object-fit: cover;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
</style>
