'use strict';


//    var crypto = require('crypto');

/*
 * Default encoding alphabets
 * URL-friendly base-64 encoding is chosen.  Base-32 is best suited
 * for tiny-URL like apps, because I and 1 can't be confused
 * and the upper-case characters are more easily remembered by a human.
 *
 * Where 'native', we use the bignum native encoding routine.
 */
var defaultAlphabets = {
    10: '0123456789',
    16: '0123456789ABCDEF',
    30: '0123456789bcdfghjklmnpqrstvwxz',
    32: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    36: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    50: '0123456789BCDFGHJKLMNPQRSTVWXZbcdfghjklmnpqrstvwxz',
    62: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
};

function getRandomChar(array) {
    var rNum = Math.floor(Math.random() * (array.length - 1));
    return array[rNum];
}


exports.generate = function (options) {
    options = options || {};

    var len = options.len || 8;
    // if an alphabet was specified it takes priorty
    // otherwise use the default alphabet for the given base
    var base = options.alphabet ? options.alphabet.length : (options.base || 30);
    var alphabet = options.alphabet || defaultAlphabets[base];

    if (!alphabet) {
        var err = new Error('Only base ' + Object.keys(alphabet).join(', ') + ' supported if an alphabet is not provided.');
        throw(err);
    }

    // Transform alphabet to array
    alphabet = alphabet.split('');

    // Get a random char for each chars of final id
    var id = '';
    for (var i = 0; i < len; i += 1) {
        id += getRandomChar(alphabet);
    }

    return id;
};
