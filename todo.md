# about this project

Album A Day is a Svelte 5 web app that allows users to track and rate entire albums they listen to. The signature feature of the app is a calendar that shows album artworks of each album the user has listened to.

The search functionality uses the Spotify Web API primarily. All app/user data is stored in Sqlite. Once a user creates an album entry, the album name, artist, album artwork, etc. are saved in Sqlite. All album searches first search the Sqlite database to see if there are any results before querying Spotify.

A left side UI panel shows an interface for searching for albums and creating new entries. A right side UI panel shows information on entries that can be opened by clicking on album artwork on the user's calendar.

link to search documentation spotify
https://developer.spotify.com/documentation/web-api/reference/search

link to app page
https://developer.spotify.com/dashboard/a8c95f7ab27443cdad962dd8547bf8a4

# in progress / up next

# todo

- profile page shows album streak
- logout button
- mobile layout
- configure search for albums using sqlite first, then also spotify web api

# completed

- select a date for the album entry
- submitting a new entry shows the album artwork on the selected day
- full "new entry" panel that saves entries in database
- favorite track selection
- users in database
- log in with spotify
- "calendar" panel, including "album-day" component
- "entry details" panel
- search for albums using spotify web api
- remove the weird expanding/shrinking on newentrypanel
