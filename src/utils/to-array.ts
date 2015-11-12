export function iteratorToArray(iterator:Iterator<any>):Array<any> {
	let k, result:Array<any> = [];
	if (iterator.next) {
		while (!(k = iterator.next()).done) {
			result.push(k.value);
		}
	}
	return result;
}