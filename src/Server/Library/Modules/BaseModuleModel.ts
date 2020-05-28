// src/Server/Library/Modules/BaseModuleModel.ts

/**
 * Base Modules Abstract Class
 */
export abstract class BaseModule<T> {
  /**
   * Regular expression of Module files
   *
   * @example
   * ```ts
   * fileRegex = /\S+Route\.ts$/g
   * ```
   */
  abstract fileRegex: RegExp;

  /**
   * Load the module
   */
  abstract load<Module extends { [key: string]: T }>(
    loadedModule: Module,
  ): Promise<any>;
}
