import * as xlib from "xlib"

const x = {}

	; ( () => { return "hi" } )()





describe( "Example Test", () => {
	it( "correctly runs a test", () => {

		//const result = xlib.hello
		//console.log( `xlib result hello=${ result } ${ x }` )
		expect( xlib.util.enumHelper != null ).toBeTruthy()
	} )
} )