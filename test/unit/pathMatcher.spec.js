/*jslint node: true */
/*jshint node: true */
/*global describe: false, it: false, expect: false */

describe('pathMatcher', function () {
  'use strict';

  var pathMatcher = require('../../lib/pathMatcher'),
    validUrls = [
      '/scalarini',
      '/bolla/data=110704/numero=40241/enteNumerazione=Y/codiceNumerazione=10'
    ],
    invalidUrls = [
      '/foo/scalarini',
      ' /scalarini',
      '/scalarini/',
      '/bolla/data=110704/numero=40241/enteNumerazione=Y/codiceNumerazione:10'
    ];
  
  invalidUrls.forEach(function (invalidUrl) {
    it('should not match "' + invalidUrl + '"', function () {
      expect(pathMatcher(invalidUrl)).toBe(null);
    });
  });

  it('should return no arguments from "' + validUrls[0] + '"', function () {
    expect(pathMatcher(validUrls[0])).toEqual(['scalarini']);
  });

  it('should extract arguments from "' + validUrls[1] + '"', function () {
    expect(pathMatcher(validUrls[1])).toEqual([
      'bolla',
      'data=110704',
      'numero=40241',
      'enteNumerazione=Y',
      'codiceNumerazione=10'
    ]);
  });
});
