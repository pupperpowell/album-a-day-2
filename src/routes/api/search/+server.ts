import { json } from '@sveltejs/kit';
import { searchAlbums } from '$lib/server/spotify';

export const GET = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return json({ error: 'Query parameter "q" is required' }, { status: 400 });
	}

	try {
		const albums = await searchAlbums(query);
		return json({ albums });
	} catch (error) {
		console.error('Search error:', error);
		return json(
			{ error: 'Failed to search albums' },
			{ status: 500 }
		);
	}
};