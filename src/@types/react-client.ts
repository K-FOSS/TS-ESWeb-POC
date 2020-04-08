// src/@types/react-client.ts
declare module 'react-client/cjs/react-client-flight.development.js' {
  type StringDecoder = TextDecoder;

  type UninitializedModel = string;

  type PendingChunk = {
    _status: 0;
    _value: null | Array<() => any>;
    _response: Response;
    then(resolve: () => any): void;
  };
  type ResolvedModelChunk = {
    _status: 1;
    _value: UninitializedModel;
    _response: Response;
    then(resolve: () => any): void;
  };
  type InitializedChunk<T> = {
    _status: 2;
    _value: T;
    _response: Response;
    then(resolve: () => any): void;
  };
  type ErroredChunk = {
    _status: 3;
    _value: Error;
    _response: Response;
    then(resolve: () => any): void;
  };
  type SomeChunk<T> =
    | PendingChunk
    | ResolvedModelChunk
    | InitializedChunk<T>
    | ErroredChunk;

  interface Response {
    _chunks: Map<number, SomeChunk<any>>;
    _partialRow: string;
    _fromJSON: (key: string, value: string) => any;
    _stringDecoder: StringDecoder;
    readRoot<T>(): T;
  }

  interface ModuleMetaData {
    id: string;
    chunks: string[];
    name: string;
  }

  export interface FlightClientHostConfig {
    resolveModuleReference?: (moduleData: ModuleMetaData) => string;

    preloadModule?: (moduleData: ModuleMetaData) => any;

    requireModule?: (moduleData: ModuleMetaData) => any;

    parseModel: (response: Response, json: string) => object;

    supportsBinaryStreams?: boolean;

    createStringDecoder: () => StringDecoder;

    readPartialStringChunk: (
      decoder: StringDecoder,
      buffer: Uint8Array,
    ) => string;

    readFinalStringChunk: (
      decoder: StringDecoder,
      buffer: Uint8Array,
    ) => string;
  }

  interface FlightClient {
    createResponse(): Response;

    processBinaryChunk(response: Response, chunk: Uint8Array): void;

    processStringChunk(response: Response, chunk: string, offset: number): void;

    reportGlobalError(response: Response, error: Error): void;

    close(response: Response): void;
  }

  export default function $$$reconciler(
    $$$hostConfig: FlightClientHostConfig,
  ): FlightClient;
}
