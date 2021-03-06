import {ascii} from './lib/ascii';
import {_pop} from './lib/array';
import {validString, validArrayString, validNumber, validCharLength} from './lib/validate';
import {toUpperCase} from './string.cases';

/*
 * Checks whether a string
 * @param value - value to check
 * @return Boolean - true or false
 */
const isString = value =>
    Object.prototype.toString.call(value) === '[object String]';

export {isString};

/*
 * Remove all spaces on left and right
 * @params value - String to trim
 * @return String without boarders spaces
 */
const trim = value => leftTrim(rightTrim(value));

export {trim};

/*
 * Remove spaces left
 * @params value
 * @return string
 */
const leftTrim = value => replace(value, '^\\s+', '');

export {leftTrim};

/*
 * Remove spaces right
 * @params value
 * @return string
 */
const rightTrim = value => replace(value, '\\s+$', '');

 export {rightTrim};

/*
 * Remove all spaces and replace for value
 * @param replace - Value to replace
 * @param value - The string being searched and replaced on.
 * @return String without spaces
 */
const removeSpaces = (value, replaced = '') => replace(value, '\\s+', replaced);

export {removeSpaces};

/*
 * Replace [search] value to [newvalue]
 * @param search - String to search
 * @param newvalue - String to replace
 * @params value - The string being searched and replaced on.
 * @return String replaced
 */
const replace = (value, search = '', newvalue = '', caseSensitive = true) => {
    if(caseSensitive){
        return value.replace(new RegExp(search, 'g'), newvalue);
    }

    return value.replace(new RegExp(search, 'ig'), newvalue);

};

export {replace};

/*
 * Remove all non valid characters
 * Example: change á => a or ẽ => e
 * @params value - The string being searched and replaced on.
 * @return String without non valid characters.
 */
const transliterate = (value) => {
    let result = value;
    for(let key in ascii){
        for(let char in ascii[key]){
            result = replace(result, ascii[key][char], key);
        }
    }
    return result;
};

export {transliterate};

/*
 * @deprecated Since version 1.0.1. Will be deleted in version 1.2.0. Use transliterate instead.
 * Remove all non valid characters
 * Example: change á => a or ẽ => e
 * @params value - The string being searched and replaced on.
 * @return String without non valid characters.
 */
const removeNonChars = transliterate;

export {removeNonChars};

/*
 * Append Strings on Value
 * @param value String initial
 * @param ...append - array with strings to append
 * @return string
 */
const append = (value, ...appends) => {

    validString(value);
    validArrayString(appends);

    if(length(appends) === 0){
        return value;
    }

    return value + appends.join('');
};

export {append};

/*
 * Append Array of Strings on Value
 * @param value String initial
 * @param ...append - array with strings to append
 * @return string
 */
const appendArray = (value, appends = []) => {

    validString(value);
    validArrayString(appends);

    if(length(appends) === 0){
        return value;
    }

    return value + appends.join('');
};

export {appendArray};


/*
 * Get the character at index
 * @param value
 * @param index
 * @return char
 */
const at = (value, index) => {
    validString(value);
    validNumber(index);

    return substr(value, index, 1);
};

export {at};

/*
 * Returns array with strings between [start] and [end]
 * @param value
 * @param start
 * @param end
 * @return Array
 */
const between = (value, start, end) => {

    let result = null;

    validArrayString([value, start, end]);

    result = split(value, end);

    result = result.map((text) => {
        return substr(text, indexOf(text, start)+length(start));
    });

    result = _pop(result);

    return result;
};

export {between};

/*
 * Returns an array consisting of the characters in the string.
 * @params value
 * @returns Array
 */
const chars = value => {
    let _chars = [];

    validString(value);

    for(let i = 0; i < length(value); i++){
        _chars[i] = at(value, i);
    }
    return _chars;
};

export {chars};

/*
 * Replaces consecutive whitespace characters with a single space
 * @param string
 * @return string
 */
const collapseWhitespace = (value) => trim(replace(value, '\\s\\s+',' '));

export {collapseWhitespace};

/*
 * Remove all non word characters
 * Example: change . => [replace]
 * @paramsClojure replace - Value to replace
 * @params value - The string being searched and replaced on.
 * @return String without non word characters.
 */
const removeNonWords = (value, replaced = '') => replace(value, '[^\\w]+', replaced);

export {removeNonWords};

/*
 * Verifies that the needle is contained in value
 * @param value
 * @param needle
 * @param caseSensitive - default true
 * @return boolean
 */
const contains = (value, needle, caseSensitive = true) => {

    if(caseSensitive){
        return indexOf(value, needle) > -1;
    }

    return indexOf(toUpperCase(value), toUpperCase(needle)) > -1;

};

export {contains};

/*
 * Verifies that all needles are contained in value
 * @param value
 * @param needle
 * @param caseSensitive - default true
 * @return boolean
 */
const containsAll = (value, needles, caseSensitive = true) => {
    for(let i = 0; i < length(needles); i++){
        if(!contains(value, needles[i], caseSensitive)){
            return false;
        }
    }
    return true;
};

export {containsAll};

