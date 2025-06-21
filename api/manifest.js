// Vercel serverless function for manifest
const manifest = {
    "id": "community.vidfast.streams",
    "version": "1.0.2",
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

module.exports = (req, res) => {
    console.log('Manifest request received');
    
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
    
    console.log('Returning manifest:', manifest);
    res.status(200).json(manifest);
};
