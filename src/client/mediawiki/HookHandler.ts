interface HookHandler {
	add: ( hookCallback: ( args: any ) => void ) => void;
}

export default HookHandler;
