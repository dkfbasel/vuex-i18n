import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';

// import the vuex-i18n plugin
import vuexI18n from '../../src/index';

// create a local vue insance
const localVue = createLocalVue();

// initialize vuex on the local instance
localVue.use(Vuex);

// initialize a new empty store
const store = new Vuex.Store({});

// register the plugin on the main store
localVue.use(vuexI18n, { store });

// set the default and fallback locale
localVue.i18n.set('en');
localVue.i18n.fallback('en');

describe('vuex-i18n', () => {
  beforeEach(() => {
    localVue.i18n.reset();
  });

  it('render default string if store is empty', () => {
    // define the message to be used
    const message = 'This is my first test string';

    // initialize a component with the message
    const component = localVue.component('test', {
      template: `<div>{{$t('${message}')}}</div>`,
    });

    // mount the component with our store and local vue instance
    const wrapper = shallowMount(component, { store, localVue });

    // check if the message matches
    expect(wrapper.text()).toMatch(message);
  });
});
