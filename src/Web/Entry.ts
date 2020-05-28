// src/Web/Entry.ts

import { useMemo } from 'react';

import * as React from 'react';

const test = process.env.NODE_ENV;
// import { Workbox } from 'workbox-window';

// const wb = new Workbox('/');

console.log(useMemo, React, test);

import('./Client').then(console.log);
