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