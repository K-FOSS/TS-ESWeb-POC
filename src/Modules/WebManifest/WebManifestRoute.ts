// src/Modules/WebManifest/WebManifestRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Modules/Models/Route';
import { DisplayMode } from './WebManifet';

export default class ManifestRoute implements Route {
  public options: Route['options'] = {
    method: 'GET',
    url: '/WebManifest.json',
  };

  async handler(
    this: FastifyInstance,
    request: FastifyRequest,
    reply: FastifyReply<ServerResponse>,
  ) {
    console.log('Manifest handling');

    return {
      name: 'vSphere Tools',
      description: 'Tools and utilities for vSphere automation',
      // eslint-disable-next-line @typescript-eslint/camelcase
      short_name: 'vSphere Tools',

      // eslint-disable-next-line @typescript-eslint/camelcase
      start_url: '/',

      // eslint-disable-next-line @typescript-eslint/camelcase
      background_color: '#FFF',
      display: DisplayMode.STANDALONE,
      icons: [
        {
          src:
            'https://www.shareicon.net/data/512x512/2016/07/10/119930_google_512x512.png',
          type: 'image/png',
          sizes: '512x512',
        },
      ],
    };
  }
}
