<script lang="ts">
	import { page } from '$app/state';

	function goHome() {
		window.location.href = '/';
	}
</script>

<div class="error-container">
	<div class="error-content">
		<h1 class="error-title">User Not Found</h1>
		<p class="error-message">
			The user "@{page.params.username}" doesn't exist or may have been removed.
		</p>
		<div class="error-actions">
			<button class="home-button" onclick={goHome}>Go Home</button>
		</div>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		max-width: 500px;
	}

	.error-title {
		font-size: 2rem;
		font-weight: 700;
		color: #1e293b;
		margin-bottom: 1rem;
	}

	.error-message {
		font-size: 1.125rem;
		color: #64748b;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.home-button {
		background-color: #3b82f6;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.home-button:hover {
		background-color: #2563eb;
	}

	@media (max-width: 640px) {
		.error-container {
			padding: 1rem;
		}

		.error-title {
			font-size: 1.5rem;
		}

		.error-message {
			font-size: 1rem;
		}
	}
</style>
