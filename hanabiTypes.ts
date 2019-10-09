type F<T> = { [key in keyof T]: {
  success: key; error: 'error'; loading: 'loading', clear: 'clear', refresh: 'refresh', save: 'save'
} };

type B<T> = { [key in keyof T]: key };

const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';
const CLEAR_SUFFIX = '_clear'; // clear-able state
const REFRESH_SUFFIX = '_refresh';
const SAVE_SUFFIX = '_save';

/**
 * create types
 */
export function composeTypes<T1, T2>(config: { prefix: string; BasicTypes: T1; FetchTypes: T2 }): B<T1> & F<T2> {
  const { prefix, BasicTypes: actionTypes = {}, FetchTypes: fetchActionTypes = {} } = config;

  const types = { ...(actionTypes as any), ...(fetchActionTypes as any) };

  const res = {} as any;

  Object.keys(types).forEach(property => {
    if (fetchActionTypes.hasOwnProperty(property)) {
      let result = {} as any;

      result.loading = prefix + property + LOADING_SUFFIX;
      result.success = prefix + property + SUCCESS_SUFFIX;
      result.error = prefix + property + ERROR_SUFFIX;
      result.clear = prefix + property + CLEAR_SUFFIX;
      result.refresh = prefix + property + REFRESH_SUFFIX;
      result.save = prefix + property + SAVE_SUFFIX;

      res[property] = result;
      return;
    }
    res[property] = prefix + property;
  });

  return res;
}