"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.logDeprecationNotice = exports.getCurrentSrcData = exports.matchesMedia = exports.getImageSrcKey = exports.combineArray = exports.filteredJoin = exports.hashString = exports.stringToArray = exports.toKebabCase = exports.toCamelCase = exports.hasArtDirectionArray = exports.hasArtDirectionFixedArray = exports.hasArtDirectionFluidArray = exports.hasImageArray = exports.groupByMedia = exports.convertProps = exports.stripRemainingProps = exports.isString = exports.isBrowser = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _filterInvalidDomProps = _interopRequireDefault(require("filter-invalid-dom-props"));

/**
 * Are we in the browser?
 *
 * @return {boolean}
 */
var isBrowser = function isBrowser() {
  return typeof window !== 'undefined';
};
/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */


exports.isBrowser = isBrowser;

var isString = function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
};
/**
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */


exports.isString = isString;

var stripRemainingProps = function stripRemainingProps(props) {
  return (0, _filterInvalidDomProps.default)(props);
};
/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */


exports.stripRemainingProps = stripRemainingProps;

var convertProps = function convertProps(props) {
  var convertedProps = (0, _extends2.default)({}, props);
  var resolutions = convertedProps.resolutions,
      sizes = convertedProps.sizes,
      classId = convertedProps.classId,
      fixed = convertedProps.fixed,
      fluid = convertedProps.fluid;

  if (resolutions) {
    convertedProps.fixed = resolutions;
    delete convertedProps.resolutions;
  }

  if (sizes) {
    convertedProps.fluid = sizes;
    delete convertedProps.sizes;
  }

  if (classId) {
    logDeprecationNotice("classId", "gatsby-background-image should provide unique classes automatically. Open an Issue should you still need this property.");
  } // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }
  // convert fluid & fixed to arrays so we only have to work with arrays


  if (fluid && hasArtDirectionFluidArray(props)) {
    convertedProps.fluid = groupByMedia(convertedProps.fluid);
  }

  if (fixed && hasArtDirectionFixedArray(props)) {
    convertedProps.fixed = groupByMedia(convertedProps.fixed);
  }

  return convertedProps;
};
/**
 * Return an array ordered by elements having a media prop, does not use
 * native sort, as a stable sort is not guaranteed by all browsers/versions
 *
 * @param imageVariants   array   The art-directed images.-
 */


exports.convertProps = convertProps;

var groupByMedia = function groupByMedia(imageVariants) {
  var withMedia = [];
  var without = [];
  imageVariants.forEach(function (variant) {
    return (variant.media ? withMedia : without).push(variant);
  });

  if (without.length > 1 && process.env.NODE_ENV !== "production") {
    console.warn("We've found " + without.length + " sources without a media property. They might be ignored by the browser, see: https://www.gatsbyjs.org/packages/gatsby-image/#art-directing-multiple-images");
  }

  return [].concat(withMedia, without);
};
/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.groupByMedia = groupByMedia;

var hasImageArray = function hasImageArray(props) {
  return props.fluid && Array.isArray(props.fluid) || props.fixed && Array.isArray(props.fixed);
};
/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.hasImageArray = hasImageArray;

var hasArtDirectionFluidArray = function hasArtDirectionFluidArray(props) {
  return props.fluid && Array.isArray(props.fluid) && props.fluid.some(function (fluidImage) {
    return typeof fluidImage.media !== 'undefined';
  });
};
/**
 * Checks if fluid or fixed are art-direction arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.hasArtDirectionFluidArray = hasArtDirectionFluidArray;

var hasArtDirectionFixedArray = function hasArtDirectionFixedArray(props) {
  return props.fixed && Array.isArray(props.fixed) && props.fixed.some(function (fixedImage) {
    return typeof fixedImage.media !== 'undefined';
  });
};
/**
 * Checks for fluid or fixed Art direction support.
 * @param props
 * @return {boolean}
 */


exports.hasArtDirectionFixedArray = hasArtDirectionFixedArray;

var hasArtDirectionArray = function hasArtDirectionArray(props) {
  return hasArtDirectionFluidArray(props) || hasArtDirectionFixedArray(props);
};
/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */


exports.hasArtDirectionArray = hasArtDirectionArray;

