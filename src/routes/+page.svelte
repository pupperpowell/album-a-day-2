<script lang="ts">
	import SpotifyLoginButton from '$lib/components/SpotifyLoginButton.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import { page } from '$app/stores';

	$: user = $page.data.user;
</script>

<div class="app-container">
	<header class="app-header">
		<h1>Album a Day</h1>
		<div class="auth-section">
			{#if user}
				<UserProfile {user} />
			{:else}
				<SpotifyLoginButton />
			{/if}
		</div>
	</header>

	{#if user}
		<main class="app-main">
			<p>Welcome, {user.name}! Your album tracking app is ready.</p>
		</main>
	{:else}
		<main class="app-main">
			<p>Please log in with Spotify to start tracking your albums.</p>
		</main>
	{/if}
</div>

<style>
	.app-container {
		min-height: 100vh;
		background: #f8fafc;
	}

	.app-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		background: white;
		border-bottom: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.app-header h1 {
		margin: 0;
		color: #1a202c;
		font-size: 24px;
		font-weight: bold;
	}

	.app-main {
		padding: 40px 20px;
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.app-main p {
		font-size: 18px;
		color: #4a5568;
		margin: 0;
	}
</style>
