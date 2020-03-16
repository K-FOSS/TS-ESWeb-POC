// src/TypeScript.ts
import ts from 'typescript';
import { dirname } from 'path';
import { addModule } from './Modules';

const defaultTSOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,

  outDir: 'dist',
  jsx: ts.JsxEmit.React,

  allowSyntheticDefaultImports: true,
  allowJs: true,
  checkJs: true,
};

interface SourceFile extends ts.SourceFile {
  imports: ts.Token<ts.SyntaxKind.ImportClause>[];
  resolvedModules: Map<string, ts.ResolvedModuleFull>;
}

async function compileDependencies(sourceFile: SourceFile): Promise<string[]> {
  const dependencyNames: string[] = [];

  if (sourceFile.resolvedModules)
    sourceFile.resolvedModules.forEach(
      async (resolvedModule, moduleSpecifier) => {
        const moduleImport = sourceFile.imports.find(
          (moduleImportItem) =>
            (moduleImportItem as any).text === moduleSpecifier,
        );

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await compileWeb(
          resolvedModule.resolvedFileName,
          (moduleImport?.text as unknown) as string,
        );

        dependencyNames.push((moduleImport?.text as unknown) as string);
      },
    );

  return dependencyNames;
}

export async function compileWeb(
  entryPath: string,
  specifier = entryPath,
): Promise<void> {
  const rootDir = dirname(entryPath);

  console.log(
    `Compiling TypeScript, Javascript, and generating depedency graph for ${entryPath}`,
  );

  const compilierHost = ts.createCompilerHost({
    ...defaultTSOptions,
    rootDir,
  });

  // TODO: Move the SourceFile to a forced delacre/d.ts file
  // Need to ignore due to forcing our SourceFile Type
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  compilierHost.writeFile = (
    filePath,
    contents,
    writeByteOrderMark,
    onError,
    sourceFiles: SourceFile[],
  ) => {
    if (sourceFiles) {
      // Using full function() for a (TODO: INVESTIGATE) perf benefit.
      sourceFiles.map(async function(sourceFile: SourceFile) {
        const deps = await compileDependencies(sourceFile);

        addModule(entryPath, {
          specifier,
          dependencies: deps,
          esCode: contents,
        });
      });
    }
  };

  const compilerProgram = ts.createProgram({
    rootNames: [entryPath],
    options: defaultTSOptions,
    host: compilierHost,
  });
  compilerProgram.emit();

  console.log(`Emit for ${entryPath}`);
}
