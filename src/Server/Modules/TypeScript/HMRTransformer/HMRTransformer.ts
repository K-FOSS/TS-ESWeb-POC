// src/Server/Modules/TypeScript/HMRTransformer/HMRTransformer.ts
import * as ts from 'typescript';
import { parentPort } from 'worker_threads';
import {
  TranspileWorkerMessage,
  TranspileWorkerMessageType,
} from '../WorkerMessages';

export function hmrTransformer(
  program: ts.Program,
): ts.TransformerFactory<ts.SourceFile> {
  let test: ts.NodeArray<ts.Statement>;

  function visitor(
    ctx: ts.TransformationContext,
    sf: ts.SourceFile,
    result: { seen: boolean },
  ) {
    const visitor: ts.Visitor = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node)) {
        const tags = ts.getJSDocTags(node);

        for (const tag of tags) {
          if (tag.tagName.escapedText.toString().toLowerCase() === 'hmr') {
            result.seen = true;

            test = node.body!.statements;
          }
        }
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

      const importStatements: ts.Statement[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let exportStatement: ts.Statement;

      if (result.seen) {
        parentPort!.postMessage({
          type: TranspileWorkerMessageType.PUSH_HMR,
          filePath: sf.fileName,
        } as TranspileWorkerMessage);

        newSf.statements
          .map((statement) => {
            switch (statement.kind) {
              case ts.SyntaxKind.ImportDeclaration:
                importStatements.push(statement);
                break;
              case ts.SyntaxKind.ExportAssignment:
                exportStatement = statement;
                break;
              case ts.SyntaxKind.FunctionExpression:
                break;
              default:
                return statement;
            }
          })
          .filter(Boolean);

        return ts.updateSourceFileNode(newSf, [
          ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
              [
                ts.createVariableDeclaration(
                  ts.createIdentifier('prevRefreshReg'),
                  undefined,
                  ts.createPropertyAccess(
                    ts.createIdentifier('window'),
                    ts.createIdentifier('$RefreshReg$'),
                  ),
                ),
              ],
              ts.NodeFlags.Const,
            ),
          ),
          ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
              [
                ts.createVariableDeclaration(
                  ts.createIdentifier('prevRefreshSig'),
                  undefined,
                  ts.createPropertyAccess(
                    ts.createIdentifier('window'),
                    ts.createIdentifier('$RefreshSig$'),
                  ),
                ),
              ],
              ts.NodeFlags.Const,
            ),
          ),

          ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
              undefined,
              ts.createNamespaceImport(ts.createIdentifier('RefreshRuntime')),
              false,
            ),
            ts.createStringLiteral('react-refresh/runtime'),
          ),
          ts.createImportDeclaration(
            undefined,
            undefined,
            ts.createImportClause(
              undefined,
              ts.createNamedImports([
                ts.createImportSpecifier(
                  undefined,
                  ts.createIdentifier('enqueueUpdate'),
                ),
                ts.createImportSpecifier(
                  undefined,
                  ts.createIdentifier('isReactRefreshBoundary'),
                ),
                ts.createImportSpecifier(
                  undefined,
                  ts.createIdentifier('registerExportsForReactRefresh'),
                ),
              ]),
              false,
            ),
            ts.createStringLiteral(
              '/Static/home/node/workspace/src/Web/Library/Helper.ts',
            ),
          ),
          ...importStatements,
          ts.createExpressionStatement(
            ts.createBinary(
              ts.createPropertyAccess(
                ts.createIdentifier('window'),
                ts.createIdentifier('$RefreshReg$'),
              ),
              ts.createToken(ts.SyntaxKind.EqualsToken),
              ts.createArrowFunction(
                undefined,
                undefined,
                [
                  ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier('type'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                  ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier('id'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                ],
                undefined,
                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                ts.createBlock(
                  [
                    ts.createVariableStatement(
                      undefined,
                      ts.createVariableDeclarationList(
                        [
                          ts.createVariableDeclaration(
                            ts.createIdentifier('fullId'),
                            undefined,
                            ts.createLiteral(sf.fileName),
                          ),
                        ],
                        ts.NodeFlags.Const,
                      ),
                    ),
                    ts.createExpressionStatement(
                      ts.createCall(
                        ts.createPropertyAccess(
                          ts.createIdentifier('RefreshRuntime'),
                          ts.createIdentifier('register'),
                        ),
                        undefined,
                        [
                          ts.createIdentifier('type'),
                          ts.createIdentifier('fullId'),
                        ],
                      ),
                    ),
                  ],
                  true,
                ),
              ),
            ),
          ),
          ts.createExpressionStatement(
            ts.createBinary(
              ts.createPropertyAccess(
                ts.createIdentifier('window'),
                ts.createIdentifier('$RefreshSig$'),
              ),
              ts.createToken(ts.SyntaxKind.EqualsToken),
              ts.createPropertyAccess(
                ts.createIdentifier('RefreshRuntime'),
                ts.createIdentifier('createSignatureFunctionForTransform'),
              ),
            ),
          ),
          ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
              [
                ts.createVariableDeclaration(
                  ts.createIdentifier('exportedFn'),
                  undefined,
                  undefined,
                ),
              ],
              ts.NodeFlags.Let,
            ),
          ),

          ts.createTry(
            ts.createBlock(
              [
                ts.createExpressionStatement(
                  ts.createBinary(
                    ts.createIdentifier('exportedFn'),
                    ts.createToken(ts.SyntaxKind.EqualsToken),
                    ts.createFunctionExpression(
                      undefined,
                      undefined,
                      ts.createIdentifier('test'),
                      undefined,
                      [],
                      undefined,
                      ts.createBlock(test),
                    ),
                  ),
                ),
              ],
              true,
            ),
            undefined,
            ts.createBlock(
              [
                ts.createExpressionStatement(
                  ts.createBinary(
                    ts.createPropertyAccess(
                      ts.createIdentifier('window'),
                      ts.createIdentifier('$RefreshReg$'),
                    ),
                    ts.createToken(ts.SyntaxKind.EqualsToken),
                    ts.createIdentifier('prevRefreshReg'),
                  ),
                ),
                ts.createExpressionStatement(
                  ts.createBinary(
                    ts.createPropertyAccess(
                      ts.createIdentifier('window'),
                      ts.createIdentifier('$RefreshSig$'),
                    ),
                    ts.createToken(ts.SyntaxKind.EqualsToken),
                    ts.createIdentifier('prevRefreshSig'),
                  ),
                ),
              ],
              true,
            ),
          ),
          ts.createExpressionStatement(
            ts.createCall(
              ts.createIdentifier('registerExportsForReactRefresh'),
              undefined,
              [
                ts.createObjectLiteral(
                  [
                    ts.createPropertyAssignment(
                      ts.createIdentifier('default'),
                      ts.createIdentifier('exportedFn'),
                    ),
                  ],
                  false,
                ),
                ts.createLiteral(sf.fileName),
              ],
            ),
          ),
          ts.createExpressionStatement(
            ts.createCall(ts.createIdentifier('enqueueUpdate'), undefined, []),
          ),
          ts.createExportAssignment(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier('exportedFn'),
          ),
        ]);
      }

      return newSf;
    };
  };
}
