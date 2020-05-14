// src/Server/Modules/HMR/HMRRoute.ts
import { Route } from '../../Library/Modules/Models/Route';
import { HMREvents } from './HMR';

export default class HMRRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/HMR',
    wsHandler: (conn, req) => {
      // this will handle websockets connections
      conn.setEncoding('utf8');

      HMREvents.on('fileChanged', (msg) => {
        conn.write(msg.filePath);
      });

      // conn.once('data', (chunk) => {
      //   conn.end();
      // });
    },
  };

  async handler() {
    return {
      test: true,
    };
  }
}
