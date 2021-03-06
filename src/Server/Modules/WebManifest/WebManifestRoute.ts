// src/Modules/WebManifest/WebManifestRoute.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { Route } from '../../Library/Fastify';
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
    return {
      name: 'TS-ESWeb',
      description: 'Proof of concept next generation web SSR framework',
      short_name: 'TS-ESWeb',
      start_url: '/',
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
