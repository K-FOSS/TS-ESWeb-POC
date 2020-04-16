// src/Utils/hmrLoader.ts
let count = 0;

export async function HMRLoader<T>(
  importSpecifier: string,
  parentModule: string,
): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const importURLString = await import.meta.resolve(
    importSpecifier,
    parentModule,
  );

  const importURL = new URL(importURLString);
  importURL.searchParams.set('count', `${count++}`);

  return import(importURL.href) as Promise<T>;
}
