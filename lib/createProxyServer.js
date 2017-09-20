"use strict";

const EventEmitter = require( `events` );
const handleImage = require( `./handleImage` );
const http = require( `http` );
const httpProxy = require( `http-proxy` );
const https = require( `https` );
const { parseUrl } = require( `./utils` );
const { Socket } = require( `net` );
const uuid = require( `uuid/v4` );

const rTweenPics = /^http:\/\/i[1-5]?\.tween\.pics(?::80)?$|^https:\/\/i[1-5]?\.tween\.pics(?::443)?$/;

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

module.exports = ( config, handlers ) => {
    const instance = new EventEmitter();
    const redirectors = new Map();
    const tweenPicsLocation = {
        "hostname": `localhost`,
        "port":
            https
                .createServer( config.credentials, ( request, response ) => {
                    const { url } = request;
                    const urlToLog = `https://i.tween.pics${ url }`;
                    const parsedUrl = parseUrl( url );
                    const { path } = parsedUrl;
                    const redirector = redirectors.get( path );
                    if ( redirector ) {
                        instance.emit( `take`, urlToLog );
                        redirectors.delete( path );
                        const location = redirector();
                        response.writeHead( 307, {
                            location,
                        } );
                        response.end();
                    } else {
                        const target = handleImage( config, parsedUrl, request.headers, response );
                        if ( target ) {
                            instance.emit( `pass`, urlToLog );
                            passThrough.web( request, response, {
                                target,
                            } );
                        } else {
                            instance.emit( `take`, urlToLog );
                        }
                    }
                } )
                .listen()
                .address().port,
    };
    instance.addRedirector = notifier => {
        let id;
        do {
            id = `/proxy/${ uuid() }`;
        } while ( redirectors.has( id ) );
        redirectors.set( id, notifier );
        return `https://i.tween.pics${ id }`;
    };
    instance.hostname = `localhost`;
    instance.port =
        http
            .createServer( ( request, response ) => {
                const { url, headers } = request;
                let target = `http://${ headers.host }`;
                if ( rTweenPics.test( target ) ) {
                    instance.emit( `take`, url );
                    target = handleImage( config, parseUrl( url ), headers, response );
                }
                if ( target ) {
                    instance.emit( `pass`, url );
                    passThrough.web( request, response, {
                        target,
                    } );
                }
            } )
            .on( `connect`, ( request, socket, head ) => {
                const { "headers": { host }, httpVersion } = request;
                const target = `https://${ host }`;
                const proxySocket =
                    ( new Socket() )
                        .on( `data`, chunk => socket.write( chunk ) )
                        .on( `end`, () => socket.end() )
                        .on( `error`, () => {
                            socket.write( `HTTP/${ httpVersion } 500 Connection error\r\n\r\n` );
                            socket.end();
                        } );
                socket
                    .on( `data`, chunk => proxySocket.write( chunk ) )
                    .on( `end`, () => proxySocket.end() )
                    .on( `error`, () => proxySocket.end() );
                const handle = () => {
                    proxySocket.write( head );
                    socket.write( `HTTP/${ httpVersion } 200 Connection established\r\n\r\n` );
                };
                const toTake = rTweenPics.test( target );
                const { hostname, port } = toTake ? tweenPicsLocation : parseUrl( target );
                if ( !toTake ) {
                    instance.emit( `pass`, `https://${ request.url }` );
                }
                proxySocket.connect( port || 443, hostname, handle );
            } )
            .listen()
            .address().port;
    if ( handlers ) {
        for ( const key in handlers ) {
            if ( handlers.hasOwnProperty( key ) ) {
                instance.on( key, handlers[ key ] );
            }
        }
    }
    return instance;
};
