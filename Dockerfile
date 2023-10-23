FROM node:18.16.0-alpine As base
WORKDIR /usr/src/app
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY --chown=node:node .env.development ./.env
COPY --chown=node:node yarn.lock ./
RUN yarn install --production
COPY --chown=node:node . .
USER node

# BUILD
FROM node:18.16.0-alpine
WORKDIR /usr/src/app
# COPY node_modules from previous stage to build
COPY --chown=node:node --from=base /usr/src/app/node_modules ./node_modules
RUN yarn run build
COPY --chown=node:node /usr/src/app/dist ./dist
USER node

EXPOSE 4000
CMD [ "node", "dist/app.js" ]

