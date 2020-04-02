declare global {
  interface ImportMeta {
    url: string;

    resolve(specifier: string): Promise<string>;
  }
}
