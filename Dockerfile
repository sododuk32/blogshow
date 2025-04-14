# --- Build Stage ---
    FROM node:20-alpine AS builder

    # 1. 필요한 툴 설치
    RUN apk update && apk add --no-cache curl jq
    
    # 2. 환경변수 (빌드 시 사용 가능)
    ARG HanTKey
    ARG HanTSecret
    ARG HantBaseUrl
    ENV HanTKey=$HanTKey
    ENV HanTSecret=$HanTSecret
    ENV HantBaseUrl=$HantBaseUrl
    
    WORKDIR /app
    
    # 4. 전체 소스 복사
    COPY . .
    
    # 5. 의존성 설치 및 빌드
    RUN npm install && npm run build
    
    
    # --- Run Stage ---
    FROM node:20-alpine

    ARG HanTKey
    ARG HanTSecret
    ARG HantBaseUrl

    ENV HanTKey=$HanTKey
    ENV HanTSecret=$HanTSecret
    ENV HantBaseUrl=$HantBaseUrl
    
    WORKDIR /app

    
    # 6. 런타임 필요한 패키지 설치
    RUN apk update && apk add --no-cache nginx curl jq
    
    # 7. PM2 설치
    RUN npm install -g pm2 pm2-runtime
    
    # 8. 실행에 필요한 파일 복사
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/start.sh ./start.sh
    
    # ✅ nginx 설정 복사
    COPY NginxCon/nginx.conf /etc/nginx/nginx.conf

    # 9. .env 및 .cache_data 복사
    COPY cache_data /app/cache_data
    
    # 10. 실행 권한 부여
    RUN chmod +x ./start.sh
    
    EXPOSE 3000
    
    # 11. 앱 시작
    CMD ["sh", "./start.sh"]
    
    # jq 안깔아서 오류남. => env 없어서 컨테이너 내부에서 실행시 오류남
    # 25 04 14 / 로컬 이미지 빌드 말고 github actions에 맞게 환경변수 참조 위치변경. 
    #     COPY .env .env => 삭제 