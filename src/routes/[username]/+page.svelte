<script lang="ts">
	import type { PageProps } from './$types';
	import { page } from '$app/state';

	let { data }: PageProps = $props();

	// Format the creation date
	const formattedDate = $derived(
		data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : 'Unknown'
	);
</script>

<div class="profile-container">
	<div class="profile-header">
		<div class="profile-avatar">
			{#if data.user.image}
				<img src={data.user.image} alt="{data.user.name}'s profile picture" />
			{:else}
				<div class="default-avatar">
					{data.user.name.charAt(0).toUpperCase()}
				</div>
			{/if}
		</div>

		<div class="profile-info">
			<h1 class="profile-name">{data.user.name}</h1>
			<p class="profile-username">@{data.user.username}</p>
			<p class="profile-joined">Joined {formattedDate}</p>
		</div>
	</div>
</div>

<style>
	.profile-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.profile-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid #e2e8f0;
	}

	.profile-avatar {
		flex-shrink: 0;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		background: #f1f5f9;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.default-avatar {
		font-size: 3rem;
		font-weight: bold;
		color: #64748b;
	}

	.profile-info {
		flex: 1;
	}

	.profile-name {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		color: #1e293b;
	}

	.profile-username {
		font-size: 1.25rem;
		color: #64748b;
		margin: 0 0 0.5rem 0;
		font-weight: 500;
	}

	.profile-joined {
		font-size: 0.875rem;
		color: #94a3b8;
		margin: 0;
	}

	@media (max-width: 640px) {
		.profile-container {
			padding: 1rem;
		}

		.profile-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.profile-avatar {
			width: 100px;
			height: 100px;
		}

		.profile-name {
			font-size: 1.5rem;
		}

		.profile-username {
			font-size: 1rem;
		}
	}
</style>
