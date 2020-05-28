// src/Server/Modules/HMR/HMRNewTransformer.ts
import * as ts from 'typescript';
import { Transformer } from '../../Library/Transformers';
import { parentPort } from 'worker_threads';
import {
  TranspileWorkerMessageType,
  TranspileWorkerMessage,
} from '../TypeScript/WorkerMessages';
import { injectReactRefreshAST } from './ReactRefreshAST';

interface Result {
  hmr: boolean;

  importStatements: ts.ImportDeclaration[];

  functionStatements: ts.Statement[];
}

export class HMRTransformer extends Transformer {
  before: Transformer['before'] = (context) => {
    const transformerFactory = (
      context: ts.TransformationContext,
      result: Result,
    ) => {
      return (sourceFile) => {
        const visitor: ts.Visitor = (node) => {
          if (ts.isFunctionDeclaration(node)) {
            const tags = ts.getJSDocTags(node);

            for (const tag of tags) {
              if (tag.tagName.escapedText.toString().toLowerCase() === 'hmr') {
                parentPort!.postMessage({
                  type: TranspileWorkerMessageType.PUSH_HMR,
                  filePath: sourceFile.fileName,
                } as TranspileWorkerMessage);

                result.hmr = true;
                result.functionStatements.push(...node.body.statements);

                return undefined;
              }
            }
          }

          if (ts.isImportDeclaration(node)) {
            result.importStatements.push(node);
          }

          if (ts.isExportAssignment(node) && result.hmr === true) {
            return undefined;
          }

          return ts.visitEachChild(node, visitor, context);
        };

        const outputSourcefile = ts.visitNode<ts.SourceFile>(
          sourceFile,
          visitor,
        );

        if (result.hmr === true) {
          console.debug('File is HMRed updating now');

          return injectReactRefreshAST(outputSourcefile, result);
        }

        return outputSourcefile;
      };
    };

    const result: Result = {
      hmr: false,
      functionStatements: [],
      importStatements: [],
    };
    const sourceFile = transformerFactory(context, result);

    return sourceFile;
  };
}
