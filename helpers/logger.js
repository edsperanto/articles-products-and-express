const fs = require('fs');
module.exports = function(req, res, next) {
	let time = new Date();
	let year = time.getFullYear();
	let month = time.getMonth() + 1;
	let date = time.getDate();
	let hour = time.getHours();
	let minute = time.getMinutes();
	let second = time.getSeconds();
	let millisecond = time.getMilliseconds();
	let fileName = `logs/${year}.${month}-${date}.${hour}-${minute}-${second}-${millisecond}.log`;
	let log = `[${req.method}] [${req.path}] [${time.getTime()}]`;
	fs.writeFile(fileName, log, 'utf8', (err) => {
		if (err) throw err;
	});
	next();
}