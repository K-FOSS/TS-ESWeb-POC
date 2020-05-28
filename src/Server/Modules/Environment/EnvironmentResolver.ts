// src/Server/Modules/Environment/EnvironmentResovler.ts
import { Resolver, Query } from 'type-graphql';
import { Environment } from './Environment';
import { envMode } from '../../../Utils/Environment';

@Resolver()
export class EnvironmentResolver {
  @Query(() => Environment, {
    description: 'Returns the servers current environment mode',
  })
  serverEnvironment(): Environment {
    return envMode;
  }
}
