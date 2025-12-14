import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { calendarEntry, album, track } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { SpotifyAlbum, SpotifyTrack } from '$lib/types/album';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		// Check if user is authenticated
		if (!locals.user) {
			return error(401, 'Unauthorized');
		}

		const body = await request.json();
		const {
			album: albumData,
			tracks: tracksData,
			rating,
			notes,
			listenDate,
			favoriteTrackId
		} = body;

		// Validate required fields
		if (!albumData || !listenDate || rating === undefined) {
			return error(400, 'Missing required fields: album, listenDate, rating');
		}

		const userId = locals.user!.id;

		// Start a transaction to ensure data consistency (synchronous for better-sqlite3)
		const result = db.transaction((tx) => {
			// Check if album already exists (by Spotify ID or by name/artist combination)
			let existingAlbum = null;

			if (albumData.spotifyId) {
				existingAlbum = tx.select().from(album).where(eq(album.spotifyId, albumData.spotifyId)).get();
			}

			if (!existingAlbum) {
				// Create new album
				const newAlbum = tx.insert(album).values({
					name: albumData.name,
					artist: albumData.artist,
					artwork: albumData.artwork,
					releaseDate: albumData.releaseDate,
					genres: albumData.genres ? JSON.stringify(albumData.genres) : null,
					spotifyId: albumData.spotifyId,
					spotifyUrl: albumData.spotifyUrl
				}).returning().get();

				existingAlbum = newAlbum;
			}

			// Create tracks if provided
			if (tracksData && tracksData.length > 0) {
				// First, delete existing tracks for this album to avoid duplicates
				tx.delete(track).where(eq(track.albumId, existingAlbum.id)).run();

				// Insert new tracks
				for (const trackData of tracksData) {
					tx.insert(track).values({
						id: trackData.id,
						albumId: existingAlbum.id,
						name: trackData.name,
						trackNumber: trackData.track_number,
						durationMs: trackData.duration_ms,
						explicit: trackData.explicit,
						previewUrl: trackData.preview_url,
						spotifyUrl: trackData.external_urls?.spotify,
						artists: trackData.artists ? JSON.stringify(trackData.artists.map((a: any) => a.name)) : null
					}).run();
				}
			}

			// Create calendar entry
			const newEntry = tx.insert(calendarEntry).values({
				userId,
				albumId: existingAlbum.id,
				listenDate: new Date(listenDate),
				rating: rating,
				notes: notes || null,
				favoriteTrackId: favoriteTrackId || null
			}).returning().get();

			return {
				entry: newEntry,
				album: existingAlbum
			};
		});

		return json({
			success: true,
			data: result
		});

	} catch (err) {
		console.error('Error creating entry:', err);
		return error(500, 'Internal server error');
	}
};

export const GET: RequestHandler = async ({ locals, url }) => {
	try {
		// Check if user is authenticated
		if (!locals.user) {
			return error(401, 'Unauthorized');
		}

		// Get query parameters
		const dateParam = url.searchParams.get('date');
		const monthParam = url.searchParams.get('month');
		const yearParam = url.searchParams.get('year');

		// Build where conditions
		const conditions = [eq(calendarEntry.userId, locals.user.id)];

		// If specific date is provided, filter by that date
		if (dateParam) {
			const targetDate = new Date(dateParam);
			const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

			conditions.push(eq(calendarEntry.listenDate, startOfDay));
		}

		// Combine all conditions
		const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

		// Query entries with album information
		const entries = await db
			.select({
				id: calendarEntry.id,
				listenDate: calendarEntry.listenDate,
				rating: calendarEntry.rating,
				notes: calendarEntry.notes,
				favoriteTrackId: calendarEntry.favoriteTrackId,
				createdAt: calendarEntry.createdAt,
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
			.where(whereClause)
			.orderBy(calendarEntry.listenDate);

		// Parse JSON fields
		const formattedEntries = entries.map(entry => ({
			...entry,
			album: entry.album ? {
				...entry.album,
				genres: entry.album.genres ? JSON.parse(entry.album.genres) : []
			} : null
		}));

		return json({
			success: true,
			data: formattedEntries
		});

	} catch (err) {
		console.error('Error fetching entries:', err);
		return error(500, 'Internal server error');
	}
};