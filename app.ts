console.log("Hello from ts")
console.log("hihihi")
const express = require( "express" )
const app = express()
const port = 8000

app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );