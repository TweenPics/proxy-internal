"use strict";

const handleImage = require( `./handleImage` );
const http = require( `http` );
const httpProxy = require( `http-proxy` );
const { parseUrl } = require( `./utils` );

const passThrough =
    httpProxy
        .createProxyServer()
        .on( `error`, ( error, request, response ) => {
            if ( response.headersSent ) {
                response.end();
            } else {
                response.statusCode = 502;
                response.end( JSON.stringify( error, null, `  ` ) );
            }
        } );

const rProtocol = /^https?:\/\//;

module.exports = config => ( {
    "hostname": `localhost`,
    "port":
        http
            .createServer( ( request, response ) => {
                // since we can be called by another host
                // let's cheat with the host
                const headers = Object.assign( {}, request.headers, {
                    "host": config.origin.replace( rProtocol, `` ),
                } );
                const target = handleImage( config, parseUrl( request.url ), headers, response );
                if ( target ) {
                    passThrough.web( request, response, {
                        target,
                    } );
                }
            } )
            .listen()
            .address().port,
} );
