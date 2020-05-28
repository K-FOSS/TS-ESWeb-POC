// src/Server/Modules/Environment/EnvironmentTransformer.ts
import * as ts from 'typescript';
import { Transformer } from '../../Library/Transformers';

export class EnvironmentTransformer extends Transformer {
  after: Transformer['before'] = (context) => {
    // const relativePathRegex = /^\.{1,2}[/]/;

    return (sourceFile: ts.SourceFile) => {
      const visitor: ts.Visitor = (node) => {
        if (
          ts.isPropertyAccessExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.escapedText === 'process' &&
          ts.isIdentifier(node.expression.name) &&
          node.expression.name.escapedText === 'env'
        ) {
          return ts.createStringLiteral(
            process.env[node.name.escapedText.toString()] || '',
          );
        }

        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode<ts.SourceFile>(sourceFile, visitor);
    };
  };
}
