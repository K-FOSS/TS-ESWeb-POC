// src/Web/Library/ReactFlight/FlightConfig.ts
import type { FlightClientHostConfig } from 'react-client/cjs/react-client-flight.development.js';

const decoderOptions = { stream: true };

/**
 * {
  supportsBinaryStreams: true,
  parseModel: (response, json) => JSON.parse(json, response._fromJSON),
  createStringDecoder: () => new TextDecoder(),
  readPartialStringChunk: (decoder: TextDecoder, buffer: Uint8Array) =>
    decoder.decode(buffer, { stream: true }),
  readFinalStringChunk: (decoder: TextDecoder, buffer: Uint8Array) =>
    decoder.decode(buffer),
}
 */

export const clientHostConfig: FlightClientHostConfig = {
  supportsBinaryStreams: true,
  createStringDecoder: () => new TextDecoder(),
  parseModel: (response, json) => JSON.parse(json, response._fromJSON),
  readPartialStringChunk: (decoder, buffer) =>
    decoder.decode(buffer, decoderOptions),
  readFinalStringChunk: (decoder, buffer) => decoder.decode(buffer),
  preloadModule: (moduleData) => console.log('preloadModule: ', moduleData),
  requireModule: (moduleData) => console.log('requireModule: ', moduleData),
  resolveModuleReference: (moduleData) => {
    console.log('resolveModuleReference: ', moduleData);
    return moduleData.name;
  },
};
