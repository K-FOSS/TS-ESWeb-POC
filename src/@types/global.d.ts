interface ImportMeta {
  url: string;

  resolve(specifier: string, parentUrl?: string): Promise<string>;
}
