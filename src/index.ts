import "symbol-observable";

/**
 * @file modular-engine global types definitions
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */

export interface Unsubscribe {
  (): void;
}

/**
 * modular-engine standard action
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineAction<T = any> = ModularEngineCustomState<{
  type: string;
  payload?: T;
  error?: boolean;
}>;

/**
 * modular-engine generic action
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export interface ModularEngineGenericAction extends ModularEngineAction {
  [extraProps: string]: any;
}

/**
 * modular-engine standard action creator
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineActionCreator<T = any> = ((
  ...args
) => ModularEngineAction<T>) & {
  type: string;
  match: (action: ModularEngineActionCreator) => boolean;
};

/**
 * modular-engine standard dispatch function
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export interface ModularEngineDispatch<
  A extends ModularEngineAction = ModularEngineGenericAction
> {
  <T extends A>(action: T): T;
}

export interface MiddlewareAPI<
  S = any,
  D extends ModularEngineDispatch = ModularEngineDispatch
> {
  dispatch: D;
  getState(): S;
}

export interface Middleware<
  S = any,
  D extends ModularEngineDispatch = ModularEngineDispatch
> {
  (api: MiddlewareAPI<S, D>): (
    next: ModularEngineDispatch<ModularEngineGenericAction>
  ) => (action: ModularEngineGenericAction) => ModularEngineGenericAction;
}

export type Observable<T> = {
  subscribe: (observer: { next?(value: T): void }) => {
    unsubscribe: Unsubscribe;
  };
  [Symbol.observable](): Observable<T>;
};

export interface ModularEngineStore<
  S = any,
  A extends ModularEngineAction = ModularEngineAction
> {
  dispatch: ModularEngineDispatch<A>;

  getState(): S;

  subscribe(listener: () => void): Unsubscribe;

  replaceReducer(nextReducer: ModularEngineReducer<S>): void;

  [Symbol.observable](): Observable<S>;
}

/**
 * Set all properties of the given type to optional
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * modular-engine custom state
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineCustomState<T extends Record<string, any> = {}> = T &
  Record<string, any>;

/**
 * Modular-engine internal global state
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineGlobalState<
  T extends Record<string, any> = {},
  K extends Record<string, any> = {}
> = ModularEngineCustomState<
  {
    config: ConfigState<K>;
  } & T
>;

/**
 * modular-engine custom trigger, converted into a specific reducer case
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineEffect<T = any> = {
  trigger: string;
  effect: (state: T, action: ModularEngineAction) => T;
};

/**
 * modular-engine custom reducer cases
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineReducerCases<T = any> = Record<
  string,
  ModularEngineEffect<T>["effect"]
>;

/**
 * modular-engine custom reducer
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineReducer<T extends Record<string, any> = {}> = (
  state: T,
  action: ModularEngineAction
) => T;

/**
 * modular-engine custom middleware
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineMiddleware = (
  action: ModularEngineAction,
  store: MiddlewareAPI
) => void;

/**
 * modular-engine custom reducer config
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineCustomConfig<T = any> = {
  effects?: ModularEngineEffect<T>[];
  state?: Record<string, string>;
};

/**
 * modular-engine configuration parameters
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineConfig = ModularEngineCustomState<{
  appName?: string;

  debug?: boolean;

  /** Redux parameters */
  redux?: {
    /** Additional states and reducers to customize internal redux system */
    customize?: ModularEngineCustomState<{
      /** Additional parameters that will be included inside config state slice */
      config?: ModularEngineCustomState;
    }>;

    /** Custom modular reducers */
    reducers?: Record<string, ModularEngineReducer<any>>;

    /** Preloaded initial state */
    preload?: Record<string, any>;

    /** Custom modular middlewares */
    middlewares?: ModularEngineMiddleware[];

    /** Custom redux middlewares */
    reduxMiddlewares?: Middleware[];
  };

  /** Feature flags, to enable or disable speicific modular-engine features */
  features?: Record<string, boolean>;

  /** Additional plugins to load */
  plugins?: ModularEnginePlugin[];
}>;

/**
 * modular-engine custom plugin
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEnginePlugin<
  T extends Record<string, any> = {},
  K = any
> = () => {
  feature?: string;

  create?: (config: ModularEngineConfig & T) => {
    field: string;
    content?: ModularEngineCustomState<T>;
  };

  format?: ModularEngineFormatter<T>;

  before?: ModularEngineParser<T, K>;

  preInit?: (
    config: ModularEngineConfig,
    enabledPlugins: Record<string, boolean>
  ) => void;

  redux?: (config: ModularEngineConfig) => {
    reducerCases: ModularEngineReducerCases<K>;
    reducer?: ModularEngineReducer;
    slice: string;
    initialState?: ModularEngineCustomState<K>;
  };
  postInit?: (
    config: ModularEngineConfig,
    store: ModularEngineStore,
    enabledPlugins: Record<string, boolean>
  ) => void;

  after?: ModularEngineParser<T, K>;
};

/**
 * modular-engine custom config parser
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineParser<
  T extends Record<string, any> = {},
  K = any
> = ({
  store,
  config,
}: {
  config: ModularEngineConfig & K;
  store?: ModularEngineStore;
} & T) => ModularEngineConfig & K;

/**
 * modular-engine custom config formatter
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ModularEngineFormatter<T extends Record<string, any> = {}> = (
  config: ModularEngineConfig & T,
  enabledPlugins: Record<string, boolean>
) => ModularEngineConfig & T;

/**
 * modular-engine `config` state slice
 *
 * @author Cataldo Cianciaruso <https://github.com/CianciarusoCataldo>
 *
 * @copyright Cataldo Cianciaruso 2022
 */
export type ConfigState<T extends Record<string, any> = {}> =
  ModularEngineCustomState<
    Omit<ModularEngineConfig, "redux" | "features" | "plugins" | "debug"> & T
  >;
