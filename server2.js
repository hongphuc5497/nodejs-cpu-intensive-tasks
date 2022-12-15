const http = require('http');
const { fork } = require('child_process');
const child = fork(`${__dirname}/fibo_runner.js`);

let Queue = {};

function asyncBatching(num, cb) {
	if (Queue[num]) {
		Queue[num].push(cb);
	} else {
		Queue[num] = [cb];
		child.send({
			num,
			event: num,
		});
	}
}

const server = http.createServer((req, res) => {
	'use strict';

	if (req.url === '/fibo') {
		const num = parseInt(req.headers.fibo);

		asyncBatching(num, (val) => res.end(`${val}`));
	} else {
		res.end('Wrong URL: ' + req.url);
	}
});

child.on('message', (msg) => {
	'use strict';
	let queue = [...Queue[msg.event]];

	Queue[msg.event] = null;
	queue.forEach((cb) => cb(msg.num));

	console.log(`done with ${msg.event}`);
});

server.listen(8888, () => console.log('server running...'));
