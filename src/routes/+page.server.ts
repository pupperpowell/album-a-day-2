import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, calendarEntry, album } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	// Get a random user from the database
	const randomUsers = await db.select({ id: user.id }).from(user).orderBy(sql`RANDOM()`).limit(1);
	const randomUser = randomUsers[0];

	let albumMap: Record<string, any> = {};

	if (randomUser) {
		// Fetch calendar entries with album information for the random user
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
			.where(eq(calendarEntry.userId, randomUser.id))
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
		const map = new Map<string, any>();
		formattedEntries.forEach(entry => {
			if (entry.album) {
				const dateKey = entry.listenDate.toISOString().split('T')[0];
				map.set(dateKey, {
					...entry.album,
					rating: entry.rating,
					notes: entry.notes,
					listenDate: entry.listenDate,
					favoriteTrackId: entry.favoriteTrackId
				});
			}
		});

		albumMap = Object.fromEntries(map);
	}

	return {
		user: locals.user,
		albumMap
	};
};