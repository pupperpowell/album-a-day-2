import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	// Redirect to dashboard if user is not logged in
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Fetch complete user data to check if username exists
	const userData = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		username: user.username,
		image: user.image
	})
		.from(user)
		.where(eq(user.id, locals.user.id))
		.get();

	// Redirect to dashboard if user already has a username
	if (userData?.username) {
		throw redirect(302, '/dashboard');
	}

	return {
		user: userData
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'You must be logged in to set a username' });
		}

		const formData = await request.formData();
		const username = formData.get('username') as string;

		if (!username || username.trim().length === 0) {
			return fail(400, { error: 'Username is required' });
		}

		const trimmedUsername = username.trim();

		if (trimmedUsername.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters long' });
		}

		if (trimmedUsername.length > 20) {
			return fail(400, { error: 'Username must be less than 20 characters' });
		}

		// Prevent reserved usernames
		const reservedUsernames = ['dashboard', 'admin', 'api', 'signup', 'login', 'logout', 'settings'];
		if (reservedUsernames.includes(trimmedUsername.toLowerCase())) {
			return fail(400, { error: 'This username is reserved and cannot be used' });
		}

		// Check if username is already taken
		const existingUser = await db.select({ id: user.id })
			.from(user)
			.where(eq(user.username, username.trim()))
			.get();

		if (existingUser) {
			return fail(400, { error: 'Username is already taken' });
		}

		// Update user with the new username
		await db.update(user)
			.set({
				username: username.trim(),
				updatedAt: new Date()
			})
			.where(eq(user.id, locals.user.id));

		// Redirect to dashboard after successful username set
		throw redirect(302, '/dashboard');
	}
};