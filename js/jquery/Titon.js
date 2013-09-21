/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function(window) {
    'use strict';

window.Titon = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    }

};

/**
 * Fetch the component instance from the jQuery collection.
 *
 * @param {String} component
 * @returns {Function}
 */
$.fn.toolkit = function(component) {
    var key = '$' + component;

    if (this[key]) {
        return this[key] || null;

    } else if (this.length === 1) {
        return this[0][key] || null;
    }

    return null;
};

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.reveal = function() {
    return this.removeClass('hide').addClass('show');
};

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.conceal = function() {
    return this.removeClass('show').addClass('hide');
};

/**
 * Position the element relative to another element in the document, or to the mouse cursor.
 * Determine the offsets through the `relativeTo` argument, which can be an event, or a jQuery element.
 * Optional account for mouse location and base offset coordinates.
 *
 * @param {String} position
 * @param {Event|jQuery} relativeTo
 * @param {Object} baseOffset
 * @param {bool} isMouse
 * @returns {jQuery}
 */
$.fn.positionTo = function(position, relativeTo, baseOffset, isMouse) {
    position = position.hyphenate().split('-');

    var edge = { y: position[0], x: position[1] },
        offset = baseOffset || { left: 0, top: 0 },
        relHeight = 0,
        relWidth = 0,
        eHeight = this.outerHeight(true),
        eWidth = this.outerWidth(true);

    // If an event is used, position it near the mouse
    if (relativeTo.preventDefault) {
        offset.left += relativeTo.pageX;
        offset.top += relativeTo.pageY;

    // Else position it near the element
    } else {
        var relOffset = relativeTo.offset();

        offset.left += relOffset.left;
        offset.top += relOffset.top;
        relHeight = relativeTo.outerHeight();
        relWidth = relativeTo.outerWidth();
    }

    // Shift around based on edge positioning
    if (edge.y === 'top') {
        offset.top -= eHeight;
    } else if (edge.y === 'bottom') {
        offset.top += relHeight;
    } else if (edge.y === 'center') {
        offset.top -= Math.round((eHeight / 2) - (relHeight / 2));
    }

    if (edge.x === 'left') {
        offset.left -= eWidth;
    } else if (edge.x === 'right') {
        offset.left += relWidth;
    } else if (edge.x === 'center') {
        offset.left -= Math.round((eWidth / 2) - (relWidth / 2));
    }

    // Increase the offset in case we are following the mouse cursor
    // We need to leave some padding for the literal cursor to not cause a flicker
    if (isMouse) {
        if (edge.y === 'center') {
            if (edge.x === 'left') {
                offset.left -= 15;
            } else if (edge.x === 'right') {
                offset.left += 15;
            }
        }

        if (edge.x === 'center') {
            if (edge.y === 'top') {
                offset.top -= 10;
            } else if (edge.y === 'bottom') {
                offset.top += 20;
            }
        }
    }

    return this.css(offset);
};

/**
 * Delays the execution of a function till the duration has completed.
 *
 * @param {Function} func
 * @param {Number} [threshold]
 * @returns {Function}
 */
$.debounce = function(func, threshold) {
    var timeout;

    return function debounced() {
        var obj = this, args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(function delayed() {
            func.apply(obj, args);
            timeout = null;
        }, threshold || 150);
    };
};

/**
 * Used for CSS animations and transitions.
 *
 * @returns {bool}
 */
$.expr[':'].shown = function(obj) {
    return ($(obj).css('visibility') !== 'hidden');
};

/**
 * Split an array into multiple chunked arrays.
 *
 * @param {Number} size
 * @returns {Array}
 */
if (!Array.prototype.chunk) {
    Array.prototype.chunk = function(size) {
        var array = this;

        return [].concat.apply([], array.map(function(elem, i) {
            return (i % size) ? [] : [ array.slice(i, i + size) ];
        }));
    };
}

/**
 * Convert uppercase characters to lower case dashes.
 *
 * @returns {String}
 */
if (!String.prototype.hyphenate) {
    String.prototype.hyphenate = function() {
        return this.replace(/[A-Z]/g, function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        });
    };
}

})(window);
