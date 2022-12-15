const http = require('http');
const Pool = require('./pool');
const Queue = {};

const fibonacciRunnerPath = `${__dirname}/fibo_runner.js`;
const MAX_POOL = 5;
const handleMessage = (msg) => {
	'use strict';
	let queue = [...Queue[msg.event]];

	Queue[msg.event] = null;
	queue.forEach((cb) => cb(msg.num));

	console.log(`done with ${msg.event}`);
};

const ServerPool = new Pool(fibonacciRunnerPath, MAX_POOL, handleMessage);

function asyncBatching(num, cb) {
	if (Queue[num]) {
		Queue[num].push(cb);
	} else {
		Queue[num] = [cb];
		ServerPool.assignWork({
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

server.listen(8888, () => console.log('server running...'));
