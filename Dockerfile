# Builds the Node entry (src/index.ts -> dist/index.js) and runs the
# Streamable-HTTP server. For the Cloudflare Workers deployment use `wrangler
# deploy` instead — see the README.

# --- build stage: full install + bundle ------------------------------------
FROM node:26-alpine AS build
WORKDIR /app
# corepack is no longer bundled with Node (removed as of Node 25+), so install it.
RUN npm install -g corepack && corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY tsconfig.json tsdown.config.ts ./
COPY src ./src
RUN yarn build

# --- runtime stage: production deps only -----------------------------------
FROM node:26-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# corepack is no longer bundled with Node (removed as of Node 25+), so install it.
RUN npm install -g corepack && corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
# Drop devDependencies, then install only what the server needs at runtime
# (express, @modelcontextprotocol/sdk, zod).
RUN node -e "const p=require('./package.json'); delete p.devDependencies; require('fs').writeFileSync('package.json', JSON.stringify(p, null, 2))" \
 && yarn install --no-immutable \
 && yarn cache clean
COPY --from=build /app/dist ./dist
EXPOSE 3000
# Requires COMPANYCAM_API_TOKEN and MCP_AUTH_TOKEN (see README / .env.example).
CMD ["node", "dist/index.js"]
