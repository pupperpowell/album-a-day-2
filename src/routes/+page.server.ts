import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		// Check if user has username before redirecting to dashboard
		const { db } = await import('$lib/server/db');
		const { user } = await import('$lib/server/db/schema');
		const { eq } = await import('drizzle-orm');

		const userData = await db.select({
			username: user.username
		})
			.from(user)
			.where(eq(user.id, locals.user.id))
			.get();

		// Redirect to signup if user has no username, otherwise to dashboard
		if (!userData?.username) {
			throw redirect(302, '/signup');
		}
		throw redirect(302, '/dashboard');
	}
	return {};
};