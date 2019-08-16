// interface for all i18nMethods
export interface i18nMethods {

  /**
   * the current locale from the vuex store
   */
  locale(): string;

  /**
   * get all the registered locales */
  locales(): string[];

  /**
   * check if the given locale is registered in the store
   */
  localeExists(locale: string): boolean;

  /**
   * set the current locale (i.e. 'en', 'de', 'de-CH')
   */
  set(locale: string): void;

  /**
   * add locale translation to the storage. this will extend existing information
   * (i.e. 'de', {'message': 'Eine Nachricht'})
   */
  add(locale: string, translations: object): void;

  /**
   * replace locale translations in the storage. this will remove all previous
   * locale information for the specified locale
   */
  replace(locale: string, translations: object): void;

  /**
   * remove the given locale from the store
   */
  remove(locale: string): void;

  /** set the fallback locale to be used if the current locale
   * cannot be found
   */
  fallback(locale: string): void;

  /**
   * check if the given key exists
   * */
  keyExists(key: string, scope: string): void;

  /**
   * translate the given message in the current locale
   */
  translate(): any;

  /**
   * translate the given message in the specified locale
   */
  translateIn(locale: string, _key?: string, _args?: any[]): any;

  /**
   * reset the translations for the given locale or for all locales
   * if no locale is given
   */
  reset(locale?: string): void;
}

// separate interface for translate function
export interface translateFn {
  (): any;
}

// separate interface for translateInFn
export interface translateInFn {
  (locale: string, _key?: string, _args?: any[]): any;
}

// separate interface for function to be called if
// no translation was found
export interface onTranslationNotFoundFn {
  (locale: string, key: string, defaultValue: string): any;
}
