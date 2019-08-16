// define an empty interface for the root state
// as there is no root state that we can rely on
export interface RootState { }

// define the state for the i18nModule
export interface ModuleState {
  locale: string | null;
  fallback: string | null;
  translations: { [index: string]: any };
}

export const init = function init() {
  return {
    locale: null,
    fallback: null,
    translations: {},
  };
};
