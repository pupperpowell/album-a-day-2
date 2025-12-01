import { env } from '$env/dynamic/private';
import type { Album, SpotifyAlbum } from '$lib/types/album';

interface SpotifyToken {
	access_token: string;
	token_type: string;
	expires_in: number;
}

interface SpotifySearchResponse {
	albums: {
		items: SpotifyAlbum[];
		total: number;
	};
}

let cachedToken: SpotifyToken | null = null;
let tokenExpiry: number = 0;

/**
 * Get a valid access token for the Spotify API
 * Uses client credentials flow
 */
async function getAccessToken(): Promise<string> {
	// Check if we have a valid cached token
	if (cachedToken && Date.now() < tokenExpiry) {
		return cachedToken.access_token;
	}

	// Request a new token
	const authString = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Authorization': `Basic ${authString}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'grant_type=client_credentials'
	});

	if (!response.ok) {
		throw new Error(`Failed to get access token: ${response.statusText}`);
	}

	const tokenData: SpotifyToken = await response.json();

	// Cache the token
	cachedToken = tokenData;
	tokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // Refresh 1 minute before expiry

	return tokenData.access_token;
}

/**
 * Search for albums on Spotify
 * @param query - Search query string
 * @param limit - Maximum number of results to return (default: 6)
 * @returns Array of Spotify albums
 */
export async function searchAlbums(query: string, limit: number = 6): Promise<SpotifyAlbum[]> {
	if (!query.trim()) {
		return [];
	}

	try {
		const token = await getAccessToken();

		const response = await fetch(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=${limit}&market=US`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Search failed: ${response.statusText}`);
		}

		const data: SpotifySearchResponse = await response.json();
		return data.albums.items;
	} catch (error) {
		console.error('Error searching Spotify:', error);
		throw error;
	}
}

/**
 * Get detailed information about a specific album
 * @param albumId - Spotify album ID
 * @returns Detailed album information
 */
export async function getAlbumDetails(albumId: string): Promise<SpotifyAlbum> {
	try {
		const token = await getAccessToken();

		const response = await fetch(
			`https://api.spotify.com/v1/albums/${albumId}?market=US`,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Failed to get album details: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error getting album details:', error);
		throw error;
	}
}
