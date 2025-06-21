// Simple test script for the VidFast Stremio Add-on
const addonInterface = require("./addon");

async function testAddon() {
    console.log("🧪 Testing VidFast Stremio Add-on...\n");
    
    // Test manifest
    console.log("1️⃣ Testing manifest:");
    console.log(JSON.stringify(addonInterface.manifest, null, 2));
    
    // Test movie stream
    console.log("\n2️⃣ Testing movie stream (The Dark Knight - tt0468569):");
    try {
        const movieResult = await addonInterface.get({
            resource: 'stream',
            type: 'movie',
            id: 'tt0468569'
        });
        console.log("✅ Movie streams:", JSON.stringify(movieResult, null, 2));
    } catch (error) {
        console.error("❌ Movie test error:", error.message);
    }
    
    // Test series stream
    console.log("\n3️⃣ Testing series stream (Breaking Bad S01E01 - tt0903747:1:1):");
    try {
        const seriesResult = await addonInterface.get({
            resource: 'stream',
            type: 'series',
            id: 'tt0903747:1:1'
        });
        console.log("✅ Series streams:", JSON.stringify(seriesResult, null, 2));
    } catch (error) {
        console.error("❌ Series test error:", error.message);
    }
    
    // Test TMDB ID
    console.log("\n4️⃣ Testing TMDB ID (tmdb:550):");
    try {
        const tmdbResult = await addonInterface.get({
            resource: 'stream',
            type: 'movie',
            id: 'tmdb:550'
        });
        console.log("✅ TMDB ID result:", JSON.stringify(tmdbResult, null, 2));
    } catch (error) {
        console.error("❌ TMDB ID test error:", error.message);
    }
    
    // Test invalid ID
    console.log("\n5️⃣ Testing invalid ID:");
    try {
        const invalidResult = await addonInterface.get({
            resource: 'stream',
            type: 'movie',
            id: 'invalid_id'
        });
        console.log("✅ Invalid ID result:", JSON.stringify(invalidResult, null, 2));
    } catch (error) {
        console.error("❌ Invalid ID test error:", error.message);
    }
    
    console.log("\n🎉 Test completed!");
}

// Run tests if this file is executed directly
if (require.main === module) {
    testAddon().catch(console.error);
}

module.exports = { testAddon };
