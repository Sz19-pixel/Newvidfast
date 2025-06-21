const { addonBuilder } = require("stremio-addon-sdk");

// Create a manifest for the add-on
const manifest = {
    "id": "community.vidfast.streams",
    "version": "1.0.0",
    "name": "VidFast Streams",
    "description": "Stream movies and TV shows using VidFast.pro - HTTP streaming service",
    "logo": "https://via.placeholder.com/256x256/FF6B35/FFFFFF?text=VF",
    "resources": ["stream"],
    "types": ["movie", "series"],
    "idPrefixes": ["tt", "tmdb:"],
    "catalogs": [],
    "behaviorHints": {
        "configurable": false,
        "configurationRequired": false
    }
};

const builder = new addonBuilder(manifest);

// Helper function to extract IMDb ID from different formats
function extractImdbId(id) {
    if (id.startsWith('tt')) {
        return id;
    }
    if (id.startsWith('tmdb:')) {
        // For TMDB IDs, we'll need to convert them to IMDb IDs
        // This is a simplified approach - in production you'd want to use TMDB API
        return id.replace('tmdb:', '');
    }
    return id;
}

// Helper function to validate IMDb ID
function isValidImdbId(id) {
    // More relaxed validation: accepts tt1234567 or 1234567
    return /^(tt\d{7,}|\d{7,})$/.test(id);
}

// Stream handler for movies and series
builder.defineStreamHandler(async (args) => {
    const { type, id } = args;
    console.log('Stream request:', { type, id });

    try {
        if (type === 'movie') {
            return await handleMovieStream(id);
        } else if (type === 'series') {
            return await handleSeriesStream(id);
        } else {
            console.error('Unsupported content type:', type);
            return { streams: [] };
        }
    } catch (error) {
        console.error('Stream handler error:', error);
        return { streams: [] };
    }
});

// Handle movie streaming
async function handleMovieStream(id) {
    const imdbId = extractImdbId(id);

    if (!isValidImdbId(imdbId)) {
        console.log('Invalid IMDb ID:', imdbId);
        return { streams: [] };
    }

    const streams = [
        {
            url: `https://vidfast.pro/embed/movie/${imdbId}`,
            title: "🎬 VidFast Stream",
            name: "VidFast",
            description: "Stream via VidFast.pro",
            behaviorHints: { notWebReady: false }
        }
    ];

    return { streams };
}

// Handle series streaming
async function handleSeriesStream(id) {
    // Parse series ID format: tt1234567:1:1 (id:season:episode)
    const [seriesId, season, episode] = id.split(':');
    const imdbId = extractImdbId(seriesId);

    if (!season || !episode) {
        console.log('Missing season or episode information for:', id);
        return { streams: [] };
    }

    if (!isValidImdbId(imdbId)) {
        console.log('Invalid IMDb ID for series:', imdbId);
        return { streams: [] };
    }

    const streams = [
        {
            url: `https://vidfast.pro/embed/tv/${imdbId}/${season}/${episode}`,
            title: `📺 VidFast Stream - S${season}E${episode}`,
            name: "VidFast",
            description: `Stream S${season}E${episode} via VidFast.pro`,
            behaviorHints: { notWebReady: false }
        }
    ];

    return { streams };
}

module.exports = builder.getInterface();
