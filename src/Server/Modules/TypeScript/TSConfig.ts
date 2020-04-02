// src/Modules/TypeScript/TSConfig.ts
import {
  CompilerOptions,
  ScriptTarget,
  ModuleKind,
  ModuleResolutionKind,
  JsxEmit,
} from 'typescript';

export const defaultTSOptions: CompilerOptions = {
  target: ScriptTarget.ESNext,
  module: ModuleKind.ESNext,
  moduleResolution: ModuleResolutionKind.NodeJs,

  outDir: 'dist',
  jsx: JsxEmit.React,

  allowSyntheticDefaultImports: true,
  allowJs: true,
  checkJs: true,
};
