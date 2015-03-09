(function(){

var prefix = KISSY.config('assetsPrefix') || '//g.alicdn.com/';
var base = prefix+'{{config.group}}/{{config.name}}/{{config.version}}';

KISSY.config({
    '{{config.name}}': {
        'manifest': 1,
        'version': '{{config.version}}',
        'base': base,
        'mods': [{{modStr}}]
    },
    'packages': [{
        'name': '{{config.name}}',
        'base': base,
        'group': '{{config.group}}',
        'ignorePackageNameInUri': true
    }{{packageStr}}]{{moduleStr}}
});

})();