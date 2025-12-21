FROM node:24-alpine AS build
WORKDIR /app
ARG ENV
ENV ENV=$ENV

# Install system dependencies for Cairo and related libraries

COPY . .

RUN npm install -f
RUN npx prisma db push --accept-data-loss
RUN npx prisma generate
RUN npx prisma db seed
RUN npm run build

RUN mkdir -p .next/standalone/public
RUN cp -r public/* .next/standalone/public/
RUN cp -r .next/static .next/standalone/.next/

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

ENV HOSTNAME=0.0.0.0
ARG PORT
ENV PORT=$PORT
EXPOSE $PORT
CMD ["node", "server.js"]
