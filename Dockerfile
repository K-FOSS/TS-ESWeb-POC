FROM kristianfoss/builders-node:build as builder

FROM kristianfoss/builders-node:fetcher as fetcher


FROM node:alpine3.11
WORKDIR /app
ENV NODE_ENV=production

COPY --from=fetcher /src/app/node_modules /app/node_modules
COPY ./extras/TS-ESNode/findFiles.js /app/node_modules/@k-foss/ts-esnode/out/dist/findFiles.js
COPY ./extras/ReactDOMPkg.json /app/node_modules/@pika/react-dom/package.json
COPY ./extras/ReactPkg.json /app/node_modules/@pika/react/package.json
COPY --from=builder /src/app/dist /app/dist
COPY --from=builder /src/app/package.json /app/

ENTRYPOINT [ "node" ]
CMD ["--loader", "@k-foss/ts-esnode", "--experimental-import-meta-resolve", "--experimental-specifier-resolution=node", "--harmony-top-level-await", "--harmony-optional-chaining", "/app/dist/Server/index.js"]