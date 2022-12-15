const http = require('http');
const { fork } = require('child_process');
const child = fork(`${__dirname}/fibo_runner.js`);

let { EventEmitter } = require('events');
let event = new EventEmitter();

const server = http.createServer((req, res) => {
	'use strict';

	if (req.url === '/fibo') {
		let rand = Math.random() * 100;

		child.send({
			num: req.headers.fibo,
			event: rand,
		});

		event.once(rand, (val) => res.end(`${val}`));
	} else {
		res.end('Wrong URL: ' + req.url);
	}
});

child.on('message', (msg) => {
	event.emit(msg.event, msg.value);
});

server.listen(8888, () => console.log('server running...'));
