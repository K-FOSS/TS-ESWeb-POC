ARG ALPINE='alpine:3.11'
ARG NODE="node:alpine3.11"

FROM ${NODE} as builder
WORKDIR /workspace

COPY ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json ./
COPY ./bin ./bin
COPY ./extras ./extras
RUN npm i
RUN node --loader @k-foss/ts-esnode --experimental-specifier-resolution=node --experimental-import-meta-resolve --harmony-optional-chaining --harmony-top-level-await ./bin/postInstall.ts

COPY ./src ./src

ENV NODE_ENV production
RUN npm run build

FROM ${NODE} as fetcher
WORKDIR /workspace
COPY ./bin ./bin
COPY ./extras ./extras
COPY ./package.json ./package-lock.json tsconfig.json ./
RUN npm i
RUN node --loader @k-foss/ts-esnode --experimental-specifier-resolution=node --experimental-import-meta-resolve --harmony-optional-chaining --harmony-top-level-await ./bin/postInstall.ts

FROM node:alpine3.11
WORKDIR /workspace
ENV NODE_ENV=production

COPY --from=fetcher /workspace/node_modules /workspace/node_modules
COPY --from=builder /workspace/dist /workspace/dist
COPY --from=builder /workspace/extras/modules/react-client /workspace/node_modules/react-client
COPY --from=builder /workspace/package.json ./package.json


ENTRYPOINT [ "node" ]
CMD ["--loader", "@k-foss/ts-esnode", "--experimental-import-meta-resolve", "--experimental-specifier-resolution=node", "--harmony-top-level-await", "--harmony-optional-chaining", "/workspace/dist/Server/index.js"]