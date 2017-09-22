"use strict";

const { resolve } = require( `path` );
const { readFile } = require( `fs` );

const readCredentialsFile = type => new Promise(
    ( fulfill, reject ) =>
        readFile(
            resolve( __dirname, `credentials`, `.${ type }` ),
            ( error, content ) => ( error ? reject( error ) : fulfill( content ) )
        )
);

const credentials = Promise.all( [
    readCredentialsFile( `cert` ),
    readCredentialsFile( `key` ),
] ).then( ( [ cert, key ] ) => ( {
    cert,
    key,
} ) );

module.exports = async () => ( {
    "authent": process.env.TWEENPICS_AUTHENT || null,
    "browser": `chrome`,
    "credentials": await credentials,
    "origin": process.env.TWEENPICS_PROXY_ORIGIN || `https://i.tween.pics`,
    "start": `https://www.tweenpics.com`,
} );
