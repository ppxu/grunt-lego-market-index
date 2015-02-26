
define(function(require, exports, module) {

    var datePicker = require('lego-market-test/base/datepicker/index');

    module.exports = {
        main: Address
    };

    function Address(engine, model){
        this.engine = engine;
        this.model = model;
    }

    Address.prototype.init = function(){
        console.log('Address');
    };

});

