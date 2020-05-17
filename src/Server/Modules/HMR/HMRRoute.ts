// src/Server/Modules/HMR/HMRRoute.ts
import { Route } from '../../Library/Modules/Models/Route';
import { HMR } from './HMR';

export default class HMRRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/HMR',
    wsHandler: (conn, req) => {
      // this will handle websockets connections
      conn.setEncoding('utf8');

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
