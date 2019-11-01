interface HookHandler {
	add: ( hookCallback: ( args: unknown ) => void ) => void;
}

export default HookHandler;
