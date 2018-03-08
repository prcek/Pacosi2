FROM node:9.3.0

ENV TINI_VERSION v0.16.1
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY backend /usr/src/app/
COPY version.json /usr/src/app/
RUN yarn install

COPY client /usr/src/app/client/
COPY version.json /usr/src/app/client/src/
WORKDIR /usr/src/app/client
RUN yarn install
RUN yarn run build

WORKDIR /usr/src/app

EXPOSE 4000
ENV PORT=4000
ENV DEBUG="backend:*"
ENV FORCE_SSL="true"
ENV SENTRY_DSN=""
ENV APOLLO_API_KEY=""

CMD ["node","bin/www"]
