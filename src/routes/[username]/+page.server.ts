import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { username } = params;

	// Query the user by username
	const userData = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		username: user.username,
		image: user.image,
		createdAt: user.createdAt
	})
		.from(user)
		.where(eq(user.username, username))
		.get();

	// If user not found, return 404
	if (!userData) {
		throw error(404, 'User not found');
	}

	return {
		user: userData
	};
};