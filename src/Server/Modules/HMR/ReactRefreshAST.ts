// src/Server/Modules/HMR/ReactRefreshAST.ts
import * as ts from 'typescript';

interface InjectReactRefreshInput {
  importStatements: ts.ImportDeclaration[];

  functionStatements: ts.Statement[];
}

export function injectReactRefreshAST(
  sourceFile: ts.SourceFile,
  { functionStatements, importStatements }: InjectReactRefreshInput,
): ts.SourceFile {
  return ts.updateSourceFileNode(sourceFile, [
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
      ts.createStringLiteral('/workspace/src/Web/Library/Helper.ts'),
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
                      ts.createLiteral(sourceFile.fileName),
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
                  [ts.createIdentifier('type'), ts.createIdentifier('fullId')],
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
                ts.createIdentifier('hmrFn'),
                undefined,
                [],
                undefined,
                ts.createBlock(functionStatements),
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
          ts.createLiteral(sourceFile.fileName),
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
