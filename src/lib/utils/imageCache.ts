// Image caching utility for album artwork
interface CachedImage {
	url: string;
	blob: Blob;
	timestamp: number;
}

class ImageCache {
	private cache = new Map<string, CachedImage>();
	private maxAge = 24 * 60 * 60 * 1000; // 24 hours
	private maxItems = 100; // Maximum number of cached images

	// Get cached image or fetch and cache it
	async getImage(url: string): Promise<string | null> {
		// Check if image is cached and not expired
		const cached = this.cache.get(url);
		if (cached && Date.now() - cached.timestamp < this.maxAge) {
			return URL.createObjectURL(cached.blob);
		}

		try {
			// Fetch the image
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch image: ${response.statusText}`);
			}

			const blob = await response.blob();

			// Cache the image
			this.cache.set(url, {
				url,
				blob,
				timestamp: Date.now()
			});

			// Clean up old cache entries if we exceed max items
			this.cleanup();

			return URL.createObjectURL(blob);
		} catch (error) {
			console.error('Error caching image:', error);
			return null;
		}
	}

	// Clean up old cache entries
	private cleanup() {
		if (this.cache.size <= this.maxItems) return;

		// Sort by timestamp (oldest first) and remove excess items
		const entries = Array.from(this.cache.entries())
			.sort(([, a], [, b]) => a.timestamp - b.timestamp);

		const toRemove = entries.slice(0, this.cache.size - this.maxItems);
		toRemove.forEach(([key]) => {
			const cached = this.cache.get(key);
			if (cached) {
				URL.revokeObjectURL(cached.url);
			}
			this.cache.delete(key);
		});
	}

	// Preload multiple images
	async preloadImages(urls: string[]): Promise<void> {
		const promises = urls.map(url => this.getImage(url));
		await Promise.allSettled(promises);
	}

	// Clear cache
	clearCache(): void {
		this.cache.forEach(cached => {
			URL.revokeObjectURL(cached.url);
		});
		this.cache.clear();
	}

	// Get cache stats
	getStats() {
		return {
			size: this.cache.size,
			maxItems: this.maxItems,
			maxAge: this.maxAge
		};
	}
}

// Export singleton instance
export const imageCache = new ImageCache();

// Utility function to get optimal artwork URL
export function getOptimalArtworkUrl(artwork: string | null | undefined, size: number = 100): string | null {
	if (!artwork) return null;

	// If it's already a Spotify URL, we can modify it for optimal size
	if (artwork.includes('spotifycdn.com') || artwork.includes('scdn.co')) {
		// Spotify images can be sized by changing the URL
		// Extract the base URL and add size parameter
		const baseUrl = artwork.split('?')[0];
		return `${baseUrl}?w=${size}&h=${size}`;
	}

	return artwork;
}