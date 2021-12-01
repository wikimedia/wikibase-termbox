import { storiesOf } from '@storybook/vue3';
import Modal from '@/components/Modal.vue';

storiesOf( 'Modal', module )
	.addParameters( { component: Modal } )
	.add( 'default', () => ( {
		components: { Modal },
		template: `<Modal>
			<p>Nullam pharetra lacus vel urna elementum posuere. Nunc volutpat mattis augue. Sed eu enim vitae dui malesuada sodales et eget mi. Maecenas molestie fringilla eros, quis eleifend tortor dignissim eu. Integer elementum sodales neque, vitae venenatis justo. In molestie fermentum tortor, quis ornare elit dictum eget. Aliquam accumsan placerat ornare. Suspendisse mollis nibh eu lectus laoreet venenatis. Nulla dignissim ultrices magna, eu viverra ipsum semper nec. Fusce viverra aliquam vehicula. Curabitur maximus posuere maximus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus nec laoreet nulla. Aliquam convallis quam mauris, non posuere urna mattis eget. Ut rhoncus venenatis dui, sit amet sollicitudin quam lobortis sit amet.</p>
		</Modal>`,
	} ) )
	.add( 'very little content', () => ( {
		components: { Modal },
		template: '<Modal>hi</Modal>',
	} ) );
