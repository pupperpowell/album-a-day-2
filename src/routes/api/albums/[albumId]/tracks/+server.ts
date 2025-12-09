import { json } from '@sveltejs/kit';
import { getAlbumTracks } from '$lib/server/spotify';

export const GET = async ({ params }) => {
	const { albumId } = params;

	if (!albumId) {
		return json({ error: 'Album ID is required' }, { status: 400 });
	}

	try {
		const albumWithTracks = await getAlbumTracks(albumId);
		return json({ album: albumWithTracks });
	} catch (error) {
		console.error('Error fetching album tracks:', error);
		return json(
			{ error: 'Failed to fetch album tracks' },
			{ status: 500 }
		);
	}
};