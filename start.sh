echo "🚀 Starting NGINX..."
nginx

echo "Starting Next.js with PM2..."
pm2 start npm --name "nextjs" -- run start
#!/bin/bash

# TRY_COUNT=0
# MAX_TRIES=60

# while true; do
#   RESPONSE=$(curl -s http://localhost:3000/api/giveKey)
#   MESSAGE=$(echo "$RESPONSE" | jq -r .message)

#   if [ "${#MESSAGE}" -ge 4 ]; then
#     echo "✅ message 길이: ${#MESSAGE}, 내용: $MESSAGE"
#     break
#   fi

#   echo "Waiting... 현재 message 길이: ${#MESSAGE}, 내용: $MESSAGE"
#   sleep 1
#   TRY_COUNT=$((TRY_COUNT+1))

#   if [ "$TRY_COUNT" -ge "$MAX_TRIES" ]; then
#     echo "❌ Timeout waiting for valid message. Exiting."
#     exit 1
#   fi
# done



echo "✅ Key initialized!"
pm2 logs