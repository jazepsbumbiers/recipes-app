const openInEditor = require('launch-editor-middleware');

module.exports = {
    devServer: {
        setup (app) {
            app.use('/__open-in-editor', openInEditor('code'))
        },
    },
};