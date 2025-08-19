FROM node:20-alpine AS base
WORKDIR /usr/src/app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/package*.json ./
EXPOSE 3001
CMD sh -c "npx prisma migrate deploy && node dist/main.js"


