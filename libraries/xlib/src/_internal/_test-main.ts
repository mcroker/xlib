//entrypoint into all tests.


/** see: https://webpack.js.org/guides/dependency-management/#requirecontext */
declare interface IRequireContextResolve {
	resolve: ( key: string ) => string;
	keys: () => string[];
	id: string;

	/** A context module exports a (require) function that takes one argument: the request. */
	( path: string ): never
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare interface NodeRequire {
	/** for running in a browser viw webpack + mocha-loader.   
	 * @remarks
	 * see: https://github.com/webpack-contrib/mocha-loader and https://webpack.js.org/guides/dependency-management/#requirecontext
*/
	context: ( directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string ) => IRequireContextResolve
}


//bootstrap mocha, as per: https://mochajs.org/#running-mocha-in-the-browser
require( "mocha" )
mocha.setup( "bdd" )


//load up all test files following general advice from: https://stackoverflow.com/questions/32385219/mocha-tests-dont-run-with-webpack-and-mocha-loader
{
	const foundTestsRequire = require.context( "..", true, /.*\.test\.js?$/ )
	//console.log( `keys found = ${ foundTestsRequire.keys().length }` )
	for ( const key of foundTestsRequire.keys() ) {
		console.log( key )
		foundTestsRequire( key )
	}
}

//run tests
mocha.run()