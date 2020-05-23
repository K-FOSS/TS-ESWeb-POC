// src/Server/Modules/TypeScript/HMRTransformer/HMRTransformer.ts
import * as ts from 'typescript';

const relativePathRegex = /^\.{0,2}[/]/;

export function importTransformer(
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  function visitor(
    ctx: ts.TransformationContext,
    sf: ts.SourceFile,
    result: { seen: boolean },
  ) {
    const visitor: ts.Visitor = (node: ts.Node) => {
      if (
        ts.isImportDeclaration(node) &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        if (relativePathRegex.test(node.moduleSpecifier.text)) {
          console.log(`Is relative?: ${node.moduleSpecifier.text}`);
          return node;
        } else {
          console.log(
            `Set new specififer to '/Static/import?specifier=${node.moduleSpecifier.text}'`,
          );
        }

        return ts.updateImportDeclaration(
          node,
          node.decorators,
          node.modifiers,
          node.importClause,
          ts.createLiteral(
            `/Static/import?specifier=${node.moduleSpecifier.text}`,
          ),
        );
      }

      // Implementation here
      return ts.visitEachChild(node, visitor, ctx);
    };

    return visitor;
  }

  return (ctx) => {
    return (sf) => {
      const result = { seen: false };
      const newSf = ts.visitNode(sf, visitor(ctx, sf, result));

      return newSf;
    };
  };
}
