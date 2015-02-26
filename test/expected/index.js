KISSY.config({
    'lego-market-test': {
        mods: ['address', 'confirmOrder']
    },
    'package': [{
        'name': 'lego-market-test',
        'base': 'http://g.tbcdn.cn/lego-market-test/1.0.1'
    }, {
        'name': 'fp',
        'base': 'http://g.tbcdn.cn/tb/tb-fp/14.9.7'
    }],
    'modules': {
        'mui/view-port-listen': {"requires":["base","node"],"path":"mui/view-port-listen/1.0.3/index.js"}
    }
});