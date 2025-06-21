// Health check endpoint
module.exports = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'VidFast Stremio Add-on',
        version: '1.0.2',
        endpoints: {
            manifest: '/manifest.json',
            stream: '/stream/{type}/{id}',
            health: '/health'
        }
    };
    
    res.status(200).json(health);
};