/*
 * Verifies that one or more of needles are contained in value
 * @param value
 * @param needle
 * @param caseSensitive - default true
 * @return boolean
 */
const containsAny = (value, needles, caseSensitive = true) => {
    for(let i = 0; i < length(needles); i++){
        if(contains(value, needles[i], caseSensitive)){
            return true;
        }
    }
    return false;
};

export {containsAny};

/*
 * Polyfill to countSubstr function
 * @param value,
 * @param substr,
 * @param position = 0,
 * @param count = 0,
 * @param allowOverlapping = false
 * @return integer
 */
const _countSubstring = (value, _substr, allowOverlapping = false, position = 0, count = 0) => {

    let _position = indexOf(value, _substr, position);

    if(_position === -1){
        return count;
    }

    if(!allowOverlapping){
        _position = _position + length(_substr) - 1;
    }

    return _countSubstring(value, _substr, allowOverlapping, _position + 1, count + 1);

};

/*
 * Count the number of times substr appears in value
 * @param value,
 * @param substr,
 * @param caseSensitive = true,
 * @param allowOverlapping = false
 * @return integer
 */
const countSubstr = (value, _substr, caseSensitive = true, allowOverlapping = false) => {

    if(!caseSensitive){
        value = toUpperCase(value);
        _substr = toUpperCase(_substr);
    }

    return _countSubstring(value, _substr, allowOverlapping);

};

export {countSubstr};

/*
 * Test if [value] ends with [search]
 * @param value
 * @param search
 * @param position = null
 * @return boolean
 */
const endsWith = (value, search, position = null, caseSensitive = true) => {

    let lastIndex = null;

    if (typeof position !== 'number' || !isFinite(position)
            || Math.floor(position) !== position || position > length(value)) {
        position = length(value);
    }

    position -= length(search);

    if(caseSensitive){
        lastIndex = indexOf(value, search, position);
    }else{
        lastIndex = indexOf(toUpperCase(value), toUpperCase(search), position);
    }

    return lastIndex !== -1 && lastIndex === position;

};

export {endsWith};

/*
 * Test if [value] starts with [search]
 * @param value
 * @param search
 * @param position = null
 * @return boolean
 */
const startsWith = (value, search, position = 0, caseSensitive = true) => {

    if(caseSensitive){
        return substr(value, position, length(search)) === search;
    }

    return substr(toUpperCase(value), position, length(search)) === toUpperCase(search);

};

export {startsWith};

/*
 * Ensures that the [value] begins with [substr]. If it doesn't, it's prepended.
 * @param value
 * @param substr
 * @return string
 */
const ensureLeft = (value, _substr, caseSensitive = true)  => {
    if(!startsWith(value, _substr, 0, caseSensitive)){
        return append(_substr, value);
    }

    return value;
};

export  {ensureLeft};

/*
 * Ensures that the [value] ends with [substr]. If it doesn't, it's appended.
 * @param value
 * @param substr
 * @return string
 */
const ensureRight = (value, _substr, caseSensitive = true)  => {

    if(!endsWith(value, _substr, null, caseSensitive)){
        return append(value, _substr);
    }

    return value;
};

export {ensureRight};

/*
 * Return the first n chars of string.
 * @param value
 * @param n
 * @return string
 */
const first = (value, n) => substr(value, 0, n);

export {first};

/*
 * Return the last n chars of string.
 * @param value
 * @param n
 * @return string
 */
const last = (value, n) => substr(value, -1 * n, n);

export {last};

/*
 * The indexOf() method returns the index within the calling String object of the first occurrence
 * of the specified value, starting the search at fromIndex. Returns -1 if the value is not found.
 *
 * @param value
 * @param needle
 * @param offset
 * @return integer
 */
const indexOf = (value, needle, offset = 0, caseSensitive = true) => {
    if(caseSensitive){
        return value.indexOf(needle, offset);
    }

    return toUpperCase(value).indexOf(toUpperCase(needle), offset);
};

export {indexOf};

/*
 * The lastIndexOf() method returns the index within the calling String object of the last
 * occurrence of the specified value, searching backwards from fromIndex. Returns -1 if the
 * value is not found.
 *
 * @param value
 * @param needle
 * @param offset
 * @return integer
 */
const lastIndexOf = (value, needle, offset = undefined, caseSensitive = true) => {
    if(caseSensitive){
        return value.lastIndexOf(needle, offset);
    }
    return toUpperCase(value).lastIndexOf(toUpperCase(needle), offset);
};

export {lastIndexOf};

/*
 * Inserts [substr] into the [value] at the [index] provided.
 * @param value
 * @param substr
 * @param index
 * @return string
 */
const insert = (value, _substr, index) => {

    let start = null;
    let end = null;

    if(index > length(value)){
        return value;
    }

    start = substr(value, 0, index);
    end = substr(value, index, length(value));

    return append(start, _substr, end);

};

export {insert};

/*
 * Returns the length of the string
 * @param value
 * @return integer
 */
const length = value => value.length;

export {length};

