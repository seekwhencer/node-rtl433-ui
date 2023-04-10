import App from './app.js';

new App().then(() => {
    LOG('');
    LOG('//////////////////');
    LOG('RUNNING:', PACKAGE.name);
    LOG('VERSION:', PACKAGE.version);
    LOG('ENVIRONMENT:', ENVIRONMENT);
    LOG('/////////');
    LOG('');
});
