// bin/Utils/TypeScript/buildPath.ts
import { resolve as resolvePath } from 'path';
import ts from 'typescript';
import { reportDiagnostic, reportSolutionBuilderStatus } from '../Logging';
import { tsSys } from './tsSystem';

/**
 * Builds a source path
 * @param srcStr Source Files Path
 * @param watch Start a watcher to compile on file change
 */
export async function buildPath(
  srcStr: string,
  watch = false,
): Promise<number | void> {
  const tsConfigPath = resolvePath('tsconfig.build.json');

  /**
   * TypeScript Program to use
   */
  const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

  if (watch) {
    const host = ts.createWatchCompilerHost(
      tsConfigPath,
      {},
      tsSys,
      createProgram,
    );

    ts.createWatchProgram(host);
  } else {
    const host = ts.createSolutionBuilderHost(
      tsSys,
      undefined,
      reportDiagnostic,
      reportSolutionBuilderStatus,
    );
    const solution = ts.createSolutionBuilder(host, [tsConfigPath], {
      verbose: true,
    });

    console.log(solution.build(tsConfigPath));
  }
}
