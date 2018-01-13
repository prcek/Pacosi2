FROM node:9.3.0

ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]


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
