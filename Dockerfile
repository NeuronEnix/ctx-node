ARG NODE_IMAGE_TAG=22

# Build project
FROM node:${NODE_IMAGE_TAG} AS app_builder
WORKDIR /app
RUN npm install -g pnpm@latest-10
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts --shamefully-hoist
COPY src ./src
COPY tsconfig.json ./
RUN pnpm build


# Build dependencies for production
FROM node:${NODE_IMAGE_TAG} AS npm_builder
WORKDIR /app
RUN npm install -g pnpm@latest-10
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --shamefully-hoist
# Add selective dev dependencies if required to run
# RUN pnpm add -D @aws-sdk/client-lambda


### Merge dependency and the code build ###
FROM node:${NODE_IMAGE_TAG} AS runner
# FROM public.ecr.aws/lambda/nodejs:${NODE_IMAGE_TAG} AS runner
WORKDIR /app
COPY --from=npm_builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=npm_builder /app/node_modules ./node_modules
COPY --from=app_builder /app/dist ./dist

EXPOSE 3000
# Run
# CMD ["node", "dist/server/express"]
