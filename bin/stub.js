var spawnSync = require('child_process').spawnSync;
var path = require('path');
var fs = require('fs');

function mkdirpSync(p) {
    var _0777 = parseInt('0777', 8);
    var mode = _0777 & (~process.umask());
    var made = null;

    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = mkdirpSync(path.dirname(p));
                mkdirpSync(p);
                break;

                // In the case of any other error, just see if there's a dir
                // there already.  If so, then hooray!  If not, then something
                // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
}

var result = spawnSync('flow', ['--json']);
var output = JSON.parse(result.output.toString('utf8').slice(1, -1));

output.errors.forEach(error => {
    if (error.message.length === 2 &&
        error.message[1].descr === 'Required module not found') {
        var filepath = path.join('stubs', error.message[0].descr);
        var filedir = path.dirname(filepath);
        var filename = path.basename(filepath);

        mkdirpSync(filedir);

        fs.writeFileSync(filepath + '.js', '// Stub file');
    }
});
