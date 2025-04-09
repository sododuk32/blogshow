#!/bin/sh
echo "🚀 빌드 중..."
npm run build

echo "🚀 Starting Next.js with PM2..."
pm2 start npm --name "nextjs" -- run start

echo "⏳ Waiting for server to be ready..."
until curl -s http://localhost:3000/api/cron/getKey > /dev/null; do
  echo "Waiting for /api/cron/getKey..."
  sleep 1
done

echo "✅ Key initialized!"
pm2 logs
