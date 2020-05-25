const XRegExp = require('xregexp');
const patterns = require('../patterns/index.js');

const createEntities = (str, pattern) => XRegExp.exec(str, new XRegExp(pattern, 'i'));

const matchPattern = (str, cb) => {
    const getResult = patterns.find((item) => {
        if (XRegExp.test(str, new XRegExp(item.pattern, 'i'))) {
            return true;
        }
    });

    return getResult
        ? cb({ intent: getResult.intent, entities: createEntities(str, getResult.pattern) })
        : cb({});
};

module.exports = matchPattern;
