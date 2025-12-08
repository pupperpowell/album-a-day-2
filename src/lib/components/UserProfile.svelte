<script lang="ts">
	import { authClient } from '$lib/auth.js';
	import type { User } from 'better-auth/types';

	let { user }: { user: User } = $props();

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
		margin: 0 0 12px 0;
		color: #64748b;
		font-size: 14px;
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