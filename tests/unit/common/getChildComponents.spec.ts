import Vue from 'vue';
import getChildComponents from '@/common/getChildComponents';

/* tslint:disable:max-classes-per-file */

describe( 'getChildComponents', () => {

	it( 'adds the root component', () => {
		const Root = Vue.extend( { name: 'Root' } );

		expect( getChildComponents( new Root() ) ).toEqual( [ Root ] );
	} );

	it( 'adds children of the root component', () => {
		const Child1 = Vue.extend( { name: 'Child1' } );
		const Root = Vue.extend( { name: 'Root', components: { Child1 } } );

		expect( getChildComponents( new Root() ) ).toEqual( [ Child1, Root ] );
	} );

	it( 'recursively gets child components', () => {
		const NestedChild = Vue.extend( { name: 'NestedChild' } );
		const Child1 = Vue.extend( { name: 'Child1', components: { NestedChild } } );
		const Child2 = Vue.extend( { name: 'Child2', components: { NestedChild } } );
		const Root = Vue.extend( { name: 'Root', components: { Child1, Child2 } } );

		const allChildren = getChildComponents( new Root() );
		expect( allChildren ).toHaveLength( 4 );
		[ Root, Child1, Child2, NestedChild ].forEach( ( c ) => expect( allChildren ).toContain( c ) );
	} );

} );