/*
 * Returns a new string of a given length such that the beginning of the string is padded.
 * @param value
 * @param length
 * @param char
 * @return string
 */
 const leftPad = (value, _length, char = ' ') => {

    let result = value;
    char = String(char);

    if(length(char) > 1){
        char = substr(char, 0, 1);
    }

    validCharLength(char);

    _length = _length - length(value);

    result = append(repeat(char, _length), result);

    return result;
};

export {leftPad};

/*
 * Returns a new string of a given length such that the ending of the string is padded.
 * @param value
 * @param length
 * @param char
 * @return string
 */
const rightPad = (value, _length, char = ' ') => {

    let result = value;
    char = String(char);

    if(length(char) > 1){
        char = substr(char, 0, 1);
    }

    validCharLength(char);

    _length = _length - length(value);

    result = append(result, repeat(char, _length));

    return result;
};

export {rightPad};

/*
 * Alias to substr function
 * @param value
 * @param start
 * @param length = undefined
 * @return string
 */
const substr = (value, start, length = undefined) => value.substr(start, length);

export {substr};

/*
 * Alias to split function
 * @param value
 * @param separator
 * @param limit = undefined
 * @return string
 */
const split = (value, separator, limit = undefined) => value.split(separator, limit);

export {split};

/*
 * Returns a new string starting with [prepends].
 * @param value
 * @param ...prepends
 * @return string
 */
const prepend = (value, ...prepends) => {

    validString(value);
    validArrayString(prepends);

    if(length(prepends) === 0){
        return value;
    }

    return prepends.join('') + value;
};

export {prepend};

/*
 * Returns a new string starting with [prepends].
 * @param value
 * @param ...prepends
 * @return string
 */
const prependArray = (value, prepends = []) => {

    validString(value);
    validArrayString(prepends);

    if(length(prepends) === 0){
        return value;
    }

    return prepends.join('') + value;
};

export {prependArray};


/*
 * Returns a new string with the [prefix] removed, if present.
 * @param value
 * @param prefix
 * @return string
*/
const removeLeft = (value, prefix, caseSensitive = true) => {

    if(startsWith(value, prefix, 0, caseSensitive)){
        return substr(value, length(prefix));
    }

    return value;
};

export {removeLeft};

/*
 * Returns a new string with the [suffix] removed, if present.
 * @param value
 * @param prefix
 * @return string
*/

const removeRight = (value, suffix, caseSensitive = true) => {
    let _length = length(value) - length(suffix);

    if(endsWith(value, suffix, null, caseSensitive)){
        return substr(value, 0, _length);
    }

    return value;
};

export {removeRight};

/*
 * Returns a repeated string given a multiplier.
 * @param value
 * @param multiplier
 * @return string
*/

const repeat = (value, multiplier) => {
    let i = 0;
    let result = '';
    while(multiplier > i++) {
        result += value;
    }
    return result;
};

export {repeat};

/*
 * Returns a reversed string.
 * @param value
 * @return string
*/

const reverse = (value) => {
    let i = 0;
    let reversed = '';
    while(length(value) > i++){
        reversed = append(reversed, substr(value, -1*i, 1));
    }
    return reversed;
};

export {reverse};

/*
 * A multibyte str_shuffle() function. It returns a string with its characters in random order.
 * @param value
 * @return string
*/
const _shuffle =(array) => {
    let j;
    let x;
    let i;
    for (i = length(array); i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = array[i - 1];
        array[i - 1] = array[j];
        array[j] = x;
    }
    return array;
};

const shuffle = (value) => _shuffle(split(value)).join('');

export {shuffle};

/*
 * Surrounds a [value] with the given [substr].
 * @param value
 * @param substr
 * @return string
 */
const surround = (value, _substr = '') => append(_substr, value, _substr);

export {surround};

/*
 * The slice method extracts a section of a string and returns a new string.
 * @param value
 * @param beginSlice
 * @param endSlice
 * @return string
 */
 const slice = (value, beginSlice, endSlice = undefined) => value.slice(beginSlice, endSlice);

 export {slice};

/*
 * Truncate the string securely, not cutting a word in half. It always returns the last full word.
 * @param value
 * @param _length
 * @param _append = ''
 * @return string
 */
const safeTruncate = (value, _length, _append = '') => {

    let truncated = '';

    if(_length === 0){
        return '';
    }

    if (_length >= length(value)) {
        return value;
    }

    if(_length === indexOf(value, ' ', 0)){
        return substr(value, 0, _length);
    }

    _length -= length(_append) ;
    truncated = substr(value, 0, _length);

    let position = indexOf(value, ' ', _length - 1);

    if(position !== _length){
        let lastPos = lastIndexOf(truncated, ' ', 0);
        truncated = substr(truncated, 0, lastPos);
    }

    return append(truncated, _append);

};

export {safeTruncate};

/*
 * Truncate the unsecured form string, cutting the independent string of required position.
* @param value
 * @param _length
 * @param _append = ''
 * @return string
 */
const truncate = (value, _length, _append = '') => {

    let truncated = '';

    if(_length === 0){
        return '';
    }

    if (_length >= length(value)) {
        return value;
    }

    _length -= length(_append) ;
    truncated = substr(value, 0, _length);

    return append(truncated, _append);

};

export {truncate};
