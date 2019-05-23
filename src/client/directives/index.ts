import Vue from 'vue';
import inlanguage from './inlanguage';
import focus from './focus';

Vue.directive( 'inlanguage', inlanguage );
Vue.directive( 'focus', { inserted: focus } );
