export interface Album {
	id: string;
	name: string;
	artist: string;
	artwork: string;
	releaseDate: string;
	genres: string[];
	rating: number;
	notes: string;
	listenDate: Date;
	spotifyId?: string;
	spotifyUrl?: string;
	favoriteTrack?: string;
	favoriteTrackId?: string;
}

export interface SpotifyAlbum {
	id: string;
	name: string;
	artists: Array<{
		id: string;
		name: string;
	}>;
	images: Array<{
		url: string;
		height: number;
		width: number;
	}>;
	release_date: string;
	external_urls: {
		spotify: string;
	};
	genres?: string[];
	album_type: string;
}

export interface SpotifyTrack {
	id: string;
	name: string;
	track_number: number;
	duration_ms: number;
	explicit: boolean;
	preview_url: string | null;
	artists: Array<{
		id: string;
		name: string;
	}>;
	external_urls: {
		spotify: string;
	};
}

export interface SpotifyAlbumWithTracks extends SpotifyAlbum {
	tracks: {
		items: SpotifyTrack[];
		total: number;
	};
}