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
}