export default function mockMessageMixin( messages: { [key: string]: string } = {} ) {
	return {
		methods: {
			message( key: string ) {
				return messages[ key ] || '';
			},
		},
	};
}
