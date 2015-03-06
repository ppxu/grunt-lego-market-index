(function(){

var prefix = KISSY.config('assetsPrefix') || '//g.alicdn.com/';
var base = prefix+'tb/lego-market-test/1.0.1';

KISSY.config({
    'lego-market-test': {
        'manifest': 1,
        'version': '1.0.1',
        'base': base,
        'mods': ['address', 'confirmOrder']
    },
    'packages': [{
        'name': 'lego-market-test',
        'base': base,
        'group': 'tb',
        'ignorePackageNameInUri': true
    }, {
        'name': 'fp',
        'base': 'http://g.tbcdn.cn/tb/tb-fp/14.9.7',
        'ignorePackageNameInUri': true
    }],
    'modules': {
        'mui/view-port-listen': {"requires":["base","node"],"path":"mui/view-port-listen/1.0.3/index.js"}
    }
});

})();