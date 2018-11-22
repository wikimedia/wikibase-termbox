import Vue from 'vue';
import getChildComponents from '@/common/getChildComponents';
import Component from 'vue-class-component';

/* tslint:disable:max-classes-per-file */

describe( 'getChildComponents', () => {

	it( 'adds the root component', () => {
		class Root extends Vue {
		}

		expect( getChildComponents( new Root() ) ).toEqual( [ Root ] );
	} );

	it( 'adds children of the root component', () => {
		class Child1 extends Vue {
		}

		@Component( {
			components: { Child1 },
		} )
		class Root extends Vue {
		}

		expect( getChildComponents( new Root() ) ).toEqual( [ Child1, Root ] );
	} );

	it( 'recursively gets child components', () => {
		class NestedChild extends Vue {
		}

		@Component( {
			components: { NestedChild },
		} )
		class Child1 extends Vue {
		}

		class Child2 extends Vue {
		}

		@Component( {
			components: { Child1, Child2 },
		} )
		class Root extends Vue {
		}

		const allChildren = getChildComponents( new Root() );
		expect( allChildren ).toHaveLength( 4 );
		[ Root, Child1, Child2, NestedChild ].forEach( ( c ) => expect( allChildren ).toContain( c ) );
	} );

} );
