// src/@types/typescript.ts
import { ResolvedModuleFull, SourceFile as TSSource } from 'typescript';

type ResolvedModuleMap = Map<string, ResolvedModuleFull>;

declare module 'typescript' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  interface SourceFile extends TSSource {
    imports: Token<SyntaxKind.ImportClause>[];
    resolvedModules: ResolvedModuleMap;
  }
}
