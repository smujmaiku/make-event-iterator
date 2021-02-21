/*!
 * Make Event Iterator <https://github.com/smujmaiku/make-event-iterator>
 * Copyright(c) 2021 Michael Szmadzinski
 * MIT Licensed
 */

import justDefer from 'just-defer';

interface EventIteratorOptsI {
	dataName?: string;
	endName?: string;
	errorName?: string;
}

function makeEventIterator<T = unknown>(emitter: any, opts = {} as EventIteratorOptsI): AsyncGenerator<T | undefined, void, unknown> {
	const {
		dataName = 'data',
		endName = 'end',
		errorName = 'error',
	} = opts;

	let defer = justDefer<T | undefined>();
	const buffer: Promise<T | undefined>[] = [];

	const setupNext = () => {
		defer = justDefer<T | undefined>();
		buffer.push(defer.promise);
	};
	setupNext();

	emitter.on(dataName, (chunk: T) => {
		const { resolve } = defer;
		setupNext();
		resolve(chunk);
	});
	emitter.on(errorName, (error: Error) => {
		const { reject } = defer;
		setupNext();
		reject(error);
	});
	emitter.on(endName, () => {
		defer.resolve(undefined);
	});

	return (async function* eventIterator() {
		while (true) {
			const chunk = await buffer.shift();
			if (buffer.length < 1) break;
			yield chunk;
		}
	})();
}

makeEventIterator.makeEventIterator = makeEventIterator;
makeEventIterator.default = makeEventIterator;
export = makeEventIterator;

makeEventIterator.READLINE = {
	dataName: 'line',
	endName: 'close',
} as EventIteratorOptsI;

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace makeEventIterator {
	export {
		EventIteratorOptsI,
	}
}
