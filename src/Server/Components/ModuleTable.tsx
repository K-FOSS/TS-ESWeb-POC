// src/Server/Components/ModuleTable.tsx
import React, { PropsWithChildren } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { moduleMap } from '../Modules/WebModule';
import { webModuleController } from '../Modules/WebModule/WebModuleController';

function TD({ children }: PropsWithChildren<{}>): React.ReactElement {
  return <td style={{ border: '1px solid #333' }}>{children}</td>;
}

export function ModuleTable(): React.ReactElement {
  return (
    <>
      <h1>HelloWorld</h1>
      <table style={{ border: '1px solid #333' }}>
        <thead style={{ backgroundColor: '#333', color: '#fff' }}>
          <tr>
            <th>Specifier</th>
            <th>File Path</th>
            <th>depenancies</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(webModuleController.modules).map(
            ([key, { dependencies, filePath }]) => (
              <tr key={filePath}>
                <TD>
                  {webModuleController.getSpecifiers(filePath) &&
                    Array.from(
                      webModuleController.getSpecifiers(filePath)!,
                    ).map((a) => <span key={a}>{a}</span>)}
                </TD>
                <TD>{filePath}</TD>
                <TD>
                  {Array.from(dependencies).map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </TD>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </>
  );
}

export function renderModuleTable(): string {
  return renderToStaticMarkup(<ModuleTable />);
}
