#!/bin/bash

# 🚀 MCP Maps Basic - Quick Start Script
# Bu script projeyi hızla kurmanıza yardımcı olur

echo "🗺️  MCP Maps Basic - Quick Start"
echo "================================"

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı. Lütfen Node.js kurun: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js sürümü: $(node --version)"

# npm dependencies yükle
echo "📦 Bağımlılıklar yükleniyor..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install başarısız oldu"
    exit 1
fi

echo "✅ Bağımlılıklar yüklendi"

# .env.local dosyası kontrolü
if [ ! -f ".env.local" ]; then
    echo "🔑 .env.local dosyası oluşturuluyor..."
    cat > .env.local << EOF
# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_API_KEY=your_api_key_here
EOF
    echo "✅ .env.local dosyası oluşturuldu"
    echo "⚠️  Önemli: .env.local dosyasındaki 'your_api_key_here' kısmını gerçek API key'iniz ile değiştirin"
else
    echo "✅ .env.local dosyası mevcut"
fi

# API key kontrolü
if grep -q "your_api_key_here" .env.local 2>/dev/null; then
    echo ""
    echo "🔔 API Key Kurulum Gerekli!"
    echo "=========================="
    echo "1. https://makersuite.google.com/app/apikey adresine gidin"
    echo "2. Google Gemini API key oluşturun"
    echo "3. .env.local dosyasındaki 'your_api_key_here' kısmını API key'iniz ile değiştirin"
    echo ""
    read -p "API key'i şimdi girmek ister misiniz? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "API Key'inizi girin: " api_key
        if [ ! -z "$api_key" ]; then
            # API key'i .env.local dosyasında değiştir (hem GEMINI_API_KEY hem VITE_GEMINI_API_KEY)
            sed -i.bak "s/your_api_key_here/$api_key/g" .env.local
            echo "✅ API key kaydedildi (hem GEMINI_API_KEY hem VITE_GEMINI_API_KEY)"
        fi
    fi
fi

# Build test
echo ""
echo "🔨 Build testi yapılıyor..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build başarısız oldu. Lütfen hataları kontrol edin."
    exit 1
fi

echo "✅ Build başarılı"

echo ""
echo "🎉 Kurulum tamamlandı!"
echo "====================="
echo ""
echo "Projeyi başlatmak için:"
echo "  npm run dev"
echo ""
echo "Tarayıcınızda açın:"
echo "  http://localhost:5173"
echo ""
echo "Deployment için:"
echo "  deployment-checklist.md dosyasını kontrol edin"
echo ""
echo "📚 Daha fazla bilgi için README.md dosyasını okuyun" 