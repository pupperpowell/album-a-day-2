# Album a day

This is a music tracking website for listening to albums. You can listen to one album a day and rate it. The stack is SvelteKit, TypeScript, Tailwind CSS, Drizzle, and SQLite. The music source is the Spotify API.

This is the second attempt of the project. The first attempt was using NextJS and the MusicBrainz API with Redis as a database.

# about this project

Album A Day is a Svelte 5 web app that allows users to track and rate entire albums they listen to. The signature feature of the app is a calendar that shows album artworks of each album the user has listened to.

The search functionality uses the Spotify Web API primarily. All app/user data is stored in Sqlite. Once a user creates an album entry, the album name, artist, album artwork, etc. are saved in Sqlite. All album searches first search the Sqlite database to see if there are any results before querying Spotify.

A left side UI panel shows an interface for searching for albums and creating new entries. A right side UI panel shows information on entries that can be opened by clicking on album artwork on the user's calendar.

link to search documentation spotify
https://developer.spotify.com/documentation/web-api/reference/search

link to app page
https://developer.spotify.com/dashboard/a8c95f7ab27443cdad962dd8547bf8a4

## Building

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
