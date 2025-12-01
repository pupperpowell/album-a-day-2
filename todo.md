# about this project

Album A Day is a web app in Svelte 5 that allows users to track and rate entire albums they listen to. The signature feature of the app is a calendar that shows album artworks of each album the user has listened to.

The search functionality uses the Spotify Web API primarily. All app/user data is stored in Sqlite. Once a user creates an album entry, the album name, artist, album artwork, etc. are saved in Sqlite. All album searches first search the Sqlite database to see if there are any results before querying Spotify.

A left side UI panel shows an interface for searching for albums and creating new entries. A right side UI panel shows information on entries that can be opened by clicking on album artwork on the user's calendar.

link to search documentation spotify
https://developer.spotify.com/documentation/web-api/reference/search

link to app page
https://developer.spotify.com/dashboard/a8c95f7ab27443cdad962dd8547bf8a4

# in progress / up next

- search for albums using spotify web api

# todo

- store results in redis
- search for albums using sqlite first, then also spotify web api
- allow for multiple album artworks per album in case users need to change it

- "new entry" panel

# completed

- "calendar" panel, including "album-day" component
- "entry details" panel
