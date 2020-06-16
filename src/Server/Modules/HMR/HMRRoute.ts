// src/Server/Modules/HMR/HMRRoute.ts
import { Route } from '../../Library/Fastify';
import { HMR } from './HMR';

/**
 * HMR Routes
 */
export default class HMRRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/HMR',
    wsHandler: (conn, req) => {
      // this will handle websockets connections
      conn.setEncoding('utf8');

      // When the HMR controller emits the moduleUpdated event notify all subscribed websockets
      HMR.on('moduleUpdated', (filePath) => {
        conn.socket.send(filePath);
      });
    },
  };

  async handler() {
    return {
      test: true,
    };
  }
}
