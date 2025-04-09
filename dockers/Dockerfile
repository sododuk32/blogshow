FROM node:20-alpine

WORKDIR /app

# 필수 빌드 도구 추가
RUN apk update && apk add --no-cache git curl bash python3 make g++

# 로컬 프로젝트 복사 (루트에서 실행해야 정상 작동!)
COPY ../ /app

# 퍼미션 확인용 디버깅 로그
RUN ls -al /app

# npm 설치
RUN npm install

# 프로덕션 빌드
RUN npm run build

# PM2 글로벌 설치
RUN npm install -g pm2

# 실행 스크립트 복사
COPY ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]
