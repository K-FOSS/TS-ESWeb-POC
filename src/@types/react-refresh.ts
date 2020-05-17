// src/@types/react-refresh.ts
declare module 'react-refresh/runtime' {
  /**
   * TBD
   */
  type Type = any;

  type Id = string;

  type Family = any;

  export function _getMountedRootCount(): number;

  export function collectCustomHooksForSignature(type: Type): void;

  export function createSignatureFunctionForTransform(): (
    type: Type,
    key: any,
    forceReset: any,
    getCustomHooks: any,
  ) => any;

  export function findAffectedHostInstances(families: Family): Set<any>;

  export function getFamilyByID(id: Id): Family;

  export function getFamilyByType(type: Type): Family;

  /**
   * Unkown comment in source says to be removed after dep in RN is fixed?
   */
  export function hasUnrecoverableErrors(): false;

  export function injectIntoGlobalHook(global: Window): void;

  export function isLikelyComponentType(type: Type): boolean;

  export function performReactRefresh(): {
    updatedFamilies: Set<Family>;
    staleFamilies: Set<Family>;
  };

  export function register(type: Type, id: Id): void;

  export function setSignature(type: Type, key: Type): void;
}