var toCamelCase = function toCamelCase(str) {
  return isString(str) && str.toLowerCase().replace(/(?:^\w|-|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s|\W+/g, '');
};
/**
 * Converts camel-cased js style rules to CSS kebab-case strings.
 *
 * @param str string    Rule to transform
 * @return {boolean|string}
 */


exports.toCamelCase = toCamelCase;

var toKebabCase = function toKebabCase(str) {
  return isString(str) && str.replace(/\s|\W+/g, '').replace(/[A-Z]/g, function (match) {
    return "-" + match.toLowerCase();
  });
};
/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */


exports.toKebabCase = toKebabCase;

var stringToArray = function stringToArray(str, delimiter) {
  if (delimiter === void 0) {
    delimiter = " ";
  }

  if (str instanceof Array) {
    return str;
  }

  if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter);
    }

    return [str];
  }

  return false;
};
/**
 * Hashes a String to a 32bit integer with the simple Java 8 hashCode() func.
 *
 * @param str   string    String to hash.
 * @return {number}
 */


exports.stringToArray = stringToArray;

var hashString = function hashString(str) {
  return isString(str) && [].reduce.call(str, function (hash, item) {
    hash = (hash << 5) - hash + item.charCodeAt(0);
    return hash | 0;
  }, 0);
};
/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */


exports.hashString = hashString;

var filteredJoin = function filteredJoin(arrayToJoin) {
  return arrayToJoin.filter(function (item) {
    return item !== "";
  }).join();
};
/**
 * Combines two arrays while keeping fromArrays indexes & values.
 *
 * @param fromArray   array   Array the values shall be taken from.
 * @param toArray     array   Array to copy values into.
 * @return {array}
 */


exports.filteredJoin = filteredJoin;

var combineArray = function combineArray(fromArray, toArray) {
  // Fallback for singular images.
  if (!Array.isArray(fromArray)) {
    return [fromArray];
  }

  return fromArray.map(function (item, index) {
    return item || toArray[index];
  });
};
/**
 * Find the source of an image to use as a key in the image cache.
 * Use `the first matching image in either `fixed` or `fluid`
 *
 * @param {{fluid: {src: string}[], fixed: {src: string}[]}} args
 * @return {string|null}
 */


exports.combineArray = combineArray;

var getImageSrcKey = function getImageSrcKey(_ref) {
  var fluid = _ref.fluid,
      fixed = _ref.fixed;
  var data = getCurrentSrcData({
    fluid: fluid,
    fixed: fixed
  });
  return data ? data.src || null : null;
};
/**
 * Tries to detect if a media query matches the current viewport.
 *
 * @param media   string  A media query string.
 * @return {*|boolean}
 */


exports.getImageSrcKey = getImageSrcKey;

var matchesMedia = function matchesMedia(_ref2) {
  var media = _ref2.media;
  return media && isBrowser() && window.matchMedia(media).matches;
};
/**
 * Returns the current src if possible with art-direction support.
 *
 * @param fluid   object    Fluid Image (Array) if existent.
 * @param fixed   object    Fixed Image (Array) if existent.v
 * @return {*}
 */


exports.matchesMedia = matchesMedia;

var getCurrentSrcData = function getCurrentSrcData(_ref3) {
  var fluid = _ref3.fluid,
      fixed = _ref3.fixed;
  var currentData = fluid || fixed;

  if (hasImageArray({
    fluid: fluid,
    fixed: fixed
  })) {
    if (isBrowser() && hasArtDirectionArray({
      fluid: fluid,
      fixed: fixed
    })) {
      // Do we have an image for the current Viewport?
      var foundMedia = currentData.reverse().findIndex(matchesMedia);

      if (foundMedia !== -1) {
        return currentData.reverse()[foundMedia];
      }
    } // Else return the first image.


    return currentData[0];
  }

  return currentData;
};
/**
 * Logs a warning if deprecated props where used.
 *
 * @param prop
 * @param notice
 */


exports.getCurrentSrcData = getCurrentSrcData;

var logDeprecationNotice = function logDeprecationNotice(prop, notice) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log("\n    The \"" + prop + "\" prop is now deprecated and will be removed in the next major version\n    of \"gatsby-background-image\".\n    ");

  if (notice) {
    console.log(notice);
  }
};

exports.logDeprecationNotice = logDeprecationNotice;