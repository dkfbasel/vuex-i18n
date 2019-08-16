import { PluginObject } from 'vue';
import * as types from './vuex-i18n-plugin-types';
declare module 'vue/types/vue' {
    interface Vue {
        $i18n: types.i18nMethods;
        $t: types.translateFn;
        $tlang: types.translateInFn;
    }
    interface VueConstructor {
        i18n: types.i18nMethods;
    }
}
interface vuexI18nOptions {
    store: any;
    warnings: boolean;
    moduleName: string;
    identifiers: string[];
    preserveState: boolean;
    translateFilterName: string;
    translateInFilterName: string;
    onTranslationNotFound: types.onTranslationNotFoundFn;
}
declare const VuexI18nPlugin: PluginObject<vuexI18nOptions>;
export default VuexI18nPlugin;
