// src/@types/typescript.ts
import {
  SyntaxKind,
  SourceFile as TSSource,
  Token,
  ResolvedModuleFull,
} from 'typescript';

export declare interface SourceFile extends TSSource {
  imports: Token<SyntaxKind.ImportClause>[];
  resolvedModules: Map<string, ResolvedModuleFull>;
}
