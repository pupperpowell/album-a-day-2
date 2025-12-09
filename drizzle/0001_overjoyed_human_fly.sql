ALTER TABLE `user` RENAME COLUMN "emailVerified" TO "email_verified";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `user` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `verification` RENAME COLUMN "expiresAt" TO "expires_at";--> statement-breakpoint
ALTER TABLE `verification` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `verification` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
CREATE TABLE `album` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`artist` text NOT NULL,
	`artwork` text,
	`release_date` text,
	`genres` text,
	`spotify_id` text,
	`spotify_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `album_spotify_id_unique` ON `album` (`spotify_id`);--> statement-breakpoint
CREATE TABLE `calendar_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`album_id` text NOT NULL,
	`listen_date` integer NOT NULL,
	`rating` integer NOT NULL,
	`notes` text,
	`favorite_track_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`album_id`) REFERENCES `album`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`favorite_track_id`) REFERENCES `track`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `track` (
	`id` text PRIMARY KEY NOT NULL,
	`album_id` text NOT NULL,
	`name` text NOT NULL,
	`track_number` integer NOT NULL,
	`duration_ms` integer NOT NULL,
	`explicit` integer DEFAULT false NOT NULL,
	`preview_url` text,
	`spotify_url` text,
	`artists` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`album_id`) REFERENCES `album`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_account`("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at") SELECT "id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "refresh_token_expires_at", "scope", "password", "created_at", "updated_at" FROM `account`;--> statement-breakpoint
DROP TABLE `account`;--> statement-breakpoint
ALTER TABLE `__new_account` RENAME TO `account`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id") SELECT "id", "expires_at", "token", "created_at", "updated_at", "ip_address", "user_agent", "user_id" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
ALTER TABLE `user` ADD `username` text;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `age`;