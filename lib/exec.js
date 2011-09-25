/*!
 * Connect Exec
 * Copyright(c) 2011 nuccio s.a.s.
 * MIT Licensed
 */

/*jslint node: true */
/*jshint node: true */
var spawn = require('child_process').spawn,
  url = require('url'),
  pathMatcher = require('./pathMatcher');

/**
 * Connect middleware providing external command execution.
 *
 * @param {String} contentType Content-Type for the output of the command
 * @param {String} cwd         Working directory for the command
 * @param {String} cmd         Command to be run for this url
 * @param {Array} baseArgs     Static arguments to the command
 *
 * @api public
 */
module.exports = function (contentType, cwd, cmd, baseArgs) {
  'use strict';
  if (typeof contentType !== 'string') {
    throw new Error('contentType must be a string');
  }
  if (typeof cwd !== 'string') {
    throw new Error('cwd must be a string');
  }
  if (typeof cmd !== 'string') {
    throw new Error('cmd must be a string');
  }
  if (typeof baseArgs !== 'object' || typeof baseArgs.length !== 'number') {
    throw new Error('baseArgs must be an array');
  }

  return function (req, res, next) {
    var process, stderr,
      parsedArgs = pathMatcher(url.parse(req.url).pathname);

    if (!parsedArgs) {
      return next();
    }

    res.setHeader('Content-Type', contentType);

    process = spawn(cmd, baseArgs.concat(parsedArgs), { cwd: cwd });
    stderr = [];
    process.stdout.on('data', function (data) {
      res.write(data);
    });
    process.stderr.on('data', function (data) {
      if (stderr.length < 100) {
        stderr.push(data);
      }
    });
    process.on('exit', function (code) {
      if (code) {
        return next(new Error(cmd + ' exit code ' + code));
      } else if (stderr.length) {
        return next(new Error(stderr.join('')));
      }
      res.end();
    });
  };
};
