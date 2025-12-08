<script lang="ts">
	import { authClient } from '$lib/auth.js';
	import spotify from '$lib/assets/Primary_Logo_Green_CMYK.svg';

	async function handleSpotifyLogin() {
		await authClient.signIn.social({
			provider: 'spotify'
		});
	}
</script>

<button class="spotify-login-btn" onclick={handleSpotifyLogin}>
	<img src={spotify} alt="Spotify logo" />
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
		filter: brightness(0) invert(1);
		width: 25px;
		height: 25px;
	}
</style>
