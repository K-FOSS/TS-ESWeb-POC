/* eslint-disable @typescript-eslint/ban-types */
// src/Server/Modules/WebManifest/isWebManifest.ts
import { WebManifest } from './WebManifet';

export function isWebManifest(
  manifest: object | WebManifest,
): manifest is WebManifest {
  if ('description' in manifest) {
    return 'icons' in manifest;
  }

  return false;
}
