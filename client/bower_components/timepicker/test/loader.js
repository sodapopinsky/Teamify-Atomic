mocha.setup({
    ui: 'bdd',
    globals: ['jQuery']
});
require(['jquery', '../../underscore/underscore', 'moment', 'timepicker.tests.js'], function(){
    'use strict';
    mocha.run();
});
