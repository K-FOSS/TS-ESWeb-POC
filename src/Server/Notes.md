```typescript
// async function getDeps(key: string): Promise<any> {
//   const scriptModule = moduleMap.get(key);
//   if (!scriptModule) {
//     return;
//   }

//   const cjsExec = cjsMatcher.exec(scriptModule.filePath);
//   if (cjsExec && cjsExec.groups?.module) {
//     console.log(
//       `Setting ${cjsExec.groups.module}: '/Static${scriptModule.filePath}'`,
//     );
//     clientImportMap.set(
//       cjsExec.groups.module,
//       `/Static${scriptModule.filePath}`,
//     );
//   } else {
//     console.log('Other: ', scriptModule.specifier, scriptModule.filePath);
//     if (relativePathRegex.test(scriptModule.specifier)) {
//       clientImportMap.set(
//         `/Static${scriptModule.filePath
//           .replace(/\.tsx?$/, '')
//           .replace('.js', '')}`,
//         `/Static${scriptModule.filePath}`,
//       );
//     } else {
//       clientImportMap.set(
//         scriptModule.specifier,
//         `/Static${scriptModule.filePath}`,
//       );
//     }
//   }

//   Array.from(scriptModule.dependencies).map((depKey) => getDeps(depKey));
// }

// for (const [filePath, specifiers] of webModuleController.specifierMap) {
//   Array.from(specifiers).map((specifier) => {
//     if (relativePathRegex.test(specifier)) {
//       clientImportMap.set(
//         `/Static${filePath.replace(/\.tsx?$/, '').replace('.js', '')}`,
//         `/Static${filePath}`,
//       );
//     } else {
//       clientImportMap.set(specifier, `/Static${filePath}`);
//     }
//   });
// }

// if (!clientMap) {
//   // getDeps('/home/node/workspace/src/Web/Client.tsx');

//   const coreMap = Object.fromEntries(clientImportMap);

//   clientMap = {
//     ...coreMap,
//     'scheduler/tracing':
//       '/Static//home/node/workspace/node_modules/react-dom/node_modules/scheduler/cjs/scheduler-tracing.development.js',
//     history: '/Static//home/node/workspace/node_modules/history/history.js',
//     'object-assign':
//       '/Static//home/node/workspace/node_modules/object-assign/index.js',
//     'react-router':
//       '/Static//home/node/workspace/node_modules/react-router/react-router.development.js',
//     'react-router-dom':
//       '/Static//home/node/workspace/node_modules/react-router-dom/react-router-dom.development.js',
//     '/Static//home/node/workspace/node_modules/prop-types/factoryWithTypeCheckers':
//       '/Static//home/node/workspace/node_modules/prop-types/factoryWithTypeCheckers.js',
//     '/Static//home/node/workspace/node_modules/prop-types/lib/ReactPropTypesSecret':
//       '/Static//home/node/workspace/node_modules/prop-types/lib/ReactPropTypesSecret.js',
//     '/Static//home/node/workspace/node_modules/prop-types/checkPropTypes':
//       '/Static//home/node/workspace/node_modules/prop-types/checkPropTypes.js',
//     'prop-types':
//       '/Static//home/node/workspace/node_modules/prop-types/index.js',
//     '@babel/runtime/helpers/esm/extends':
//       '/Static//home/node/workspace/node_modules/@babel/runtime/helpers/esm/extends.js',
//     'react-refresh/runtime':
//       '/Static//home/node/workspace/node_modules/react-refresh/cjs/react-refresh-runtime.development.js',
//   };
// }
```
