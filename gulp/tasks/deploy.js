'use strict';

/** Configuration **/
var user = process.env.WEB_ADVANCED_FTP_USER;
var password = process.env.WEB_ADVANCED_FTP_PWD;
var host = '31.131.20.87';
var port = 21;
var localFilesGlob = [$.config.root + '/**/*'];
var remoteFolder = '/vshelest.net'

function getFtpConnection() {
    return $.ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        //parallel: 5,
        log: $.gp.util.log
    });
}

/**
 * Deploy task.
 * Copies the new files to the server
 *
 * Usage: `FTP_USER=someuser FTP_PWD=somepwd gulp ftp-deploy`
 */

module.exports = function() {
    $.gulp.task('deploy', function() {
        var conn = getFtpConnection();

        return $.gulp.src(localFilesGlob, {base: './build', buffer: false})
            //.pipe(conn.newer(remoteFolder)) // only upload newer files
            .pipe(conn.dest(remoteFolder))
            ;
    });
};

