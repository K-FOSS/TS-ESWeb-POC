// src/Modules/TypeScript/SourceFile.ts
import { SourceFile, Token, SyntaxKind, ResolvedModuleFull } from 'typescript';

export interface TSSourceFile extends SourceFile {
  imports: Token<SyntaxKind.ImportClause>[];
  resolvedModules: Map<string, ResolvedModuleFull>;
}
