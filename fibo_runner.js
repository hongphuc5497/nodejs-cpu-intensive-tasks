const fibonacci = (num) => {
	if (num < 2) return num;

	return fibonacci(num - 1) + fibonacci(num - 2);
};

process.on('message', (msg) => {
	'use strict';

	process.send({
		value: fibonacci(parseInt(msg.num)),
		event: msg.event,
	});
});
