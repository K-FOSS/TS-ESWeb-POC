/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// src/Web/Library/Helper.ts
import * as Refresh from 'react-refresh/runtime';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce<T extends Function>(func: T, wait: any, immediate?: any) {
  let timeout: NodeJS.Timeout | null;
  return function () {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout!);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const enqueueUpdateFn = () => {
  try {
    Refresh.performReactRefresh();
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    module.hot.decline();
    throw e;
  }
};

export const isReactRefreshBoundary = (moduleExports: {
  [key: string]: Function;
}) => {
  if (Object.keys(Refresh).length === 0) {
    return false;
  }
  if (Refresh.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    return false;
  }
  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      return false;
    }
    const exportValue = moduleExports[key];
    if (!Refresh.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  return hasExports && areAllExportsComponents;
};

export const registerExportsForReactRefresh = (
  moduleExports: any,
  moduleID: string,
) => {
  Refresh.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }
  for (const key in moduleExports) {
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      continue;
    }
    const exportValue = moduleExports[key];
    const typeID = moduleID + ' %exports% ' + key;
    Refresh.register(exportValue, typeID);
  }
};

export const helloWorld = 'helloWorld';

export const enqueueUpdate = debounce(enqueueUpdateFn, 30);
