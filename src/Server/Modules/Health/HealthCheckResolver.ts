// src/Server/Modules/Health/HealthCheckResolver.ts
import { Resolver, Query } from 'type-graphql';

@Resolver()
export class HealthCheckResolver {
  @Query()
  healthCheck(): string {
    return 'OK';
  }
}
