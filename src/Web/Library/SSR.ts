// src/Web/Library/SSR.ts
import flightClient from 'react-client/cjs/react-client-flight.development.js';

const {
  createResponse,
  processBinaryChunk,
  processStringChunk,
  close,
  reportGlobalError,
} = flightClient({
  supportsBinaryStreams: true,
  parseModel: (response, json) => JSON.parse(json, response._fromJSON),
  createStringDecoder: () => new TextDecoder(),
  readPartialStringChunk: (decoder: TextDecoder, buffer: Uint8Array) =>
    decoder.decode(buffer, { stream: true }),
  readFinalStringChunk: (decoder: TextDecoder, buffer: Uint8Array) =>
    decoder.decode(buffer),
});

function startReadingFromStream(
  response: any,
  stream: ReadableStream<Uint8Array>,
): void {
  const reader = stream.getReader();

  function error(e: Error) {
    console.error(e);
  }

  function progress({
    done,
    value,
  }: ReadableStreamReadResult<Uint8Array>): void | Promise<void> {
    if (done) {
      close(response);
      return;
    }

    processBinaryChunk(response, value);

    return reader.read().then(progress, error);
  }

  reader.read().then(progress, error);
}

function createFromReadableStream(stream: ReadableStream) {
  const response = createResponse();
  startReadingFromStream(response, stream);
  return response;
}

function createFromFetch(promiseForResponse: Promise<Response>) {
  const response = createResponse();

  promiseForResponse.then(
    function (r) {
      startReadingFromStream(response, r.body!);
    },
    function (e) {
      reportGlobalError(response, e);
    },
  );

  return response;
}

export { createFromFetch, createResponse, processStringChunk };
