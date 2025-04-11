# --- Build Stage ---
FROM node:20-alpine AS builder

    WORKDIR /app
    COPY . .
    RUN npm install && npm run build
    
    # --- Run Stage ---
FROM node:20-alpine
    
    WORKDIR /app
    
    # pm2 + pm2-runtime 설치
    RUN npm install -g pm2 pm2-runtime
    
    # 실행에 필요한 파일만 복사
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/start.sh ./start.sh
    
    RUN chmod +x ./start.sh
    
    EXPOSE 3000
    
    # start.sh로 실행 (pm2-runtime 쓰면 CMD도 대체 가능)
    CMD ["sh", "./start.sh"]
    