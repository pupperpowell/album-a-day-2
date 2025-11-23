<script lang="ts">
	let { onSearchActiveChange } = $props();
	let searchQuery = $state('');
	let selectedAlbum = $state(null);
	let rating = $state(0);
	let notes = $state('');

	function searchAlbums() {
		// TODO: Implement Spotify API search
		console.log('Searching for:', searchQuery);
	}

	function createEntry() {
		// TODO: Implement entry creation
		console.log('Creating entry:', { selectedAlbum, rating, notes });
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
		<button onclick={searchAlbums}>Search</button>
	</div>

	{#if selectedAlbum}
		<div class="album-selection">
			<h3>Search Results</h3>
			<div class="search-results">
				<!-- TODO: Display search results -->
				<p>No albums searched yet</p>
			</div>
		</div>

		<div class="entry-form">
			<h3>Create Entry</h3>

			<div class="selected-album">
				<!-- TODO: Display selected album info -->
				<p>No album selected</p>
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

			<button onclick={createEntry} disabled={!selectedAlbum}> Create Entry </button>
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

	.search-results {
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid #eee;
		padding: 0.5rem;
	}

	.selected-album {
		padding: 0.5rem;
		background-color: #f9f9f9;
		border-radius: 4px;
	}

	textarea {
		min-height: 80px;
		resize: vertical;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
