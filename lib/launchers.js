"use strict";

const { accessible, ensureDirectory } = require( `./utils` );
const { spawn } = require( `child_process` );

class UninstallableError extends Error {}

const launcherFactory = async ( id, karmaModule, karmaId, optionsGenerator ) => {
    const [ , KarmaClass ] = karmaModule[ `launcher:${ karmaId }` ];
    const { DEFAULT_CMD, ENV_CMD } = KarmaClass.prototype;
    const command = process.env[ ENV_CMD ] || DEFAULT_CMD[ process.platform ];
    if ( !command ) {
        throw new UninstallableError( `${ id } is not available on this platform` );
    }
    if ( !( await accessible( command ) ) ) {
        throw new Error( `${ id } is not installed or not accessible` );
    }
    const profilePath = await ensureDirectory( `profiles`, id );
    return ( url, proxyServer, handlers ) => {
        let child;
        const toInject = new Map( [
            [
                `args`,
                optionsGenerator( profilePath, proxyServer ),
            ],
            [
                `baseBrowserDecorator`,
                self => {
                    self._execCommand = ( cmd, flags ) => ( child = spawn( cmd, flags ) );
                    self._getCommand = () => command;
                    self._start = target => self._execCommand( self._getCommand(), self._getOptions( target ) );
                },
            ],
        ] );
        const parameters = KarmaClass.$inject.map( name => toInject.get( name ) );
        const karmaLauncher = new KarmaClass( ...parameters );
        karmaLauncher._start( proxyServer.addRedirector( () => {
            child.emit( `unsecuredAccepted` );
            return url;
        } ) );
        if ( handlers ) {
            for ( const key in handlers ) {
                if ( handlers.hasOwnProperty( key ) ) {
                    child.on( key, handlers[ key ] );
                }
            }
        }
        child.emit( `created`, child.pid );
    };
};

module.exports = Promise.all( [
    [
        require( `karma-chrome-launcher` ),
        [
            [ `chrome`, `Chrome`, `Google Chrome` ],
            [ `chrome-canary`, `ChromeCanary`, `Google Chrome Canary` ],
            [ `chromium`, `Chromium`, `Chromium` ],
            [ `dartium`, `Dartium`, `Dartium` ],
        ],
        ( profilePath, { hostname, port } ) => ( {
            "chromeDataDir": profilePath,
            "flags": [ ` --proxy-server=http=${ hostname }:${ port };https=${ hostname }:${ port }` ],
        } ),
    ],
    [
        require( `karma-firefox-launcher` ),
        [
            [ `firefox`, `Firefox`, `Mozilla Firefox` ],
            [ `firefox-aurora`, `FirefoxAurora`, `Mozilla Firefox Aurora` ],
            [ `firefox-dev`, `FirefoxDeveloper`, `Mozilla Firefox Developer Edition` ],
            [ `firefox-nightly`, `FirefoxNightly`, `Mozilla Firefox Nightly` ],
        ],
        ( profilePath, { hostname, port } ) => ( {
            "profile": profilePath,
            "prefs": {
                "network.proxy.http": hostname,
                "network.proxy.http_port": port,
                "network.proxy.ssl": hostname,
                "network.proxy.ssl_port": port,
                "network.proxy.type": 1,
            },
        } ),
    ],
].reduce( ( array, [ karmaModule, karmaIds, optionsGenerator ] ) => {
    karmaIds.forEach(
        ( [ id, karmaId, name ] ) =>
            array.push( launcherFactory( id, karmaModule, karmaId, optionsGenerator ).then(
                launcher => ( {
                    id,
                    "installable": true,
                    launcher,
                    "launcherError": null,
                    name,
                } ),
                launcherError => ( {
                    id,
                    "installable": !( launcherError instanceof UninstallableError ),
                    "launcher": null,
                    launcherError,
                    name,
                } )
            ) )
    );
    return array;
}, [] ) ).then( all => {
    const launchers = new Map( all.map( item => [ item.id, item ] ) );
    return {
        "get": id => {
            const { launcher, launcherError } = launchers.get( id ) || {
                "launcherError": new Error( `${ id } is not a known browser` ),
            };
            if ( launcherError ) {
                throw launcherError;
            }
            return launcher;
        },
        "getAll": exists => (
            exists == null ?
                all :
                all.filter( ( { launcher } ) => ( exists ? launcher : !launcher ) )
        ),
    };
} );
