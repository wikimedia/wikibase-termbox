export default interface HookHandler {
	add: ( hookCallback: ( args: any ) => void ) => void;
}
