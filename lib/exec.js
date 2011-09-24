/*!
 * Connect Exec
 * Copyright(c) 2011 nuccio s.a.s.
 * MIT Licensed
 */

/*jslint node: true */
/*jshint node: true */
var spawn = require('child_process').spawn,
  url = require('url');

/**
 * Connect middleware providing external command execution.
 *
 * Options is an array of array. Each array has, in order:
 *
 *  - `matcher` Function that given a path returns null or an array of arguments.
 *  - `cwd`     Working directory to run the command
 *  - `cmd`     Command to run for this url
 *  - `args`    Array of arguments
 *
 * The arguments returned by the matcher are passed as additional
 * arguments to the command. If the matcher returns null, nothing is done.
 *
 * @param {Array} options as described
 * @api public
 */

module.exports = function (options) {
  'use strict';
  if (typeof options !== 'object' || typeof options.length !== 'number' ||
      options.length <= 0) {
    throw new Error('options must be a non empty array');
  }
  options.forEach(function (option) {
    if (typeof option !== 'object' || option.length !== 4) {
      throw new Error('each options must be an array of 4 elements');
    }
    if (typeof option[0] !== 'function') {
      throw new Error('path option must be a function');
    }
    if (!option[1] || typeof option[1] !== 'string') {
      throw new Error('cwd option must be a string');
    }
    if (!option[2] || typeof option[2] !== 'string') {
      throw new Error('cmd option must be a string');
    }
    if (typeof option[3] !== 'object' || typeof option[3].length !== 'number') {
      throw new Error('args must be an array');
    }
  });

  return function (req, res, next) {
    var option, parsedArgs, process, stderr,
      pathname = url.parse(req.url).pathname;

    if (!options.some(function (opt) {
        option = opt;
        parsedArgs = option[0](pathname);
        return parsedArgs;
      })) {
      return next();
    }

    res.setHeader('Content-Type', 'application/json');

    process = spawn(option[2], option[3].concat(parsedArgs), { cwd: option[1] });
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
        return next(new Error(option[2] + ' exit code ' + code));
      } else if (stderr.length) {
        return next(new Error(stderr.join('')));
      }
      res.end();
    });
  };
};
