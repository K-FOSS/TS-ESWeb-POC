// src/@types/react-server.ts
declare module 'react-server/cjs/react-server-flight.development' {
  import type { ReactElement } from 'react';
  import type { Writable } from 'stream';

  /**
   * Node Server Configs
   *
   */
  type Chunk = Uint8Array;

  type BundlerConfig = any;
  type ModuleReference<T> = any;
  type ModuleMetaData = any;

  type ReactParentKey = string | number;

  type ReactModelObject = { [key: string]: ReactModel };

  interface Segment {
    id: number;
    query: () => ReactModel;
    ping: () => void;
  }

  type ReactJSONValue =
    | string
    | boolean
    | number
    | null
    | ReadonlyArray<ReactJSONValue>
    | ReactModelObject;

  export type ReactModel =
    | ReactElement<any>
    | string
    | boolean
    | number
    | null
    | Iterable<ReactModel>
    | ReactModelObject;

  interface MightBeFlushable {
    flush?: () => void;
    // Legacy
    flushHeaders?: () => void;
  }

  /**
   * Node Destinaton
   */
  type Destination = Writable & MightBeFlushable;

  interface Request {
    destination: Destination;
    bundlerConfig: BundlerConfig;
    nextChunkId: number;
    pendingChunks: number;
    pingedSegments: Array<Segment>;
    completedJSONChunks: Array<Chunk>;
    completedErrorChunks: Array<Chunk>;
    flowing: boolean;
    toJSON: (key: string, value: ReactModel) => ReactJSONValue;
  }

  interface FlightServerHostConfig {
    /**
     *
     * @param callback nothing
     *
     * @example ```typescript
     *  scheduleWork: (callback) => callback()
     * ````
     */
    scheduleWork: (callback: () => void) => void;

    beginWriting: (destination: Destination) => void;

    writeChunk: (destination: Destination, buffer: Uint8Array) => boolean;

    completeWriting: (destination: Destination) => void;

    flushBuffered: (destination: Destination) => void;

    close: (destination: Destination) => void;

    convertStringToBuffer: (content: string) => Uint8Array;
  }

  interface FlightServer {
    createRequest: (
      model: ReactModel,
      destination: Destination,
      bundlerConfig?: BundlerConfig,
    ) => Request;

    resolveModelToJSON: (
      request: Request,
      parent:
        | { [key in ReactParentKey]: ReactModel }
        | ReadonlyArray<ReactModel>,
      key: string,
      value: ReactModel,
    ) => ReactJSONValue;

    startFlowing: (request: Request) => void;

    startWork: (request: Request) => void;
  }

  export default function $$$reconciler(
    $$$hostConfig: FlightServerHostConfig,
  ): FlightServer;
}
