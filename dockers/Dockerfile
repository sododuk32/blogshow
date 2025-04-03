FROM node:20-alpine

WORKDIR /app
RUN apk update && apk add git
RUN git clone https://github.com/sododuk32/blogshow.git
WORKDIR /app/blogshow
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

# nextjs , default port is 3000 it can be 3001... 