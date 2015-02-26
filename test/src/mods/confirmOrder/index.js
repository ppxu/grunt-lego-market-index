
define(function(require, exports, module) {

    var datePicker = require('lego-market-test/widget/loading/index');

    module.exports = {
        main: ConfirmOrder
    };

    function ConfirmOrder(engine, model){
        this.engine = engine;
        this.model = model;
    }

    ConfirmOrder.prototype.init = function(){
        console.log('ConfirmOrder');
    };

});

