import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	image: text('image'),
	username: text('username'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable('account', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

export const verification = sqliteTable('verification', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Calendar entries table - links users to albums on specific dates
export const calendarEntry = sqliteTable('calendar_entry', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	albumId: text('album_id').notNull().references(() => album.id, { onDelete: 'cascade' }),
	listenDate: integer('listen_date', { mode: 'timestamp' }).notNull(),
	rating: integer('rating').notNull(), // -100 to 100 scale (representing -10 to 10)
	notes: text('notes'),
	favoriteTrackId: text('favorite_track_id').references(() => track.id, { onDelete: 'set null' }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Albums table - stores album information including Spotify data
export const album = sqliteTable('album', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	artist: text('artist').notNull(),
	artwork: text('artwork'),
	releaseDate: text('release_date'), // ISO date string
	genres: text('genres'), // JSON string array
	spotifyId: text('spotify_id').unique(),
	spotifyUrl: text('spotify_url'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Tracks table - stores track information for albums
export const track = sqliteTable('track', {
	id: text('id').primaryKey(),
	albumId: text('album_id').notNull().references(() => album.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	trackNumber: integer('track_number').notNull(),
	durationMs: integer('duration_ms').notNull(),
	explicit: integer('explicit', { mode: 'boolean' }).notNull().default(false),
	previewUrl: text('preview_url'),
	spotifyUrl: text('spotify_url'),
	artists: text('artists'), // JSON string array of artist names
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});
