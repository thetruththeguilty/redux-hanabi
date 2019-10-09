type F<T> = { [key in keyof T]: {
  success: key; error: 'error'; loading: 'loading', clear: 'clear', refresh: 'refresh', save: 'save'
} };

type B<T> = { [key in keyof T]: key };

const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';
const CLEAR_SUFFIX = '_clear'; // clear-able state
const REFRESH_SUFFIX = '_refresh';
const SAVE_SUFFIX = '_save'; // get a dump
const FINISH_SUFFIX = "_finish"; // this normally means the page reach the end

export function createBasicTypes<T>(prefix: string, types: T): B<T> {
  const res = {} as any;
  Object.keys(types).forEach(property => {
    if (typeof (types as any)[property] !== 'number') return;
    res[property] = prefix + property;
  })
  return res
}

export function createFetchTypes<T>(prefix: string, types: T): F<T> {
  const res = {} as any;
  Object.keys(types).forEach(property => {
    if (typeof (types as any)[property] !== 'number') return;
    let result = {} as any;
    result.loading = prefix + property + LOADING_SUFFIX;
    result.success = prefix + property + SUCCESS_SUFFIX;
    result.error = prefix + property + ERROR_SUFFIX;
    result.clear = prefix + property + CLEAR_SUFFIX;
    result.refresh = prefix + property + REFRESH_SUFFIX;
    result.save = prefix + property + SAVE_SUFFIX;
    result.finish = prefix + property + FINISH_SUFFIX;
    res[property] = result;
  })
  return res
}

/**
 * create types
 */
export function composeTypes<T1, T2>(config: { prefix: string; BasicTypes: T1; FetchTypes: T2 }): B<T1> & F<T2> {
  const { prefix, BasicTypes: actionTypes = {}, FetchTypes: fetchActionTypes = {} } = config;
  const types = {
    ...(createBasicTypes(prefix, actionTypes) as any),
    ...(createFetchTypes(prefix, fetchActionTypes) as any)
  };
  return types;
}