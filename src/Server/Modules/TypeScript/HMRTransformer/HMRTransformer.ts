// src/Server/Modules/TypeScript/HMRTransformer/HMRTransformer.ts
import * as ts from 'typescript';
import {
  TransformerFactory,
  Visitor,
  SourceFile,
  isNumericLiteral,
  createStringLiteral,
  Program,
  visitEachChild,
  TransformationContext,
  visitNode,
  Node,
  isCallExpression,
} from 'typescript';
import { nameOfGenerateFunction } from './HMRGenerate';

function getDescriptor(
  type: ts.Node,
  typeChecker: ts.TypeChecker,
): ts.Expression {
  switch (type.kind) {
    case ts.SyntaxKind.PropertySignature:
      return getDescriptor((type as ts.PropertySignature).type, typeChecker);
    case ts.SyntaxKind.TypeLiteral:

    case ts.SyntaxKind.InterfaceDeclaration:
      return ts.createObjectLiteral(
        (type as ts.InterfaceDeclaration).members.map(
          (m): ts.ObjectLiteralElementLike =>
            ts.createPropertyAssignment(
              m.name || '',
              getDescriptor(m, typeChecker),
            ),
        ),
      );

    case ts.SyntaxKind.TypeReference:
      const symbol = typeChecker.getSymbolAtLocation(
        (type as ts.TypeReferenceNode).typeName,
      );
      const declaration = ((symbol && symbol.declarations) || [])[0];
      return getDescriptor(declaration, typeChecker);
    case ts.SyntaxKind.NumberKeyword:
    case ts.SyntaxKind.BooleanKeyword:
    case ts.SyntaxKind.AnyKeyword:
    case ts.SyntaxKind.StringKeyword:
      return ts.createLiteral('string');
    case ts.SyntaxKind.ArrayType:
    default:
      throw new Error('Unknown type ' + ts.SyntaxKind[type.kind]);
  }
}

export function hmrTransformer<T extends ts.SourceFile>(
  program: ts.Program,
): ts.TransformerFactory<T> {
  function visitor(
    ctx: ts.TransformationContext,
    sf: ts.SourceFile,
    result: { seen: boolean },
  ) {
    const typeChecker = program.getTypeChecker();

    const visitor: ts.Visitor = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        node.typeArguments &&
        node.expression.getText(sf) == 'generateRtti'
      ) {
        const [type] = node.typeArguments;
        const [argument] = node.arguments;
        const fn = ts.createIdentifier(nameOfGenerateFunction);
        const typeName = type.getText();
        argumen;
        const typeSource = getDescriptor(type, typeChecker);
        result.seen = true;
        return ts.createCall(fn, undefined, [
          argument || ts.createStringLiteral(typeName),
          typeSource,
        ]);
      }

      // Implementation here
      return ts.visitEachChild(node, visitor, ctx);
    };

    return visitor;
  }

  return (ctx) => {
    return (sf) => {
      const result = { seen: false };
      const newSf = visitNode(sf, visitor(ctx, sf, result));

      if (result.seen) {
        const fn = createGenerateFunction();
        return ts.updateSourceFileNode(newSf, [fn, ...newSf.statements]);
      }

      return newSf;
    };
  };
}
