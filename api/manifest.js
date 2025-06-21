// Vercel serverless function for manifest
const manifest = {
    "id": "community.vidfast.streams",
    "version": "1.0.3",
    "name": "VidFast Streams",
    "description": "Stream movies and TV shows using VidFast.pro - HTTP streaming service",
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
    console.log('Manifest request received from:', req.headers['user-agent']);
    
    // Set proper CORS headers for Stremio app
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
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
    
    console.log('Returning manifest:', manifest);
    res.status(200).json(manifest);
};
