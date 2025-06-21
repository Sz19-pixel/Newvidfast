#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk");
const addonInterface = require("./addon");

const port = process.env.PORT || 7000;

// Serve the addon via HTTP
serveHTTP(addonInterface, { 
    port: port,
    static: "/public"
}).then(() => {
    console.log(`🚀 VidFast Stremio Add-on is running on port ${port}`);
    console.log(`📋 Manifest URL: http://localhost:${port}/manifest.json`);
    console.log(`🔗 Add this URL to Stremio to install the add-on`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
}).catch((err) => {
    console.error("❌ Error starting server:", err);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    process.exit(0);
});

// Optionally publish to Stremio's central index
// Uncomment the following lines if you want to publish
/*
publishToCentral("https://your-addon-domain.com/manifest.json")
.then(function(res) {
    console.log("📢 Published to central index:", res);
}).catch(function(err) {
    console.log("❌ Failed to publish:", err);
});
*/
