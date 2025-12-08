import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/');
	}

	// Fetch complete user data including username from database
	const userData = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		username: user.username,
		image: user.image,
		emailVerified: user.emailVerified,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt
	})
		.from(user)
		.where(eq(user.id, locals.user.id))
		.get();

	// Redirect to signup if user has no username
	if (!userData?.username) {
		throw redirect(302, '/signup');
	}

	return {
		user: userData
	};
};