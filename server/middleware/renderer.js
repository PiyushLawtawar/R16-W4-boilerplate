import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { Provider as ReduxProvider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';

// import our main App component
import App from '../../src/App';

// import the manifest generated with the create-react-app build
import manifest from '../../build/manifest.json';

export default (store) => (req, res, next) => {
    // get the html file created with the create-react-app build
    const filePath = path.resolve(process.cwd(), 'server', 'middleware', 'layout.html');

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            console.error('err', err);
            return res.status(404).end()
        }

        const modules = [];
        const routerContext = {};

        // render the app as a string
        const html = ReactDOMServer.renderToString(
            <Loadable.Capture report={m => modules.push(m)}>
                <ReduxProvider store={store}>
                    <StaticRouter location={req.baseUrl} context={routerContext}>
                        <App/>
                    </StaticRouter>
                </ReduxProvider>
            </Loadable.Capture>
        );

        // get the stringified state
        const reduxState = JSON.stringify(store.getState());

        // map required assets to script/link tags
        const mainJS = `<script type="text/javascript" src="${manifest['main.js']}"></script>`;
        const mainCSS = `<link href="${manifest['main.css']}" rel="stylesheet">`;

        // get HTML headers
        const helmet = Helmet.renderStatic();

        // now inject the rendered app into our html and send it to the client
        return res.send(
            htmlData
                // write the React app
                .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
                // write the string version of our state
                .replace('__REDUX_STATE__={}', `__REDUX_STATE__=${reduxState}`)
                // append the extra js assets
                .replace('</head>', mainCSS + '</head>')
                .replace('</body>', mainJS + '</body>')
                // write the HTML header tags
                .replace('<title></title>', helmet.title.toString() + helmet.meta.toString())
        );
    });
}
