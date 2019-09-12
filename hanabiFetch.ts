interface IAction<T, R> {
  type: T,
  payload: R,
  stateKey?: string,
  meta?: any,
}

export type TFetchAction<Key, Params, Response> = IAction<Key | string, Response> & {
  types: IFetchTypes<Key>,
  url: string,
  method: TFetchMethod,
  params?: Params,
  payload?: Response
}

type TFetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface IFetchTypes<Key> {
  error: 'error';
  success: Key;
  loading: 'loading';
}

export function createHanabiFetchAction<Key>(opts: {
  types: IFetchTypes<Key>,
  url: string,
  method?: TFetchMethod,
  fetchTypeName?: string,
}) {

  let types = opts.types
  let url = opts.url
  let method = opts.method || 'GET'
  let fetchTypeName = opts.fetchTypeName || '@fetch'

  return <Params, Response>(stateKey: string) =>
    (params?: Params, meta?: any): TFetchAction<Key, Params, Response | undefined> => {
      return {
        type: fetchTypeName, stateKey, types, meta, params, url, method, payload: undefined,
      };
  };
}

export function createHanabiFetch(
  typeName: string,
  fn: (action: TFetchAction<any, any, any>) => Promise<TFetchAction<any, any, any>>
) {
  return (store: any) => (next: any) => (action: TFetchAction<any, any, any>): any => {
    if (action.type === typeName) {
      // dispatch a loading action
      action.type = action.types.loading
      store.dispatch(action)
      return fn(action)
        .then(ret => {
          if (ret.type === ret.types.success || ret.type === ret.types.error) {
            return store.dispatch(ret)
          }
          ret.type === ret.types.error
          ret.payload = `${typeName} error, return type must be success or error`
          return store.dispatch(ret)
        })
    }
    else {
      return next(action)
    }
  }
}