// src/Web/Library/ReactClient/index.ts
import createFlightClient from 'react-client/cjs/react-client-flight.development.js';
import { clientHostConfig } from './clientConfig';

const {
  createResponse,
  processBinaryChunk,
  close,
  reportGlobalError,
} = createFlightClient(clientHostConfig);

// const reader = ssrResponse.body?.getReader();
// if (!reader) return;

// async function* readStream(): AsyncGenerator<string> {
//   const { value, done } = await reader!.read();
//   yield processStringChunk(response, decoder.decode(value));

//   if (done) {
//     close(response);
//   }

//   yield* readStream();
// }

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

    if (!value) return;

    processBinaryChunk(response, value);

    return reader.read().then(progress, error);
  }

  reader.read().then(progress, error);
}

export function createFromFetch(promiseForResponse: Promise<Response>) {
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
