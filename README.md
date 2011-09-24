# connect-exec

Exec middleware for [Connect](http://senchalabs.github.com/connect/) on [Node.js](http://nodejs.org). Runs a configured command for a given path.


## Installation

Clone this repository into your `node_modules` folder.


## Usage

### connectExec.exec(options)

Include this middleware to run arbitrary commands for configured urls.

    var connect = require('connect'),
      connectExec = require('connect-exec'),
      argPattern = "/([a-zA-Z]+=[a-zA-Z0-9.]+)",
      regexpPath = new RegExp("^/exec/([a-z]+)(?:" + argPattern + ")*$"),
      regexpArg = new RegExp(argPattern, 'g');
    
    /**
     * Matches urls like:
     *  - /exec/foo         => ['foo']
     *  - /exec/bar/a=1/b=c => ['bar', 'a=1', 'b=c']
     *  - /other            => null
     */
    function aMatcher(url) {
      'use strict';
      var m = regexpPath.exec(url), args = [];
      while (m) {
        args.push(m[1]);
        m = regexpArg.exec(url);
      }
      return args.length ? args : null;
    }

    function anotherMatcher(url) {
      if (url === '/myprettyurl') {
        return ['pretty'];
      }
    }

    connect(
      connectExec.exec([
      connectExec.exec([
        [aMatcher, __dirname, 'java', ['-jar', 'myapp.jar']],
        [anotherMatcher, __dirname, 'node', []]
      ]),
      connect['static'](__dirname)
    ).listen(3000);

Options:

Is an array of array. Each array has, in order: 
 - `matcher` Function that given a path returns null or an array of arguments.
 - `cwd`     Working directory to run the command
 - `cmd`     Command to run for this url
 - `args`    Array of arguments

The arguments returned by the matcher are passed as additional arguments to the command. If the matcher returns null, nothing is done.

## License

(The MIT License)

Copyright (c) 2011 Marcello Nuccio &lt;marcello.nuccio@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
