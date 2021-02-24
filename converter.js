(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.beepBoop = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              /*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
              (function (root) {
                // Detect free variables `exports`.
                var freeExports = typeof exports == "object" && exports;

                // Detect free variable `module`.
                var freeModule =
                  typeof module == "object" &&
                  module &&
                  module.exports == freeExports &&
                  module;

                // Detect free variable `global`, from Node.js or Browserified code, and use
                // it as `root`.
                var freeGlobal = typeof global == "object" && global;
                if (
                  freeGlobal.global === freeGlobal ||
                  freeGlobal.window === freeGlobal
                ) {
                  root = freeGlobal;
                }

                /*--------------------------------------------------------------------------*/

                var InvalidCharacterError = function (message) {
                  this.message = message;
                };
                InvalidCharacterError.prototype = new Error();
                InvalidCharacterError.prototype.name = "InvalidCharacterError";

                var error = function (message) {
                  // Note: the error messages used throughout this file match those used by
                  // the native `atob`/`btoa` implementation in Chromium.
                  throw new InvalidCharacterError(message);
                };

                var TABLE =
                  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                // http://whatwg.org/html/common-microsyntaxes.html#space-character
                var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;

                // `decode` is designed to be fully compatible with `atob` as described in the
                // HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
                // The optimized base64-decoding algorithm used is based on @atk’s excellent
                // implementation. https://gist.github.com/atk/1020396
                var decode = function (input) {
                  input = String(input).replace(REGEX_SPACE_CHARACTERS, "");
                  var length = input.length;
                  if (length % 4 == 0) {
                    input = input.replace(/==?$/, "");
                    length = input.length;
                  }
                  if (
                    length % 4 == 1 ||
                    // http://whatwg.org/C#alphanumeric-ascii-characters
                    /[^+a-zA-Z0-9/]/.test(input)
                  ) {
                    error(
                      "Invalid character: the string to be decoded is not correctly encoded."
                    );
                  }
                  var bitCounter = 0;
                  var bitStorage;
                  var buffer;
                  var output = "";
                  var position = -1;
                  while (++position < length) {
                    buffer = TABLE.indexOf(input.charAt(position));
                    bitStorage =
                      bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
                    // Unless this is the first of a group of 4 characters…
                    if (bitCounter++ % 4) {
                      // …convert the first 8 bits to a single ASCII character.
                      output += String.fromCharCode(
                        0xff & (bitStorage >> ((-2 * bitCounter) & 6))
                      );
                    }
                  }
                  return output;
                };

                // `encode` is designed to be fully compatible with `btoa` as described in the
                // HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
                var encode = function (input) {
                  input = String(input);
                  if (/[^\0-\xFF]/.test(input)) {
                    // Note: no need to special-case astral symbols here, as surrogates are
                    // matched, and the input is supposed to only contain ASCII anyway.
                    error(
                      "The string to be encoded contains characters outside of the " +
                        "Latin1 range."
                    );
                  }
                  var padding = input.length % 3;
                  var output = "";
                  var position = -1;
                  var a;
                  var b;
                  var c;
                  var d;
                  var buffer;
                  // Make sure any padding is handled outside of the loop.
                  var length = input.length - padding;

                  while (++position < length) {
                    // Read three bytes, i.e. 24 bits.
                    a = input.charCodeAt(position) << 16;
                    b = input.charCodeAt(++position) << 8;
                    c = input.charCodeAt(++position);
                    buffer = a + b + c;
                    // Turn the 24 bits into four chunks of 6 bits each, and append the
                    // matching character for each of them to the output.
                    output +=
                      TABLE.charAt((buffer >> 18) & 0x3f) +
                      TABLE.charAt((buffer >> 12) & 0x3f) +
                      TABLE.charAt((buffer >> 6) & 0x3f) +
                      TABLE.charAt(buffer & 0x3f);
                  }

                  if (padding == 2) {
                    a = input.charCodeAt(position) << 8;
                    b = input.charCodeAt(++position);
                    buffer = a + b;
                    output +=
                      TABLE.charAt(buffer >> 10) +
                      TABLE.charAt((buffer >> 4) & 0x3f) +
                      TABLE.charAt((buffer << 2) & 0x3f) +
                      "=";
                  } else if (padding == 1) {
                    buffer = input.charCodeAt(position);
                    output +=
                      TABLE.charAt(buffer >> 2) +
                      TABLE.charAt((buffer << 4) & 0x3f) +
                      "==";
                  }

                  return output;
                };

                var base64 = {
                  encode: encode,
                  decode: decode,
                  version: "0.1.0",
                };

                // Some AMD build optimizers, like r.js, check for specific condition patterns
                // like the following:
                if (
                  typeof define == "function" &&
                  typeof define.amd == "object" &&
                  define.amd
                ) {
                  define(function () {
                    return base64;
                  });
                } else if (freeExports && !freeExports.nodeType) {
                  if (freeModule) {
                    // in Node.js or RingoJS v0.8.0+
                    freeModule.exports = base64;
                  } else {
                    // in Narwhal or RingoJS v0.7.0-
                    for (var key in base64) {
                      base64.hasOwnProperty(key) &&
                        (freeExports[key] = base64[key]);
                    }
                  }
                } else {
                  // in Rhino or a web browser
                  root.base64 = base64;
                }
              })(this);
            }.call(this));
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              /*! https://mths.be/quoted-printable v1.0.1 by @mathias | MIT license */
              (function (root) {
                // Detect free variables `exports`.
                var freeExports = typeof exports == "object" && exports;

                // Detect free variable `module`.
                var freeModule =
                  typeof module == "object" &&
                  module &&
                  module.exports == freeExports &&
                  module;

                // Detect free variable `global`, from Node.js or Browserified code, and use
                // it as `root`.
                var freeGlobal = typeof global == "object" && global;
                if (
                  freeGlobal.global === freeGlobal ||
                  freeGlobal.window === freeGlobal
                ) {
                  root = freeGlobal;
                }

                /*--------------------------------------------------------------------------*/

                var stringFromCharCode = String.fromCharCode;
                var decode = function (input) {
                  return (
                    input
                      // https://tools.ietf.org/html/rfc2045#section-6.7, rule 3:
                      // “Therefore, when decoding a `Quoted-Printable` body, any trailing white
                      // space on a line must be deleted, as it will necessarily have been added
                      // by intermediate transport agents.”
                      .replace(/[\t\x20]$/gm, "")
                      // Remove hard line breaks preceded by `=`. Proper `Quoted-Printable`-
                      // encoded data only contains CRLF line  endings, but for compatibility
                      // reasons we support separate CR and LF too.
                      .replace(/=(?:\r\n?|\n|$)/g, "")
                      // Decode escape sequences of the form `=XX` where `XX` is any
                      // combination of two hexidecimal digits. For optimal compatibility,
                      // lowercase hexadecimal digits are supported as well. See
                      // https://tools.ietf.org/html/rfc2045#section-6.7, note 1.
                      .replace(/=([a-fA-F0-9]{2})/g, function ($0, $1) {
                        var codePoint = parseInt($1, 16);
                        return stringFromCharCode(codePoint);
                      })
                  );
                };

                var handleTrailingCharacters = function (string) {
                  return string
                    .replace(/\x20$/, "=20") // Handle trailing space.
                    .replace(/\t$/, "=09"); // Handle trailing tab.
                };

                var regexUnsafeSymbols = /[\0-\x08\n-\x1F=\x7F-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
                var encode = function (string) {
                  // Encode symbols that are definitely unsafe (i.e. unsafe in any context).
                  var encoded = string.replace(
                    regexUnsafeSymbols,
                    function (symbol) {
                      if (symbol > "\xFF") {
                        throw RangeError(
                          "`quotedPrintable.encode()` expects extended ASCII input only. " +
                            "Don\u2019t forget to encode the input first using a character " +
                            "encoding like UTF-8."
                        );
                      }
                      var codePoint = symbol.charCodeAt(0);
                      var hexadecimal = codePoint.toString(16).toUpperCase();
                      return "=" + ("0" + hexadecimal).slice(-2);
                    }
                  );

                  // Limit lines to 76 characters (not counting the CRLF line endings).
                  var lines = encoded.split(/\r\n?|\n/g);
                  var lineIndex = -1;
                  var lineCount = lines.length;
                  var result = [];
                  while (++lineIndex < lineCount) {
                    var line = lines[lineIndex];
                    // Leave room for the trailing `=` for soft line breaks.
                    var LINE_LENGTH = 75;
                    var index = 0;
                    var length = line.length;
                    while (index < length) {
                      var buffer = encoded.slice(index, index + LINE_LENGTH);
                      // If this line ends with `=`, optionally followed by a single uppercase
                      // hexadecimal digit, we broke an escape sequence in half. Fix it by
                      // moving these characters to the next line.
                      if (/=$/.test(buffer)) {
                        buffer = buffer.slice(0, LINE_LENGTH - 1);
                        index += LINE_LENGTH - 1;
                      } else if (/=[A-F0-9]$/.test(buffer)) {
                        buffer = buffer.slice(0, LINE_LENGTH - 2);
                        index += LINE_LENGTH - 2;
                      } else {
                        index += LINE_LENGTH;
                      }
                      result.push(buffer);
                    }
                  }

                  // Encode space and tab characters at the end of encoded lines. Note that
                  // with the current implementation, this can only occur at the very end of
                  // the encoded string — every other line ends with `=` anyway.
                  var lastLineLength = buffer.length;
                  if (/[\t\x20]$/.test(buffer)) {
                    // There’s a space or a tab at the end of the last encoded line. Remove
                    // this line from the `result` array, as it needs to change.
                    result.pop();
                    if (lastLineLength + 2 <= LINE_LENGTH + 1) {
                      // It’s possible to encode the character without exceeding the line
                      // length limit.
                      result.push(handleTrailingCharacters(buffer));
                    } else {
                      // It’s not possible to encode the character without exceeding the line
                      // length limit. Remvoe the character from the line, and insert a new
                      // line that contains only the encoded character.
                      result.push(
                        buffer.slice(0, lastLineLength - 1),
                        handleTrailingCharacters(
                          buffer.slice(lastLineLength - 1, lastLineLength)
                        )
                      );
                    }
                  }

                  // `Quoted-Printable` uses CRLF.
                  return result.join("=\r\n");
                };

                var quotedPrintable = {
                  encode: encode,
                  decode: decode,
                  version: "1.0.1",
                };

                // Some AMD build optimizers, like r.js, check for specific condition patterns
                // like the following:
                if (
                  typeof define == "function" &&
                  typeof define.amd == "object" &&
                  define.amd
                ) {
                  define(function () {
                    return quotedPrintable;
                  });
                } else if (freeExports && !freeExports.nodeType) {
                  if (freeModule) {
                    // in Node.js, io.js, or RingoJS v0.8.0+
                    freeModule.exports = quotedPrintable;
                  } else {
                    // in Narwhal or RingoJS v0.7.0-
                    for (var key in quotedPrintable) {
                      quotedPrintable.hasOwnProperty(key) &&
                        (freeExports[key] = quotedPrintable[key]);
                    }
                  }
                } else {
                  // in Rhino or a web browser
                  root.quotedPrintable = quotedPrintable;
                }
              })(this);
            }.call(this));
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      3: [
        function (require, module, exports) {
          /**
           * mhtml2html
           *
           * @Author : Mayank Sindwani
           * @Date   : 2016-09-05
           * @Description : Converts mhtml to html.
           *
           * Licensed under the MIT License
           * Copyright(c) 2016 Mayank Sindwani
           **/

          const QuotedPrintable = require("quoted-printable");
          const Base64 = require("base-64");

          // Asserts a condition.
          function assert(condition, error) {
            if (!condition) {
              throw new Error(error);
            }
            return true;
          }

          // Default DOM parser (browser only).
          function defaultDOMParser(asset) {
            assert(typeof DOMParser !== "undefined", "No DOM parser available");
            return {
              window: {
                document: new DOMParser().parseFromString(asset, "text/html"),
              },
            };
          }

          // Returns an absolute url from base and relative paths.
          function absoluteURL(base, relative) {
            if (
              relative.indexOf("http://") === 0 ||
              relative.indexOf("https://") === 0
            ) {
              return relative;
            }

            const stack = base.split("/");
            const parts = relative.split("/");

            stack.pop();

            for (let i = 0; i < parts.length; i++) {
              if (parts[i] == ".") {
                continue;
              } else if (parts[i] == "..") {
                stack.pop();
              } else {
                stack.push(parts[i]);
              }
            }

            return stack.join("/");
          }

          // Replace asset references with the corresponding data.
          function replaceReferences(media, base, asset) {
            const CSS_URL_RULE = "url(";
            let reference, i;

            for (
              i = 0;
              (i = asset.indexOf(CSS_URL_RULE, i)) > 0;
              i += reference.length
            ) {
              i += CSS_URL_RULE.length;
              reference = asset.substring(i, asset.indexOf(")", i));

              // Get the absolute path of the referenced asset.
              const path = absoluteURL(base, reference.replace(/(\"|\')/g, ""));
              if (media[path] != null) {
                if (media[path].type === "text/css") {
                  media[path].data = replaceReferences(
                    media,
                    base,
                    media[path].data
                  );
                }
                // Replace the reference with an encoded version of the resource.
                try {
                  const embeddedAsset = `'data:${media[path].type};base64,${
                    media[path].encoding === "base64"
                      ? media[path].data
                      : Base64.encode(media[path].data)
                  }'`;
                  asset = `${asset.substring(
                    0,
                    i
                  )}${embeddedAsset}${asset.substring(i + reference.length)}`;
                } catch (e) {
                  console.warn(e);
                }
              }
            }
            return asset;
          }

          // Converts the provided asset to a data URI based on the encoding.
          function convertAssetToDataURI(asset) {
            switch (asset.encoding) {
              case "quoted-printable":
                return `data:${asset.type};utf8,${escape(
                  QuotedPrintable.decode(asset.data)
                )}`;
              case "base64":
                return `data:${asset.type};base64,${asset.data}`;
              default:
                return `data:${asset.type};base64,${Base64.encode(asset.data)}`;
            }
          }

          // Main module.
          const mhtml2html = {
            /**
             * Parse
             *
             * Description: Returns an object representing the mhtml and its resources.
             * @param {mhtml} // The mhtml string.
             * @param {options.htmlOnly} // A flag to determine which parsed object to return.
             * @param {options.parseDOM} // The callback to parse an HTML string.
             * @returns an html document without resources if htmlOnly === true; an MHTML parsed object otherwise.
             */
            parse: (
              mhtml,
              { htmlOnly = false, parseDOM = defaultDOMParser } = {}
            ) => {
              const MHTML_FSM = {
                MHTML_HEADERS: 0,
                MTHML_CONTENT: 1,
                MHTML_DATA: 2,
                MHTML_END: 3,
              };

              let asset, headers, content, media, frames; // Record-keeping.
              let location, encoding, type, id; // Content properties.
              let state, key, next, index, i, l; // States.
              let boundary; // Boundaries.

              headers = {};
              content = {};
              media = {};
              frames = {};

              // Initial state and index.
              state = MHTML_FSM.MHTML_HEADERS;
              i = l = 0;

              // Discards characters until a non-whitespace character is encountered.
              function trim() {
                while (
                  assert(i < mhtml.length - 1, "Unexpected EOF") &&
                  /\s/.test(mhtml[i])
                ) {
                  if (mhtml[++i] == "\n") {
                    l++;
                  }
                }
              }

              // Returns the next line from the index.
              function getLine(encoding) {
                const j = i;

                // Wait until a newline character is encountered or when we exceed the str length.
                while (
                  mhtml[i] !== "\n" &&
                  assert(i++ < mhtml.length - 1, "Unexpected EOF")
                );
                i++;
                l++;

                const line = mhtml.substring(j, i);

                // Return the (decoded) line.
                if (encoding === "quoted-printable") {
                  return QuotedPrintable.decode(line);
                }
                if (encoding === "base64") {
                  return line.trim();
                }
                return line;
              }

              // Splits headers from the first instance of ':'.
              function splitHeaders(line, obj) {
                const m = line.indexOf(":");
                if (m > -1) {
                  key = line.substring(0, m).trim();
                  obj[key] = line.substring(m + 1, line.length).trim();
                } else {
                  assert(
                    typeof key !== "undefined",
                    `Missing MHTML headers; Line ${l}`
                  );
                  obj[key] += line.trim();
                }
              }

              while (state != MHTML_FSM.MHTML_END) {
                switch (state) {
                  // Fetch document headers including the boundary to use.
                  case MHTML_FSM.MHTML_HEADERS: {
                    next = getLine();
                    // Use a new line or null character to determine when we should
                    // stop processing headers.
                    if (next != 0 && next != "\n") {
                      splitHeaders(next, headers);
                    } else {
                      assert(
                        typeof headers["Content-Type"] !== "undefined",
                        `Missing document content type; Line ${l}`
                      );
                      const matches = headers["Content-Type"].match(
                        /boundary=(.*)/m
                      );

                      // Ensure the extracted boundary exists.
                      assert(
                        matches != null,
                        `Missing boundary from document headers; Line ${l}`
                      );
                      boundary = matches[1].replace(/\"/g, "");

                      trim();
                      next = getLine();

                      // Expect the next boundary to appear.
                      assert(
                        next.includes(boundary),
                        `Expected boundary; Line ${l}`
                      );
                      content = {};
                      state = MHTML_FSM.MTHML_CONTENT;
                    }
                    break;
                  }

                  // Parse and store content headers.
                  case MHTML_FSM.MTHML_CONTENT: {
                    next = getLine();

                    // Use a new line or null character to determine when we should
                    // stop processing headers.
                    if (next != 0 && next != "\n") {
                      splitHeaders(next, content);
                    } else {
                      encoding = content["Content-Transfer-Encoding"];
                      type = content["Content-Type"];
                      id = content["Content-ID"];
                      location = content["Content-Location"];

                      // Assume the first boundary to be the document.
                      if (typeof index === "undefined") {
                        index = location;
                        assert(
                          typeof index !== "undefined" && type === "text/html",
                          `Index not found; Line ${l}`
                        );
                      }

                      // Ensure the extracted information exists.
                      assert(
                        typeof id !== "undefined" ||
                          typeof location !== "undefined",
                        `ID or location header not provided;  Line ${l}`
                      );
                      assert(
                        typeof encoding !== "undefined",
                        `Content-Transfer-Encoding not provided;  Line ${l}`
                      );
                      assert(
                        typeof type !== "undefined",
                        `Content-Type not provided; Line ${l}`
                      );

                      asset = {
                        encoding: encoding,
                        type: type,
                        data: "",
                        id: id,
                      };

                      // Keep track of frames by ID.
                      if (typeof id !== "undefined") {
                        frames[id] = asset;
                      }

                      // Keep track of resources by location.
                      if (
                        typeof location !== "undefined" &&
                        typeof media[location] === "undefined"
                      ) {
                        media[location] = asset;
                      }

                      trim();
                      content = {};
                      state = MHTML_FSM.MHTML_DATA;
                    }
                    break;
                  }

                  // Map data to content.
                  case MHTML_FSM.MHTML_DATA: {
                    next = getLine(encoding);

                    // Build the decoded string.
                    while (!next.includes(boundary)) {
                      asset.data += next;
                      next = getLine(encoding);
                    }

                    try {
                      // Decode unicode.
                      asset.data = decodeURIComponent(escape(asset.data));
                    } catch (e) {
                      e;
                    }

                    // Ignore assets if 'htmlOnly' is set.
                    if (htmlOnly === true && typeof index !== "undefined") {
                      return parseDOM(asset.data);
                    }

                    // Set the finishing state if there are no more characters.
                    state =
                      i >= mhtml.length - 1
                        ? MHTML_FSM.MHTML_END
                        : MHTML_FSM.MTHML_CONTENT;
                    break;
                  }
                }
              }

              return {
                frames: frames,
                media: media,
                index: index,
              };
            },

            /**
             * Convert
             *
             * Description: Accepts an mhtml string or parsed object and returns the converted html.
             * @param {mhtml} // The mhtml string or object.
             * @param {options.convertIframes} // Whether or not to include iframes in the converted response (defaults to false).
             * @param {options.parseDOM} // The callback to parse an HTML string.
             * @returns an html document element.
             */
            convert: (
              mhtml,
              { convertIframes = false, parseDOM = defaultDOMParser } = {}
            ) => {
              let index, media, frames; // Record-keeping.
              let style, base, img; // DOM objects.
              let href, src; // References.

              if (typeof mhtml === "string") {
                mhtml = mhtml2html.parse(mhtml);
              } else {
                assert(
                  typeof mhtml === "object",
                  "Expected argument of type string or object"
                );
              }

              frames = mhtml.frames;
              media = mhtml.media;
              index = mhtml.index;

              assert(typeof frames === "object", "MHTML error: invalid frames");
              assert(typeof media === "object", "MHTML error: invalid media");
              assert(typeof index === "string", "MHTML error: invalid index");
              assert(
                media[index] && media[index].type === "text/html",
                "MHTML error: invalid index"
              );

              const dom = parseDOM(media[index].data);
              const documentElem = dom.window.document;
              const nodes = [documentElem];

              // Merge resources into the document.
              while (nodes.length) {
                const childNode = nodes.shift();

                // Resolve each node.
                childNode.childNodes.forEach(function (child) {
                  if (child.getAttribute) {
                    href = child.getAttribute("href");
                    src = child.getAttribute("src");
                  }
                  if (child.removeAttribute) {
                    child.removeAttribute("integrity");
                  }
                  switch (child.tagName) {
                    case "HEAD":
                      // Link targets should be directed to the outer frame.
                      base = documentElem.createElement("base");
                      base.setAttribute("target", "_parent");
                      child.insertBefore(base, child.firstChild);
                      break;

                    case "LINK":
                      if (
                        typeof media[href] !== "undefined" &&
                        media[href].type === "text/css"
                      ) {
                        // Embed the css into the document.
                        style = documentElem.createElement("style");
                        style.type = "text/css";
                        media[href].data = replaceReferences(
                          media,
                          href,
                          media[href].data
                        );
                        style.appendChild(
                          documentElem.createTextNode(media[href].data)
                        );
                        childNode.replaceChild(style, child);
                      }
                      break;

                    case "STYLE":
                      style = documentElem.createElement("style");
                      style.type = "text/css";
                      style.appendChild(
                        documentElem.createTextNode(
                          replaceReferences(media, index, child.innerHTML)
                        )
                      );
                      childNode.replaceChild(style, child);
                      break;

                    case "IMG":
                      img = null;
                      if (
                        typeof media[src] !== "undefined" &&
                        media[src].type.includes("image")
                      ) {
                        // Embed the image into the document.
                        try {
                          img = convertAssetToDataURI(media[src]);
                        } catch (e) {
                          console.warn(e);
                        }
                        if (img !== null) {
                          child.setAttribute("src", img);
                        }
                      }
                      child.style.cssText = replaceReferences(
                        media,
                        index,
                        child.style.cssText
                      );
                      break;

                    case "IFRAME":
                      if (convertIframes === true && src) {
                        const id = `<${src.split("cid:")[1]}>`;
                        const frame = frames[id];

                        if (frame && frame.type === "text/html") {
                          const iframe = mhtml2html.convert(
                            {
                              media: Object.assign({}, media, { [id]: frame }),
                              frames: frames,
                              index: id,
                            },
                            { convertIframes, parseDOM }
                          );
                          child.src = `data:text/html;charset=utf-8,${encodeURIComponent(
                            iframe.window.document.documentElement.outerHTML
                          )}`;
                        }
                      }
                      break;

                    default:
                      if (child.style) {
                        child.style.cssText = replaceReferences(
                          media,
                          index,
                          child.style.cssText
                        );
                      }
                      break;
                  }
                  nodes.push(child);
                });
              }
              return dom;
            },
          };

          module.exports = mhtml2html;
        },
        { "base-64": 1, "quoted-printable": 2 },
      ],
    },
    {},
    [3]
  )(3);
});
