import { storiesOf } from '@storybook/vue3';
import Overlay from '@/components/Overlay.vue';
import Modal from '@/components/Modal.vue';
import IndeterminateProgressBar from '@/components/IndeterminateProgressBar.vue';

storiesOf( 'Overlay', module )
	.addParameters( { component: Overlay } )
	.add( 'default', () => ( {
		components: { Overlay },
		template: `<div>
			<h1>Text underneath the overlay</h1>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
			<Overlay />
		</div>`,
	} ) )
	.add( 'with a modal', () => ( {
		components: { Overlay, Modal },
		template: `<div>
			<h1>Text underneath the overlay</h1>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
			<Overlay>
				<Modal>Modals and Overlays integrate nicely.</Modal>
			</Overlay>
		</div>`,
	} ) )
	.add( 'with an indeterminate progress bar', () => ( {
		components: { Overlay, IndeterminateProgressBar },
		template: `<div>
			<h1>Text underneath the overlay</h1>
			<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
			<Overlay>
				<IndeterminateProgressBar />
			</Overlay>
			</div>`,
	} ) );
