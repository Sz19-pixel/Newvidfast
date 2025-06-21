// Vercel serverless function for manifest
const manifest = {
    "id": "community.vidfast.streams",
    "version": "1.0.4",
    "name": "VidFast Streams",
    "description": "Stream movies and TV shows using VidFast.pro",
    "logo": "https://via.placeholder.com/256x256/FF6B35/FFFFFF?text=VF",
    "resources": ["stream"],
    "types": ["movie", "series"],
    "idPrefixes": ["tt"],
    "catalogs": [],
    "behaviorHints": {
        "configurable": false,
        "configurationRequired": false
    }
};

module.exports = (req, res) => {
    console.log('Manifest request:', {
        method: req.method,
        url: req.url,
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
    
    // Only allow GET requests for manifest
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    console.log('Returning manifest successfully');
    res.status(200).json(manifest);
};
