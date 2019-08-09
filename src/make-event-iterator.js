/*!
 * Make Event Iterator <https://github.com/smujmaiku/make-event-iterator>
 * Copyright(c) 2019 Michael Szmadzinski
 * MIT Licensed
 */

/**
 * Create an iterator from an event emitter
 * @param {*} emitter Emitter to interate over
 * @param {Object} [opts={}] Options
 * @param {string} [opts.dataName="data"] Event name for the next chunk of data
 * @param {string} [opts.endName="end"] Event name when the stream is done
 * @param {string} [opts.errorName="error"] Event name when an error has occured
 */
function makeEventIterator(emitter, opts = {}) {
	const {
		dataName,
		endName,
		errorName,
	} = {
		dataName: 'data',
		endName: 'end',
		errorName: 'error',
		...opts,
	};

	let defer;
	const buffer = [];

	const setupNext = () => {
		const promise = new Promise((resolve, reject) => (defer = { resolve, reject }));
		buffer.push(promise);
	};
	setupNext();

	emitter.on(dataName, chunk => {
		const { resolve } = defer;
		setupNext();
		resolve(chunk);
	});
	emitter.on(errorName, (error) => {
		const { reject } = defer;
		setupNext();
		reject(error);
	});
	emitter.on(endName, () => {
		defer.resolve();
	});

	return (async function * eventIterator() {
		while (true) {
			const chunk = await buffer.shift();
			if (buffer.length < 1) break;
			yield chunk;
		}
	})();
}

exports = module.exports = makeEventIterator;

exports.READLINE = {
	dataName: 'line',
	endName: 'close',
};
