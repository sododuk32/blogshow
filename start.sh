echo "Starting Next.js with PM2..."
pm2 start npm --name "nextjs" -- run start

MAX_TRIES=120
TRY_COUNT=0

until curl -s http://localhost:3000/api/cron/getKey > /dev/null; do
  echo "Waiting for /api/cron/getKey..."
  sleep 1
  TRY_COUNT=$((TRY_COUNT+1))
  if [ "$TRY_COUNT" -ge "$MAX_TRIES" ]; then
    echo "❌ Timeout waiting for API. Exiting."
    exit 1
  fi
done


echo "✅ Key initialized!"
pm2 logs
