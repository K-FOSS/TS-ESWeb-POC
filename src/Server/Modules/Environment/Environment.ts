// src/Server/Modules/Environment/Environment.ts
import { registerEnumType } from 'type-graphql';
import { Environment, envMode } from '../../../Utils/Environment';

registerEnumType(Environment, {
  name: 'Environment',
});

export { Environment, envMode };
