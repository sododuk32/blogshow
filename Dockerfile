# --- Build Stage ---
    FROM node:20-alpine AS builder

    # 1. 필요한 툴 설치
    RUN apk update && apk add --no-cache curl jq
    
    # 2. 환경변수 (빌드 시 사용 가능)
    ARG HanTKey
    ARG HanTSecret
    ARG HantBaseUrl
    
    # 3. 환경변수 런타임까지 넘기고 싶다면 ENV로 지정
    ENV HanTKey=$HanTKey \
        HanTSecret=$HanTSecret \
        HantBaseUrl=$HantBaseUrl
    
    WORKDIR /app
    
    # 4. 전체 소스 복사
    COPY . .
    
    # 5. 의존성 설치 및 빌드
    RUN npm install && npm run build
    
    
    # --- Run Stage ---
    FROM node:20-alpine
    
    WORKDIR /app
    
    # 6. 런타임 필요한 패키지 설치
    RUN apk update && apk add --no-cache curl jq
    
    # 7. PM2 설치
    RUN npm install -g pm2 pm2-runtime
    
    # 8. 실행에 필요한 파일 복사
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/start.sh ./start.sh
    
    # 9. .env 및 .cache 복사
    COPY .env .env
    COPY .cache /app/.cache 
    
    # 10. 실행 권한 부여
    RUN chmod +x ./start.sh
    
    EXPOSE 3000
    
    # 11. 앱 시작
    CMD ["sh", "./start.sh"]
    