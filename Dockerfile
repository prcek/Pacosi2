FROM node:9.3.0

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY backend /usr/src/app/
RUN yarn install

COPY client /usr/src/app/client/
WORKDIR /usr/src/app/client
RUN yarn install
RUN yarn run build

WORKDIR /usr/src/app

EXPOSE 4000
ENV PORT=4000
ENV DEBUG="backend:*"
CMD ["node","bin/www"]
