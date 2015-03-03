KISSY.config({
    'lego-market-test': {
        mods: ['address', 'confirmOrder']
    },
    'packages': [{
        'name': 'lego-market-test',
        'base': 'http://g.alicdn.com/lego-market-test/1.0.1',
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