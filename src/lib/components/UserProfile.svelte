<script lang="ts">
	import { authClient } from '$lib/auth.js';

	interface UserProfile {
		id: string;
		name: string;
		email: string;
		username?: string | null;
		image?: string | null;
		emailVerified: boolean;
		createdAt: Date;
		updatedAt: Date;
	}

	let { user }: { user: UserProfile } = $props();

	async function handleSignOut() {
		await authClient.signOut();
		window.location.reload();
	}
</script>

<div class="user-profile">
	{#if user.image}
		<img src={user.image} alt={user.name} class="avatar" />
	{/if}
	<div class="user-info">
		<h3>{user.name}</h3>
		<p>{user.email}</p>
		{#if user.username}
			<a href="/{user.username}" class="view-profile-link">View Profile</a>
		{/if}
		<button onclick={handleSignOut} class="sign-out-btn">Sign Out</button>
	</div>
</div>

<style>
	.user-profile {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background: white;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
	}

	.user-info h3 {
		margin: 0 0 4px 0;
		font-size: 16px;
		font-weight: 600;
	}

	.user-info p {
		margin: 0 0 8px 0;
		color: #64748b;
		font-size: 14px;
	}

	.view-profile-link {
		display: inline-block;
		margin-bottom: 12px;
		color: #3b82f6;
		text-decoration: none;
		font-size: 14px;
		font-weight: 500;
		transition: color 0.2s;
	}

	.view-profile-link:hover {
		color: #2563eb;
		text-decoration: underline;
	}

	.sign-out-btn {
		background: #ef4444;
		color: white;
		border: none;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.2s;
	}

	.sign-out-btn:hover {
		background: #dc2626;
	}
</style>
