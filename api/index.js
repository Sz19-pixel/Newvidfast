// Vercel serverless function for the main page
module.exports = (req, res) => {
    const host = req.headers.host || 'localhost:3000';
    const manifestUrl = `https://${host}/manifest.json`;
    
    res.setHeader('Content-Type', 'text/html');
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
                    max-width: 600px;
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
                    font-size: 16px;
                    color: #333;
                }
                .instructions {
                    text-align: right;
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .instructions h3 {
                    color: #1976d2;
                    margin-top: 0;
                }
                .step {
                    margin: 10px 0;
                    padding: 5px 0;
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
                    background: linear-gradient(45deg, #F7931E, #FF6B35);
                }
                .install-btn:active {
                    transform: translateY(0);
                }
                .install-note {
                    color: #666;
                    font-size: 14px;
                    margin-top: 10px;
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
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    text-align: left;
                    max-height: 200px;
                    overflow-y: auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">VF</div>
                <h1>🎬 VidFast Stremio Add-on</h1>
                <p class="subtitle">إضافة Stremio للبث المباشر من VidFast.pro</p>
                
                <div class="status">✅ الإضافة تعمل بنجاح!</div>
                
                <div class="test-section">
                    <h3>🔧 اختبار الإضافة:</h3>
                    <button class="test-btn" onclick="testManifest()">اختبار Manifest</button>
                    <button class="test-btn" onclick="testMovieStream()">اختبار Movie Stream</button>
                    <button class="test-btn" onclick="testSeriesStream()">اختبار Series Stream</button>
                    <div id="testResult" class="test-result" style="display: none;"></div>
                </div>
                
                <div class="install-section">
                    <button class="install-btn" onclick="installAddon()">
                        📱 Install في Stremio
                    </button>
                    <button class="install-btn" onclick="copyManifestUrl()" style="background: #28a745;">
                        📋 Copy Manifest URL
                    </button>
                    <p class="install-note">اضغط على Install لفتح الإضافة مباشرة في Stremio، أو Copy URL للتثبيت اليدوي</p>
                </div>
                
                <div class="manifest-url">
                    <strong>رابط Manifest:</strong><br>
                    ${manifestUrl}
                </div>
                
                <div class="instructions">
                    <h3>📋 طريقة التثبيت البديلة (يدوياً):</h3>
                    <div class="step">1. افتح تطبيق Stremio</div>
                    <div class="step">2. اذهب إلى Add-ons → Community Add-ons</div>
                    <div class="step">3. انسخ الرابط أعلاه والصقه في خانة "Addon Repository Url"</div>
                    <div class="step">4. اضغط على Install</div>
                </div>
                
                <p style="color: #666; margin-top: 30px;">
                    بعد التثبيت ستجد مصادر VidFast متاحة عند البحث عن الأفلام والمسلسلات
                </p>
            </div>
            
            <script>
                const manifestUrl = '${manifestUrl}';
                
                async function testManifest() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار Manifest...';
                    
                    try {
                        const response = await fetch(manifestUrl);
                        const data = await response.json();
                        resultDiv.innerHTML = 'نتيجة اختبار Manifest:\\n' + JSON.stringify(data, null, 2);
                    } catch (error) {
                        resultDiv.innerHTML = 'خطأ في اختبار Manifest:\\n' + error.message;
                    }
                }
                
                async function testMovieStream() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار Movie Stream...';
                    
                    try {
                        const response = await fetch('/stream/movie/tt0468569');
                        const data = await response.json();
                        resultDiv.innerHTML = 'نتيجة اختبار Movie Stream:\\n' + JSON.stringify(data, null, 2);
                    } catch (error) {
                        resultDiv.innerHTML = 'خطأ في اختبار Movie Stream:\\n' + error.message;
                    }
                }
                
                async function testSeriesStream() {
                    const resultDiv = document.getElementById('testResult');
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = 'جاري اختبار Series Stream...';
                    
                    try {
                        const response = await fetch('/stream/series/tt0903747:1:1');
                        const data = await response.json();
                        resultDiv.innerHTML = 'نتيجة اختبار Series Stream:\\n' + JSON.stringify(data, null, 2);
                    } catch (error) {
                        resultDiv.innerHTML = 'خطأ في اختبار Series Stream:\\n' + error.message;
                    }
                }
                
                async function copyManifestUrl() {
                    try {
                        await navigator.clipboard.writeText(manifestUrl);
                        alert('تم نسخ رابط Manifest بنجاح!\\n\\nالآن اذهب إلى Stremio وألصق الرابط في Community Add-ons');
                    } catch (error) {
                        // Fallback for older browsers
                        prompt('انسخ هذا الرابط:', manifestUrl);
                    }
                }
                
                function installAddon() {
                    // Try multiple methods to open Stremio
                    const stremioUrl = 'stremio://' + encodeURIComponent(manifestUrl);
                    
                    // Method 1: Try direct deep link
                    window.location.href = stremioUrl;
                    
                    // Method 2: Try with stremio-addons scheme
                    setTimeout(() => {
                        window.location.href = 'stremio-addons://' + encodeURIComponent(manifestUrl);
                    }, 1000);
                    
                    // Method 3: Fallback to manual instructions
                    setTimeout(() => {
                        if (confirm('لم يتم فتح تطبيق Stremio تلقائياً؟\\n\\nاضغط OK لنسخ الرابط والذهاب لتطبيق Stremio يدوياً')) {
                            copyManifestUrl();
                        }
                    }, 3000);
                }
                
                // Add some interactive effects
                document.addEventListener('DOMContentLoaded', function() {
                    const installBtns = document.querySelectorAll('.install-btn');
                    
                    installBtns.forEach(btn => {
                        // Add click effect
                        btn.addEventListener('click', function(e) {
                            // Create ripple effect
                            const ripple = document.createElement('span');
                            const rect = this.getBoundingClientRect();
                            const size = Math.max(rect.width, rect.height);
                            const x = e.clientX - rect.left - size / 2;
                            const y = e.clientY - rect.top - size / 2;
                            
                            ripple.style.cssText = \`
                                position: absolute;
                                border-radius: 50%;
                                background: rgba(255,255,255,0.6);
                                transform: scale(0);
                                animation: ripple 0.6s linear;
                                left: \${x}px;
                                top: \${y}px;
                                width: \${size}px;
                                height: \${size}px;
                            \`;
                            
                            this.style.position = 'relative';
                            this.style.overflow = 'hidden';
                            this.appendChild(ripple);
                            
                            setTimeout(() => {
                                ripple.remove();
                            }, 600);
                        });
                    });
                });
            </script>
            
            <style>
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            </style>
        </body>
        </html>
    `);
};
