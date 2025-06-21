// Vercel serverless function for the main page
module.exports = (req, res) => {
    const host = req.headers.host || 'localhost:3000';
    const manifestUrl = `https://${host}/manifest.json`;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VidFast Stremio Add-on</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 700px;
                    width: 100%;
                }
                .logo {
                    width: 100px;
                    height: 100px;
                    background: #FF6B35;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    font-size: 36px;
                    color: white;
                    font-weight: bold;
                }
                h1 {
                    color: #333;
                    margin-bottom: 10px;
                    font-size: 2.5em;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                    font-size: 1.2em;
                }
                .manifest-url {
                    background: #f8f9fa;
                    border: 2px dashed #FF6B35;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 30px 0;
                    font-family: 'Courier New', monospace;
                    word-break: break-all;
                    font-size: 14px;
                    color: #333;
                }
                .status {
                    background: #4caf50;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    display: inline-block;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .status.error {
                    background: #f44336;
                }
                .install-section {
                    margin: 30px 0;
                }
                .install-btn {
                    background: linear-gradient(45deg, #FF6B35, #F7931E);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-block;
                    margin: 10px;
                }
                .install-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
                }
                .test-section {
                    background: #f0f8ff;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .test-btn {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    margin: 5px;
                    font-size: 14px;
                }
                .test-btn:hover {
                    background: #0056b3;
                }
                .test-result {
                    margin-top: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    text-align: left;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                }
                .instructions {
                    text-align: right;
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .step {
                    margin: 10px 0;
                    padding: 5px 0;
                }
                .troubleshoot {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 20px 0;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">VF</div>
                <h1>🎬 VidFast Stremio Add-on</h1>
                <p class="subtitle">إضافة Stremio للبث المباشر من VidFast.pro</p>
                
                <div id="status" class="status">⏳ جاري فحص الإضافة...</div>
                
                <div class="test-section">
                    <h3>🔧 اختبار الإضافة:</h3>
                    <button class="test-btn" onclick="testManifest()">اختبار Manifest</button>
                    <button class="test-btn" onclick="testMovieStream()">اختبار فيلم</button>
                    <button class="test-btn" onclick="testSeriesStream()">اختبار مسلسل</button>
                    <button class="test-btn" onclick="runAllTests()">اختبار شامل</button>
                    <div id="testResult" class="test-result" style="display: none;"></div>
                </div>
                
                <div class="install-section">
                    <button class="install-btn" onclick="installAddon()">
                        📱 تثبيت في Stremio
                    </button>
                    <button class="install-btn" onclick="copyManifestUrl()" style="background: #28a745;">
                        📋 نسخ رابط Manifest
                    </button>
                    <p style="color: #666; font-size: 14px; margin-top: 10px;">
                        اضغط على تثبيت لفتح الإضافة مباشرة في Stremio، أو انسخ الرابط للتثبيت اليدوي
                    </p>
                </div>
                
                <div class="manifest-url">
                    <strong>رابط Manifest:</strong><br>
                    ${manifestUrl}
                </div>
                
                <div class="troubleshoot">
                    <h3>🔧 حل المشاكل الشائعة:</h3>
                    <div class="step">• إذا لم تظهر روابط المشاهدة: تأكد من صحة IMDb ID</div>
                    <div class="step">• إذا فشل التحميل في التطبيق: استخدم النسخة الويب من Stremio</div>
                    <div class="step">• للمسلسلات: تأكد من توفر الحلقة على VidFast</div>
                </div>
                
                <div class="instructions">
                    <h3>📋 طريقة التثبيت البديلة:</h3>
                    <div class="step">1. افتح تطبيق Stremio</div>
                    <div class="step">2. اذهب إلى Add-ons → Community Add-ons</div>
                    <div class="step">3. انسخ الرابط أعلاه والصقه</div>
                    <div class="step">4. اضغط Install</div>
                </div>
            </div>
            
            <script>
                const manifestUrl = '${manifestUrl}';
                const baseUrl = 'https://${host}';
                
                // Auto-test on load
                window.addEventListener('load', function() {
                    setTimeout(testManifest, 1000);
                });
                
                async function testManifest() {
                    const resultDiv = document.getElementById('testResult');
                    const statusDiv = document.getElementById('status');
                    
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار Manifest...';
                    statusDiv.textContent = '⏳ جاري فحص الإضافة...';
                    statusDiv.className = 'status';
                    
                    try {
                        const response = await fetch(manifestUrl);
                        const data = await response.json();
                        
                        if (data && data.id) {
                            resultDiv.innerHTML = '✅ نتيجة اختبار Manifest:\\n' + JSON.stringify(data, null, 2);
                            statusDiv.textContent = '✅ الإضافة تعمل بنجاح!';
                            statusDiv.className = 'status';
                        } else {
                            throw new Error('Invalid manifest structure');
                        }
                    } catch (error) {
                        resultDiv.innerHTML = '❌ خطأ في اختبار Manifest:\\n' + error.message;
                        statusDiv.textContent = '❌ خطأ في الإضافة!';
                        statusDiv.className = 'status error';
                    }
                }
                
                async function testMovieStream() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار بث الأفلام...';
                    
                    try {
                        const testUrl = baseUrl + '/stream/movie/tt0468569'; // The Dark Knight
                        const response = await fetch(testUrl);
                        const data = await response.json();
                        
                        if (data.streams && data.streams.length > 0) {
                            resultDiv.innerHTML = '✅ نتيجة اختبار بث الأفلام:\\n' + 
                                'عدد الروابط: ' + data.streams.length + '\\n' +
                                JSON.stringify(data, null, 2);
                        } else {
                            resultDiv.innerHTML = '⚠️ لم يتم العثور على روابط بث للفيلم\\n' + JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        resultDiv.innerHTML = '❌ خطأ في اختبار بث الأفلام:\\n' + error.message;
                    }
                }
                
                async function testSeriesStream() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار بث المسلسلات...';
                    
                    try {
                        const testUrl = baseUrl + '/stream/series/tt0903747:1:1'; // Breaking Bad S01E01
                        const response = await fetch(testUrl);
                        const data = await response.json();
                        
                        if (data.streams && data.streams.length > 0) {
                            resultDiv.innerHTML = '✅ نتيجة اختبار بث المسلسلات:\\n' +
                                'عدد الروابط: ' + data.streams.length + '\\n' +
                                JSON.stringify(data, null, 2);
                        } else {
                            resultDiv.innerHTML = '⚠️ لم يتم العثور على روابط بث للمسلسل\\n' + JSON.stringify(data, null, 2);
                        }
                    } catch (error) {
                        resultDiv.innerHTML = '❌ خطأ في اختبار بث المسلسلات:\\n' + error.message;
                    }
                }
                
                async function runAllTests() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري تشغيل جميع الاختبارات...\\n\\n';
                    
                    // Test manifest
                    resultDiv.innerHTML += '1️⃣ اختبار Manifest...\\n';
                    try {
                        const manifestResponse = await fetch(manifestUrl);
                        const manifestData = await manifestResponse.json();
                        resultDiv.innerHTML += '✅ Manifest يعمل بنجاح\\n\\n';
                    } catch (error) {
                        resultDiv.innerHTML += '❌ خطأ في Manifest: ' + error.message + '\\n\\n';
                        return;
                    }
                    
                    // Test movie stream
                    resultDiv.innerHTML += '2️⃣ اختبار بث الأفلام...\\n';
                    try {
                        const movieResponse = await fetch(baseUrl + '/stream/movie/tt0468569');
                        const movieData = await movieResponse.json();
                        resultDiv.innerHTML += '✅ بث الأفلام: ' + (movieData.streams?.length || 0) + ' روابط\\n\\n';
                    } catch (error) {
                        resultDiv.innerHTML += '❌ خطأ في بث الأفلام: ' + error.message + '\\n\\n';
                    }
                    
                    // Test series stream
                    resultDiv.innerHTML += '3️⃣ اختبار بث المسلسلات...\\n';
                    try {
                        const seriesResponse = await fetch(baseUrl + '/stream/series/tt0903747:1:1');
                        const seriesData = await seriesResponse.json();
                        resultDiv.innerHTML += '✅ بث المسلسلات: ' + (seriesData.streams?.length || 0) + ' روابط\\n\\n';
                    } catch (error) {
                        resultDiv.innerHTML += '❌ خطأ في بث المسلسلات: ' + error.message + '\\n\\n';
                    }
                    
                    resultDiv.innerHTML += '🎉 انتهى الاختبار الشامل!';
                }
                
                async function copyManifestUrl() {
                    try {
                        await navigator.clipboard.writeText(manifestUrl);
                        alert('تم نسخ رابط Manifest بنجاح!\\n\\nالرابط: ' + manifestUrl + '\\n\\nالآن اذهب إلى Stremio وألصق الرابط في Community Add-ons');
                    } catch (error) {
                        prompt('انسخ هذا الرابط:', manifestUrl);
                    }
                }
                
                function installAddon() {
                    // Try different installation methods
                    const encodedUrl = encodeURIComponent(manifestUrl);
                    
                    // Method 1: Direct Stremio protocol
                    window.location.href = 'stremio://' + encodedUrl;
                    
                    // Method 2: Alternative protocol
                    setTimeout(() => {
                        window.location.href = 'stremio-addons://' + encodedUrl;
                    }, 1000);
                    
                    // Method 3: Web version fallback
                    setTimeout(() => {
                        window.open('https://web.stremio.com/', '_blank');
                        copyManifestUrl();
                    }, 2000);
                    
                    // Method 4: Manual instructions
                    setTimeout(() => {
                        if (confirm('هل تم فتح تطبيق Stremio؟\\n\\nإذا لم يفتح، اضغط OK لنسخ الرابط يدوياً')) {
                            copyManifestUrl();
                        }
                    }, 4000);
                }
            </script>
        </body>
        </html>
    `);
};
