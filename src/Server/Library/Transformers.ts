// src/Server/Library/Transformers.ts
import {
  CustomTransformers,
  Program,
  TransformerFactory,
  SourceFile,
  Bundle,
} from 'typescript';
import { findModuleFiles } from '../Utils/moduleFileFinder';
import { cjsToEsmTransformerFactory } from '@wessberg/cjs-to-esm-transformer';

let customTransformers: CustomTransformers;

export abstract class Transformer {
  public program: Program;

  constructor(program: Program) {
    this.program = program;
  }

  before?: TransformerFactory<SourceFile>;
  /** Custom transformers to evaluate after built-in .js transformations. */
  after?: TransformerFactory<SourceFile>;
  /** Custom transformers to evaluate after built-in .d.ts transformations. */
  afterDeclarations?: TransformerFactory<Bundle | SourceFile>;
}

export async function getTransformers<T extends typeof Transformer>(
  compilerProgram: Program,
): Promise<CustomTransformers> {
  if (!customTransformers) {
    const transformerFiles = await findModuleFiles<{
      [key: string]: T;
    }>(/.*Transformer\.ts/gm);

    customTransformers = {
      before: [cjsToEsmTransformerFactory()],
      after: [],
      afterDeclarations: [],
    };

    transformerFiles.map((transformerExports) =>
      Object.entries(transformerExports).map(([string, TransformerClass]) => {
        // @ts-expect-error
        const transformerClass = new TransformerClass(compilerProgram);

        Object.entries(transformerClass).map(([entryKey, entry]) => {
          if (customTransformers[entryKey]) {
            customTransformers[entryKey].push(entry);
          }
        });

        return transformerClass;
      }),
    );
  } else {
    console.log('Cached');
  }

  console.log(customTransformers);

  return customTransformers;
}
