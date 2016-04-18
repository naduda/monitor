exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	capabilities: {
		'browserName': 'chrome'
	},
	specs: [
		'./test/createFirstUser.spec.js',
		'./test/updateUser.spec.js',
		'./test/deleteUser.spec.js'
	],
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
}