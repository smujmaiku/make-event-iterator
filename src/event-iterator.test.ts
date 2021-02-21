import makeEventIterator from './event-iterator';

const mockEmitter = () => {
	const list = [];
	const emit = (n, ...args) => list.filter(({ name }) => n === name).forEach(({ fn }) => fn(...args));
	const emitter = {
		on: jest.fn((name, fn) => list.push({ name, fn })),
		emit,
	};
	return emitter;
};

describe('make-event-iterator', () => {
	it('should for await chunks', async () => {
		const expects = [
			'some data',
			undefined,
			{ more: 'data' },
			4,
		];
		expect.assertions(expects.length);

		const emitter = mockEmitter();
		const gen = makeEventIterator(emitter);
		expects.forEach(chunk => {
			emitter.emit('data', chunk);
		});
		emitter.emit('end');

		for await (const chunk of gen) {
			expect(chunk).toEqual(expects.shift());
		}
	});

	it('should throw on error', async () => {
		expect.assertions(2);

		const emitter = mockEmitter();
		const gen = makeEventIterator(emitter);
		emitter.emit('data', 'first chunk');
		emitter.emit('error', new Error('emit error'));
		emitter.emit('end');

		try {
			for await (const chunk of gen) {
				expect(chunk).toEqual('first chunk');
			}
			throw new Error('it didnt throw');
		} catch (err) {
			expect(err.message).toEqual('emit error');
		}
	});
});
