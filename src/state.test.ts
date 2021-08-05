import { State8 } from './state';

test('getting correct temp from binary', () => {
	const s9 = new State8(
		'55000020000000000000000000000000010000000000010000003500000000000000010000010042010000000000000000FF000000000000000038000000000000000000000000000000000000000000',
	);

	// 35 hex = 53
	// 53 is 26.5 because it's using halfs
	expect(s9.temperature).toBe(26.5);
});

test('setting and getting temp from binary', () => {
	const s9 = new State8(
		'55000020000000000000000000000000010000000000010000003500000000000000010000010042010000000000000000FF000000000000000038000000000000000000000000000000000000000000',
	);

	s9.temperature = 22;
	expect(s9.temperature).toBe(22);

	const statesplit = s9.state.split('');
	expect(statesplit[6]).toBe('2');

	// 22 + 16 = 38
	// 38 * 2 = 76
	// 76 = 0x4C
	expect(statesplit[0]).toBe('4');
	expect(statesplit[1]).toBe('c');
});

test('setting and getting temp from binary with uneven values', () => {
	const s9 = new State8(
		'55000020000000000000000000000000010000000000010000003500000000000000010000010042010000000000000000FF000000000000000038000000000000000000000000000000000000000000',
	);

	s9.temperature = 22.3;
	expect(s9.temperature).toBe(22);

	s9.temperature = 22.6;
	expect(s9.temperature).toBe(22.5);

	s9.temperature = 22.8;
	expect(s9.temperature).toBe(22.5);
});
