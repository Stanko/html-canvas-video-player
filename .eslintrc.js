module.exports = {
	"parser": "babel-eslint",
	"extends": ["google"],
	"rules": {
		"max-len": [2, 120, 2],
		"indent": [2, "tab",{
			"SwitchCase": 1
		}],
		"camelcase": [2, {
			"properties": "never"
		}],
		"require-jsdoc": 0,
		"arrow-parens": 0,
		"no-invalid-this": 0,
		"no-debugger": 1
	},
	"env": {
		"browser": true,
		"mocha": true
	},
	"globals": {
		"VERSION": true,
		"LIBRARY_NAME": true,
		"IS_LOC": true,
		"IS_DEV": true,
		"IS_PROD": true
	}
};
