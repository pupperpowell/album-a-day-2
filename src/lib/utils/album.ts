import type { Album, SpotifyAlbum } from '$lib/types/album';

/**
 * Convert a Spotify album to our app's Album format
 */
export function spotifyToAlbum(spotifyAlbum: SpotifyAlbum): Omit<Album, 'rating' | 'notes' | 'listenDate'> {
	// Get the best available image (prefer medium size)
	const image = spotifyAlbum.images.find(img => img.height === 300) ||
		spotifyAlbum.images.find(img => img.height === 64) ||
		spotifyAlbum.images[0];

	return {
		id: spotifyAlbum.id,
		name: spotifyAlbum.name,
		artist: spotifyAlbum.artists.map(a => a.name).join(', '),
		artwork: image?.url || '',
		releaseDate: spotifyAlbum.release_date,
		genres: spotifyAlbum.genres || [],
		spotifyId: spotifyAlbum.id,
		spotifyUrl: spotifyAlbum.external_urls.spotify
	};
}