import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './db/schema.js';
import { eq } from 'drizzle-orm';
import type { User } from 'better-auth/types';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	BETTER_AUTH_SECRET
} from '$env/static/private';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification
		}
	}),
	socialProviders: {
		spotify: {
			clientId: SPOTIFY_CLIENT_ID,
			clientSecret: SPOTIFY_CLIENT_SECRET,
			redirectURI: 'http://127.0.0.1:5173/api/auth/callback/spotify'
		}
	},
	// callbacks: {
	// 	user: async ({ user, account }: { user: User; account: any }) => {
	// 		// Don't set username automatically - let user choose it during signup
	// 		console.log('User callback executed for provider:', account.providerId);
	// 		return user;
	// 	}
	// },
	secret: BETTER_AUTH_SECRET,
	baseURL: 'http://127.0.0.1:5173'
});