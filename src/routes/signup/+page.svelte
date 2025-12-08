<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let user = $derived($page.data.user);
	let username = $state('');
	let isSubmitting = $state(false);
</script>

<div class="signup-container">
	<div class="signup-card">
		<h1>Choose Your Username</h1>
		<p class="subtitle">
			Welcome{user?.name ? `, ${user.name}` : ''}! Please select a username to continue.
		</p>

		<form
			method="POST"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				// Show loading state immediately
				isSubmitting = true;

				return async ({ result, update }) => {
					isSubmitting = false;

					if (result.type === 'failure') {
						// Handle error - form will show error message
						// Let SvelteKit handle the form update
						await update();
						return;
					}

					if (result.type === 'success') {
						// Success will redirect automatically
						await update();
						return;
					}

					// Handle redirect
					if (result.type === 'redirect') {
						await update();
						return;
					}
				};
			}}
		>
			<div class="form-group">
				<label for="username">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					bind:value={username}
					placeholder="Enter your username"
					required
					minlength="3"
					maxlength="20"
					pattern="[a-zA-Z0-9_]+"
					title="Username can only contain letters, numbers, and underscores"
					disabled={isSubmitting}
				/>
				<small class="help-text">3-20 characters, letters, numbers, and underscores only</small>
			</div>

			{#if $page.form?.error}
				<div class="error-message">
					{$page.form.error}
				</div>
			{/if}

			<button type="submit" disabled={isSubmitting || !username.trim()}>
				{isSubmitting ? 'Setting Username...' : 'Continue'}
			</button>
		</form>
	</div>
</div>

<style>
	.signup-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8fafc;
		padding: 20px;
	}

	.signup-card {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 0.5rem 0;
		color: #1a202c;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
	}

	.subtitle {
		margin: 0 0 2rem 0;
		color: #4a5568;
		text-align: center;
		font-size: 16px;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #2d3748;
		font-weight: 500;
		font-size: 14px;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #cbd5e0;
		border-radius: 6px;
		font-size: 16px;
		transition: border-color 0.2s ease;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #3182ce;
		box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
	}

	input:disabled {
		background-color: #f7fafc;
		cursor: not-allowed;
	}

	.help-text {
		display: block;
		margin-top: 0.25rem;
		color: #718096;
		font-size: 12px;
	}

	.error-message {
		background-color: #fed7d7;
		color: #c53030;
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		font-size: 14px;
		border: 1px solid #feb2b2;
	}

	button {
		width: 100%;
		background-color: #3182ce;
		color: white;
		padding: 0.75rem;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	button:hover:not(:disabled) {
		background-color: #2c5282;
	}

	button:disabled {
		background-color: #a0aec0;
		cursor: not-allowed;
	}
</style>
