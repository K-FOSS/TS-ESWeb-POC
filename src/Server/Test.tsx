// src/Server/Test.tsx
import { FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import React from 'react';
import ReactServer from 'react-server/cjs/react-server-flight.development';
import { Writable } from 'stream';
import { Toggle } from './Components/Toggle';
import * as ServerConfig from './ReactServerConfig';

const { createRequest, startWork, startFlowing } = ReactServer(ServerConfig);

function createDrainHandler(destination: Writable, request: any) {
  return () => startFlowing(request);
}

function HTML() {
  return (
    <div>
      <Toggle />

      <Toggle initialState={true} />

      <Toggle initialState={true} />

      <Toggle />

      <Toggle />
    </div>
  );
}

export function handleRequest(reply: FastifyReply<ServerResponse>): void {
  const destination = reply.res;

  const request = createRequest(
    {
      content: <HTML />,
    },
    destination,
  );

  destination.on('drain', createDrainHandler(destination, request));

  startWork(request);
}
