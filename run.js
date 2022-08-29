const child_process = require("child_process");

exports.run = function (command) {
	var commandBits = command.split(" ");
	var process = child_process.spawn(commandBits[0], commandBits.slice(1));

	process.stdout.on('data', (data) => {
	  console.log(data.toString());
	});

	process.stderr.on('data', (data) => {
	  console.error(data.toString());
	});
}
exports.runSync = function (command) {
	try {
		console.log(child_process.execSync(command).toString());
		return 0;
	}
	catch (error) {
		return error.status;
	}
}