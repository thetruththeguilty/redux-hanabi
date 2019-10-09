import { createHanabiFetchMiddleware } from './hanabiFetch'

interface IAction<T, R> {
  type: T,
  payload: R,
  stateKey?: string,
  meta?: any,
}

type THanabiAction = IAction<any, any> & { __stack: number }

type TFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface IFetchTypes<key> {
  error: 'error';
  success: key;
  loading: 'loading';
}

// const action = {
//   types, params, url, method,
// };
export type TFetchAction<Key, Params, Response> = IAction<Key | string, Response> & {
  types: IFetchTypes<Key>,
  url: string,
  method: TFetchMethod,
  params?: Params,
  payload?: Response
}

/**
 * the reducer use action.meta to add a function, to dispatch action,
 * for triggering the state change by state self.
 * 
 * some thing like that:
 * 
 * - tabReducer
 *   - pageReducer1
 *   - pageReducer2
 *   - pageReducer3
 * 
 * so, a certain reducer may generate an action with it's own state.
 * like fetchNext(page1, currentIndex, fetchNum).
 * 
 * @param {{stackMaxCount: number}} opts 
 */
export function createHanabi(opts: {stackMaxCount?: number} = {}) {

  const stackMaxCount = opts.stackMaxCount || 5

  const isHanabiAlive = (action: THanabiAction) => {
    if (!action.__stack) action.__stack = 0
    return action.__stack < stackMaxCount
  }

  return (store: any) => (next: any) => (action: THanabiAction) => {
    let ret = next(action);

    if (action.meta && (action.meta instanceof Function) && isHanabiAlive(action)) {

      let hanabi = action.meta()
      if (hanabi && (typeof hanabi === "object") && hanabi.type) {
        hanabi.__stack = action.__stack + 1
        // if u use rx-observable, a new action will appear in stream
        return store.dispatch(hanabi)
      }
      else if (hanabi instanceof Promise) {
        // if the return is a promise then replace the return value
        return hanabi.then(ret => {
          ret.__stack = action.__stack + 1
          return store.dispatch(ret)
        })
      }
    }

    return ret
  };
}


export function createFetchMiddleware(
  fn: (action: TFetchAction<any, any, any>) => Promise<TFetchAction<any, any, any>>
) {
  return createHanabiFetchMiddleware("@fetch", fn)
}

// types generator is inspired by iron-redux

type F<T> = { [key in keyof T]: { success: key; error: 'error'; loading: 'loading' } };
type B<T> = { [key in keyof T]: key };

const LOADING_SUFFIX = '_loading';
const SUCCESS_SUFFIX = '_success';
const ERROR_SUFFIX = '_error';

/**
 * create types
 */
export function composeTypes<T1, T2>(config: { prefix: string; BasicTypes: T1; FetchTypes: T2 }): B<T1> & F<T2> {
  const { prefix, BasicTypes: actionTypes = {}, FetchTypes: fetchActionTypes = {} } = config;

  const types = { ...(actionTypes as any), ...(fetchActionTypes as any) };

  const res = {} as any;

  Object.keys(types).forEach(property => {
    if (fetchActionTypes.hasOwnProperty(property)) {
      let result = [] as any;

      result = [
        prefix + property + LOADING_SUFFIX,
        prefix + property + SUCCESS_SUFFIX,
        prefix + property + ERROR_SUFFIX
      ];

      result.loading = result[0];
      result.success = result[1];
      result.error = result[2];

      res[property] = result;
      return;
    }

    res[property] = prefix + property;
  });

  return res;
}

export type ActionCreator<T> = <S>(type: S) => (params?: T) => { type: S; payload: T };

const identify = (arg: any) => arg;

/**
 * create action
 */
export function createAction<T>(type: T, stateKey = '') {
  return <P, R = P>(fn: (params?: P) => R = identify) =>
    function (params?: P, meta?: any): IAction<T, R> {
      if (stateKey) {
        return {
          type, stateKey, payload: fn(params), meta
        };
      }
      return {
        type, payload: fn(params), meta
      };
    };
}

// let fetchAction = {
//   stateKey: 'state key',
//   types: {
//     loading: 'testIron/fetchData_LOADING',
//     success: 'testIron/fetchData_SUCCESS',
//     error: 'testIron/fetchData_ERROR'
//   },
//   meta: undefined,
//   params: 'asdf',
//   url: '/api/data',
//   method: 'GET'
// }

/**
 * create fetch action,
 */
export function createFetchAction<Key>(
  types: IFetchTypes<Key>,
  url: string,
  method: TFetchMethod = 'GET',
  fetchTypeName: string = '@fetch'
) {
  return <Params, Response>(stateKey?: string) => (params?: Params, meta?: any): TFetchAction<Key, Params, Response | undefined> => {
    return {
      stateKey, types, meta, params, url, method, type: fetchTypeName, payload: undefined,
    };
    // return action // as typeof action & { type: Key; payload?: Response }
  };
}

/**
 * get the state type from reducer map
 */
export type ReturnState<ReducerMap> = {
  [key in keyof ReducerMap]: ReducerMap[key] extends (state: any, action: any) => infer R ? R : any
};

type ValueOf<T> = T[keyof T];

/**
 * get the action type
 * stateKey is used to distinct the state which to handle the api fetch
 */
export type ActionType<Actions> =
  | ValueOf<{ [key in keyof Actions]: Actions[key] extends (...args: any[]) => infer R ? R : never }>
  | ValueOf<{ [key in keyof Actions]: Actions[key] extends (arg: never, ...args: any[]) => infer R ? R : never }>
  | {
      type: 'error';
      payload?: { message: string; [key: string]: any };
      params?: any; meta?: any; stateKey?: string
    }
  | { type: 'loading'; payload?: any; params?: any; meta?: any, stateKey?: string };