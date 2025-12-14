<script lang="ts">
	import SpotifyLoginButton from '$lib/components/SpotifyLoginButton.svelte';
	import CalendarPanel from '$lib/components/CalendarPanel.svelte';
	import type { Album } from '$lib/types/album';
	import { page } from '$app/stores';

	$: user = $page.data.user;
	$: albumMap = $page.data.albumMap || {};
</script>

<svelte:head>
	<title>Album a Day - Track One Album Daily</title>
	<meta name="description" content="Track your album listens and build your calendar" />
</svelte:head>

<div
	class="min-h-screen bg-linear-to-br from-gray-900 via-emerald-900/10 to-gray-900 text-white overflow-hidden"
>
	<!-- Header -->
	<nav class="px-6 py-6 md:py-8 flex justify-between items-center z-10 relative">
		<h1
			class="text-md md:text-2xl lg:text-3xl font-black bg-linear-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg"
		>
			Album a Day
		</h1>
		<div class="flex items-center space-x-3 md:space-x-4">
			{#if user}
				<a
					href="/dashboard"
					class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 md:px-8 md:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base whitespace-nowrap"
				>
					Go to Dashboard
				</a>
			{:else}
				<div class="flex items-center">
					<SpotifyLoginButton />
				</div>
			{/if}
		</div>
	</nav>

	<!-- Hero Section -->
	<main
		class="flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-12 md:py-20 text-center relative z-10"
	>
		<div class="max-w-4xl mx-auto">
			<p
				class="text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 text-gray-100 font-medium leading-relaxed max-w-3xl mx-auto"
			>
				The tracker for album aficionados.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
				{#if user}
					<a
						href="/dashboard"
						class="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 md:px-8 md:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base whitespace-nowrap"
					>
						Go to Dashboard
					</a>
				{:else}
					<SpotifyLoginButton />
				{/if}
			</div>
			{#if !user}
				<p class="text-sm md:text-base text-gray-500 mt-4">Alternate logins coming soon</p>
			{/if}
		</div>
	</main>

	<!-- Preview Calendar Section -->
	<section
		class="w-full py-20 md:py-32 px-6 md:px-12 bg-white/5 backdrop-blur-md border-t border-white/10"
	>
		<div class="max-w-6xl mx-auto">
			<div
				class="max-w-5xl mx-auto bg-white/20 backdrop-blur-xl p-8 md:p-12 lg:p-16 rounded-3xl shadow-2xl border border-white/30"
			>
				<CalendarPanel {albumMap} currentMonth={11} currentYear={2025} isNewEntryFocused={false} />
			</div>
		</div>
	</section>
</div>
