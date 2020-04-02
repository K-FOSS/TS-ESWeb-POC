
FROM kristianfoss/builders-node:build as builder

FROM kristianfoss/builders-node:fetcher as fetcher


FROM node:alpine3.11
WORKDIR /app
ENV NODE_ENV=production

COPY --from=fetcher /src/app/node_modules /app/node_modules
COPY --from=builder /src/app/dist /app/dist
COPY --from=builder /src/app/package.json /app/

ENTRYPOINT [ "node" ]
CMD ["--loader", "@k-foss/ts-esnode", "--experimental-import-meta-resolve", "--experimental-specifier-resolution=node", "--harmony-top-level-await", "--harmony-optional-chaining", "/app/dist/Server/index.js"]