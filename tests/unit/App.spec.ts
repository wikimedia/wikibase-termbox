import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';

describe( 'App.vue', () => {
  it( 'renders hello world', () => {
    const wrapper = shallowMount( App );
    expect( wrapper.text() ).toMatch( 'Hello world!' );
  } );
} );