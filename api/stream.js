// Vercel serverless function for streams

// Helper function to extract IMDb ID from different formats
function extractImdbId(id) {
    console.log('Extracting IMDb ID from:', id);
    if (id.startsWith('tt')) {
        return id;
    }
    // Remove any non-numeric characters and add 'tt' prefix
    const numericId = id.replace(/\D/g, '');
    if (numericId.length > 0) {
        return 'tt' + numericId;
    }
    return id;
}

// Helper function to validate IMDb ID
function isValidImdbId(id) {
    const isValid = /^tt\d{7,}$/.test(id); // IMDb IDs are tt + at least 7 digits
    console.log('Validating IMDb ID:', id, 'Valid:', isValid);
    return isValid;
}

// Handle movie streaming
function handleMovieStream(id) {
    console.log('Handling movie stream for ID:', id);
    const imdbId = extractImdbId(id);
    
    if (!isValidImdbId(imdbId)) {
        console.log('Invalid IMDb ID:', imdbId);
        return { streams: [] };
    }
    
    // Create multiple stream options with different quality labels
    const streams = [
        {
            url: `https://vidfast.pro/movie/${imdbId}?autoPlay=true`,
            title: "🎬 VidFast HD",
            name: "VidFast",
            description: "HD Stream via VidFast.pro",
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-group"
            }
        },
        {
            url: `https://vidfast.pro/embed/movie/${imdbId}`,
            title: "🎬 VidFast Embed",
            name: "VidFast Embed",
            description: "Embedded stream via VidFast.pro",
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-group"
            }
        }
    ];
    
    console.log('Generated movie streams:', streams.length);
    return { streams };
}

// Handle series streaming
function handleSeriesStream(id) {
    console.log('Handling series stream for ID:', id);
    
    // Parse series ID format: tt1234567:1:1 (id:season:episode)
    const idParts = id.split(':');
    const seriesId = idParts[0];
    const season = idParts[1];
    const episode = idParts[2];
    
    if (!season || !episode || isNaN(season) || isNaN(episode)) {
        console.log('Invalid season/episode format for:', id);
        return { streams: [] };
    }
    
    const imdbId = extractImdbId(seriesId);
    
    if (!isValidImdbId(imdbId)) {
        console.log('Invalid IMDb ID for series:', imdbId);
        return { streams: [] };
    }
    
    // Format season and episode with leading zeros if needed
    const formattedSeason = season.padStart(2, '0');
    const formattedEpisode = episode.padStart(2, '0');
    
    const streams = [
        {
            url: `https://vidfast.pro/tv/${imdbId}/${season}/${episode}?autoPlay=true`,
            title: `📺 VidFast S${formattedSeason}E${formattedEpisode}`,
            name: "VidFast",
            description: `Season ${season} Episode ${episode} via VidFast.pro`,
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-series-" + imdbId
            }
        },
        {
            url: `https://vidfast.pro/embed/tv/${imdbId}/${season}/${episode}`,
            title: `📺 VidFast Embed S${formattedSeason}E${formattedEpisode}`,
            name: "VidFast Embed",
            description: `Embedded S${season}E${episode} via VidFast.pro`,
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-series-" + imdbId
            }
        }
    ];
    
    console.log('Generated series streams:', streams.length);
    return { streams };
}

module.exports = (req, res) => {
    console.log('Stream request received:', {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent']
    });
    
    // Set proper CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        // Parse the URL to get parameters
        const url = new URL(req.url, `https://${req.headers.host}`);
        console.log('Parsed URL:', url.pathname);
        
        let type, id;
        
        // Parse from URL path: /stream/movie/tt1234567 or /stream/series/tt1234567:1:1
        const pathParts = url.pathname.split('/').filter(part => part.length > 0);
        console.log('Path parts:', pathParts);
        
        if (pathParts.length >= 3) {
            if (pathParts[0] === 'stream') {
                type = pathParts[1]; // movie or series
                id = pathParts[2];   // IMDb ID with optional season:episode
            } else if (pathParts.length >= 2) {
                // Alternative format: /movie/tt1234567 or /series/tt1234567:1:1
                type = pathParts[0];
                id = pathParts[1];
            }
        }
        
        // Also check query parameters as fallback
        if (!type || !id) {
            type = url.searchParams.get('type');
            id = url.searchParams.get('id');
        }
        
        if (!type || !id) {
            console.log('Missing type or id in request:', { type, id, path: url.pathname });
            return res.status(400).json({ 
                streams: [],
                error: 'Invalid stream request format. Expected /stream/{type}/{id}',
                received: { type, id, path: url.pathname, query: Object.fromEntries(url.searchParams) }
            });
        }
        
        console.log('Processing stream request:', { type, id });
        
        let result;
        
        if (type === 'movie') {
            result = handleMovieStream(id);
        } else if (type === 'series') {
            result = handleSeriesStream(id);
        } else {
            console.log('Unsupported content type:', type);
            result = { streams: [] };
        }
        
        console.log('Returning streams:', result.streams.length);
        res.status(200).json(result);
        
    } catch (error) {
        console.error('Error in stream handler:', error);
        res.status(500).json({ 
            streams: [],
            error: error.message 
        });
    }
};
