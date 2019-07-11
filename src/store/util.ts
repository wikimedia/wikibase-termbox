/**
 * @param namespacesAndName namespace1, namespace2, ..., mutationOrActionName
 */
function namespaceJoin( ...namespacesAndName: string[] ): string {
	return namespacesAndName.join( '/' );
}

export const action = namespaceJoin;
export const mutation = namespaceJoin;
export const getters = namespaceJoin;
