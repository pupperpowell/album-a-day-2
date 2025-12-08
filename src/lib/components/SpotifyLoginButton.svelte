<script lang="ts">
	let { onclick }: { onclick?: () => void } = $props();
</script>

<button class="spotify-login-btn" {onclick}>
	<img src="/spotify.svg" alt="Spotify logo" />
	Log in with Spotify
</button>

<style>
	.spotify-login-btn {
		background-color: #1ed760;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 25px;
		display: flex;
		align-items: center;
		gap: 10px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: background-color 0.2s ease;
	}

	.spotify-login-btn:hover {
		background-color: #1db954;
	}

	.spotify-login-btn img {
		width: 20px;
		height: 20px;
	}
</style>
