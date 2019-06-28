import { storiesOf } from '@storybook/vue';
import Modal from '@/components/Modal.vue';

storiesOf( 'Modal', module )
	.add( 'default', () => ( {
		components: { Modal },
		template: `<div>
			<h1>Text underneath the overlay</h1>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
			<Modal>
				<p>Nullam pharetra lacus vel urna elementum posuere. Nunc volutpat mattis augue. Sed eu enim vitae dui malesuada sodales et eget mi. Maecenas molestie fringilla eros, quis eleifend tortor dignissim eu. Integer elementum sodales neque, vitae venenatis justo. In molestie fermentum tortor, quis ornare elit dictum eget. Aliquam accumsan placerat ornare. Suspendisse mollis nibh eu lectus laoreet venenatis. Nulla dignissim ultrices magna, eu viverra ipsum semper nec. Fusce viverra aliquam vehicula. Curabitur maximus posuere maximus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus nec laoreet nulla. Aliquam convallis quam mauris, non posuere urna mattis eget. Ut rhoncus venenatis dui, sit amet sollicitudin quam lobortis sit amet.</p>
			</Modal>
		</div>`,
	} ) )
	.add( 'very little content', () => ( {
		components: { Modal },
		template: '<Modal>hi</Modal>',
	} ) );
