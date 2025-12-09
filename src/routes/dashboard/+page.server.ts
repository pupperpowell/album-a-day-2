import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, calendarEntry, album } from '$lib/server/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
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

	// Get month and year from URL params, default to current month
	const now = new Date();
	const monthParam = url.searchParams.get('month');
	const yearParam = url.searchParams.get('year');

	const month = monthParam ? parseInt(monthParam, 10) : now.getMonth();
	const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();

	// Calculate date range for the month
	const startDate = new Date(year, month, 1);
	const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999); // Last day of month

	// Query entries with album information for the specified month
	const entries = await db
		.select({
			id: calendarEntry.id,
			listenDate: calendarEntry.listenDate,
			rating: calendarEntry.rating,
			notes: calendarEntry.notes,
			favoriteTrackId: calendarEntry.favoriteTrackId,
			album: {
				id: album.id,
				name: album.name,
				artist: album.artist,
				artwork: album.artwork,
				releaseDate: album.releaseDate,
				genres: album.genres,
				spotifyId: album.spotifyId,
				spotifyUrl: album.spotifyUrl
			}
		})
		.from(calendarEntry)
		.leftJoin(album, eq(calendarEntry.albumId, album.id))
		.where(
			and(
				eq(calendarEntry.userId, locals.user.id),
				gte(calendarEntry.listenDate, startDate),
				lte(calendarEntry.listenDate, endDate)
			)
		)
		.orderBy(calendarEntry.listenDate);

	// Parse JSON fields and format entries
	const formattedEntries = entries.map(entry => ({
		...entry,
		album: entry.album ? {
			...entry.album,
			genres: entry.album.genres ? JSON.parse(entry.album.genres) : []
		} : null
	}));

	// Create a Map for efficient lookup by date string (YYYY-MM-DD)
	const albumMap = new Map<string, any>();
	formattedEntries.forEach(entry => {
		if (entry.album) {
			const dateKey = entry.listenDate.toISOString().split('T')[0];
			albumMap.set(dateKey, {
				...entry.album,
				rating: entry.rating, // Rating stored as 0-10 scale
				notes: entry.notes,
				listenDate: entry.listenDate,
				favoriteTrackId: entry.favoriteTrackId
			});
		}
	});

	return {
		user: userData,
		calendarData: {
			month,
			year,
			entries: formattedEntries,
			albumMap: Object.fromEntries(albumMap) // Convert Map to plain object for serialization
		}
	};
};