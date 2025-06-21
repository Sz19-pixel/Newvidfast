// Vercel serverless function for streams

module.exports = (req, res) => {
    console.log('Stream request received:', {
        method: req.method,
        url: req.url,
        query: req.query,
        userAgent: req.headers['user-agent']
    });
    
    // Set proper CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
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
        let type, id;
        
        // Get parameters from Vercel query object
        if (req.query && req.query.type && req.query.id) {
            type = req.query.type;
            id = req.query.id;
        } else {
            // Fallback: parse from URL
            const urlParts = req.url.split('/').filter(Boolean);
            console.log('URL parts:', urlParts);
            
            if (urlParts.length >= 3 && urlParts[0] === 'stream') {
                type = urlParts[1];
                id = urlParts[2];
            }
        }
        
        console.log('Parsed parameters:', { type, id });
        
        if (!type || !id) {
            console.log('Missing parameters');
            return res.status(400).json({ 
                streams: [],
                error: 'Missing type or id parameter'
            });
        }
        
        // Validate and extract IMDb ID
        const imdbId = extractImdbId(id);
        console.log('Extracted IMDb ID:', imdbId);
        
        if (!isValidImdbId(imdbId)) {
            console.log('Invalid IMDb ID');
            return res.status(400).json({ 
                streams: [],
                error: 'Invalid IMDb ID format'
            });
        }
        
        let streams = [];
        
        if (type === 'movie') {
            streams = createMovieStreams(imdbId);
        } else if (type === 'series') {
            const [seriesId, season, episode] = id.split(':');
            if (!season || !episode) {
                return res.status(400).json({ 
                    streams: [],
                    error: 'Series format should be: ttXXXXXXX:season:episode'
                });
            }
            streams = createSeriesStreams(extractImdbId(seriesId), season, episode);
        } else {
            return res.status(400).json({ 
                streams: [],
                error: 'Unsupported content type'
            });
        }
        
        console.log('Generated streams:', streams.length);
        res.status(200).json({ streams });
        
    } catch (error) {
        console.error('Error in stream handler:', error);
        res.status(500).json({ 
            streams: [],
            error: 'Internal server error'
        });
    }
};

// Helper functions
function extractImdbId(id) {
    if (id.startsWith('tt')) {
        return id;
    }
    // Handle numeric IDs
    const numericId = id.replace(/\D/g, '');
    if (numericId.length >= 7) {
        return 'tt' + numericId;
    }
    return id;
}

function isValidImdbId(id) {
    return /^tt\d{7,}$/.test(id);
}

function createMovieStreams(imdbId) {
    return [
        {
            name: "VidFast",
            title: "🎬 VidFast Stream",
            url: `https://vidfast.pro/embed/movie/${imdbId}`,
            behaviorHints: {
                notWebReady: false
            }
        },
        {
            name: "VidFast Player",
            title: "🎬 VidFast Player",
            url: `https://vidfast.pro/movie/${imdbId}`,
            behaviorHints: {
                notWebReady: false
            }
        }
    ];
}

function createSeriesStreams(imdbId, season, episode) {
    const s = season.padStart(2, '0');
    const e = episode.padStart(2, '0');
    
    return [
        {
            name: "VidFast",
            title: `📺 VidFast S${s}E${e}`,
            url: `https://vidfast.pro/embed/tv/${imdbId}/${season}/${episode}`,
            behaviorHints: {
                notWebReady: false
            }
        },
        {
            name: "VidFast Player",
            title: `📺 VidFast Player S${s}E${e}`,
            url: `https://vidfast.pro/tv/${imdbId}/${season}/${episode}`,
            behaviorHints: {
                notWebReady: false
            }
        }
    ];
}
