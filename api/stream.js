// Vercel serverless function for streams

// Helper function to extract IMDb ID from different formats
function extractImdbId(id) {
    console.log('Extracting IMDb ID from:', id);
    if (id.startsWith('tt')) {
        return id;
    }
    if (id.startsWith('tmdb:')) {
        return id.replace('tmdb:', '');
    }
    return id;
}

// Helper function to validate IMDb ID
function isValidImdbId(id) {
    const isValid = /^tt\d+$/.test(id) || /^\d+$/.test(id);
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
    
    const vidFastUrl = `https://vidfast.pro/movie/${imdbId}?autoPlay=true`;
    console.log('Generated movie URL:', vidFastUrl);
    
    const streams = [
        {
            url: vidFastUrl,
            title: "🎬 VidFast Stream",
            name: "VidFast",
            description: "Stream via VidFast.pro",
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-group"
            }
        }
    ];
    
    return { streams };
}

// Handle series streaming
function handleSeriesStream(id) {
    console.log('Handling series stream for ID:', id);
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
    
    const vidFastUrl = `https://vidfast.pro/tv/${imdbId}/${season}/${episode}?autoPlay=true`;
    console.log('Generated series URL:', vidFastUrl);
    
    const streams = [
        {
            url: vidFastUrl,
            title: `📺 VidFast Stream - S${season}E${episode}`,
            name: "VidFast",
            description: `Stream S${season}E${episode} via VidFast.pro`,
            behaviorHints: {
                notWebReady: false,
                bingeGroup: "vidfast-group"
            }
        }
    ];
    
    return { streams };
}

module.exports = (req, res) => {
    console.log('Stream request received:', req.url, req.method);
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        // Parse the URL to get parameters
        const url = new URL(req.url, `https://${req.headers.host}`);
        console.log('Parsed URL:', url.pathname, url.searchParams.toString());
        
        // Get type and id from query params or URL path
        let type = url.searchParams.get('type');
        let id = url.searchParams.get('id');
        
        // If not in query params, try to parse from path
        if (!type || !id) {
            const pathParts = url.pathname.split('/').filter(part => part.length > 0);
            console.log('Path parts:', pathParts);
            
            // Expected format: /stream/movie/tt1234567 or /stream/series/tt1234567:1:1
            if (pathParts.length >= 3 && pathParts[0] === 'stream') {
                type = pathParts[1]; // movie or series
                id = pathParts[2];   // IMDb ID with optional season:episode
            }
        }
        
        if (!type || !id) {
            console.log('Missing type or id in request');
            return res.status(400).json({ 
                error: 'Invalid stream request format',
                received: { type, id, path: url.pathname }
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
        
        console.log('Returning result:', result);
        res.status(200).json(result);
        
    } catch (error) {
        console.error('Error in stream handler:', error);
        res.status(500).json({ 
            streams: [],
            error: error.message 
        });
    }
};
