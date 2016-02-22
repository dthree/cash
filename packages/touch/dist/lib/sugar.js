"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
 *  Sugar Library v1.4.1
 *
 *  Freely distributable and licensed under the MIT-style license.
 *  Copyright (c) 2014 Andrew Plummer
 *  http://sugarjs.com/
 *
 * ---------------------------- */
/* istanbul ignore next */
(function () {
  function aa(a) {
    return function () {
      return a;
    };
  }
  /* istanbul ignore next */
  var m = Object,
      p = Array,
      q = RegExp,
      r = Date,
      s = String,
      t = Number,
      u = Math,
      ba = "undefined" !== typeof global ? global : this,
      v = m.prototype.toString,
      da = m.prototype.hasOwnProperty,
      ea = m.defineProperty && m.defineProperties,
      fa = "function" === typeof q(),
      ga = !("0" in new s("a")),
      ia = {},
      ja = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/,
      w = "Boolean Number String Array Date RegExp Function".split(" "),
      la = ka("boolean", w[0]),
      y = ka("number", w[1]),
      z = ka("string", w[2]),
      A = ma(w[3]),
      C = ma(w[4]),
      D = ma(w[5]),
      F = ma(w[6]);
  /* istanbul ignore next */
  function ma(a) {
    var b = "Array" === a && p.isArray || function (b, d) {
      return (d || v.call(b)) === "[object " + a + "]";
    };return ia[a] = b;
  }function ka(a, b) {
    function c(c) {
      return G(c) ? v.call(c) === "[object " + b + "]" : (typeof c === "undefined" ? "undefined" : _typeof(c)) === a;
    }return ia[b] = c;
  }
  function na(a) {
    a.SugarMethods || (oa(a, "SugarMethods", {}), H(a, !1, !0, { extend: function extend(b, c, d) {
        H(a, !1 !== d, c, b);
      }, sugarRestore: function sugarRestore() {
        return pa(this, a, arguments, function (a, c, d) {
          oa(a, c, d.method);
        });
      }, sugarRevert: function sugarRevert() {
        return pa(this, a, arguments, function (a, c, d) {
          d.existed ? oa(a, c, d.original) : delete a[c];
        });
      } }));
  }function H(a, b, c, d) {
    var e = b ? a.prototype : a;na(a);I(d, function (d, f) {
      var h = e[d],
          l = J(e, d);F(c) && h && (f = qa(h, f, c));!1 === c && h || oa(e, d, f);a.SugarMethods[d] = { method: f, existed: l, original: h, instance: b };
    });
  }
  function K(a, b, c, d, e) {
    var g = {};d = z(d) ? d.split(",") : d;d.forEach(function (a, b) {
      e(g, a, b);
    });H(a, b, c, g);
  }function pa(a, b, c, d) {
    var e = 0 === c.length,
        g = L(c),
        f = !1;I(b.SugarMethods, function (b, c) {
      if (e || -1 !== g.indexOf(b)) f = !0, d(c.instance ? a.prototype : a, b, c);
    });return f;
  }function qa(a, b, c) {
    return function (d) {
      return c.apply(this, arguments) ? b.apply(this, arguments) : a.apply(this, arguments);
    };
  }function oa(a, b, c) {
    ea ? m.defineProperty(a, b, { value: c, configurable: !0, enumerable: !1, writable: !0 }) : a[b] = c;
  }
  function L(a, b, c) {
    var d = [];c = c || 0;var e;for (e = a.length; c < e; c++) {
      d.push(a[c]), b && b.call(a, a[c], c);
    }return d;
  }function sa(a, b, c) {
    var d = a[c || 0];A(d) && (a = d, c = 0);L(a, b, c);
  }function ta(a) {
    if (!a || !a.call) throw new TypeError("Callback is not callable");
  }function M(a) {
    return void 0 !== a;
  }function N(a) {
    return void 0 === a;
  }function J(a, b) {
    return !!a && da.call(a, b);
  }function G(a) {
    return !!a && ("object" === (typeof a === "undefined" ? "undefined" : _typeof(a)) || fa && D(a));
  }function ua(a) {
    var b = typeof a === "undefined" ? "undefined" : _typeof(a);return null == a || "string" === b || "number" === b || "boolean" === b;
  }
  function va(a, b) {
    b = b || v.call(a);try {
      if (a && a.constructor && !J(a, "constructor") && !J(a.constructor.prototype, "isPrototypeOf")) return !1;
    } catch (c) {
      return !1;
    }return !!a && "[object Object]" === b && "hasOwnProperty" in a;
  }function I(a, b) {
    for (var c in a) {
      if (J(a, c) && !1 === b.call(a, c, a[c], a)) break;
    }
  }function wa(a, b) {
    for (var c = 0; c < a; c++) {
      b(c);
    }
  }function xa(a, b) {
    I(b, function (c) {
      a[c] = b[c];
    });return a;
  }function ya(a) {
    ua(a) && (a = m(a));if (ga && z(a)) for (var b = a, c = 0, d; d = b.charAt(c);) {
      b[c++] = d;
    }return a;
  }function O(a) {
    xa(this, ya(a));
  }
  O.prototype.constructor = m;var P = u.abs,
      za = u.pow,
      Aa = u.ceil,
      Q = u.floor,
      R = u.round,
      Ca = u.min,
      S = u.max;function Da(a, b, c) {
    var d = za(10, P(b || 0));c = c || R;0 > b && (d = 1 / d);return c(a * d) / d;
  }var Ea = 48,
      Fa = 57,
      Ga = 65296,
      Ha = 65305,
      Ia = ".",
      Ja = "",
      Ka = {},
      La;function Ma() {
    return "\t\n\u000b\f\r   ᠎             \u2028\u2029　﻿";
  }function Na(a, b) {
    var c = "";for (a = a.toString(); 0 < b;) {
      if (b & 1 && (c += a), b >>= 1) a += a;
    }return c;
  }
  function Oa(a, b) {
    var c, d;c = a.replace(La, function (a) {
      a = Ka[a];a === Ia && (d = !0);return a;
    });return d ? parseFloat(c) : parseInt(c, b || 10);
  }function T(a, b, c, d) {
    d = P(a).toString(d || 10);d = Na("0", b - d.replace(/\.\d+/, "").length) + d;if (c || 0 > a) d = (0 > a ? "-" : "+") + d;return d;
  }function Pa(a) {
    if (11 <= a && 13 >= a) return "th";switch (a % 10) {case 1:
        return "st";case 2:
        return "nd";case 3:
        return "rd";default:
        return "th";}
  }
  function Qa(a, b) {
    function c(a, c) {
      if (a || -1 < b.indexOf(c)) d += c;
    }var d = "";b = b || "";c(a.multiline, "m");c(a.ignoreCase, "i");c(a.global, "g");c(a.u, "y");return d;
  }function Ra(a) {
    z(a) || (a = s(a));return a.replace(/([\\/\'*+?|()\[\]{}.^$])/g, "\\$1");
  }function U(a, b) {
    return a["get" + (a._utc ? "UTC" : "") + b]();
  }function Sa(a, b, c) {
    return a["set" + (a._utc && "ISOWeek" != b ? "UTC" : "") + b](c);
  }
  function Ta(a, b) {
    var c = typeof a === "undefined" ? "undefined" : _typeof(a),
        d,
        e,
        g,
        f,
        h,
        l,
        n;if ("string" === c) return a;g = v.call(a);d = va(a, g);e = A(a, g);if (null != a && d || e) {
      b || (b = []);if (1 < b.length) for (l = b.length; l--;) {
        if (b[l] === a) return "CYC";
      }b.push(a);d = a.valueOf() + s(a.constructor);f = e ? a : m.keys(a).sort();l = 0;for (n = f.length; l < n; l++) {
        h = e ? l : f[l], d += h + Ta(a[h], b);
      }b.pop();
    } else d = -Infinity === 1 / a ? "-0" : s(a && a.valueOf ? a.valueOf() : a);return c + g + d;
  }function Ua(a, b) {
    return a === b ? 0 !== a || 1 / a === 1 / b : Va(a) && Va(b) ? Ta(a) === Ta(b) : !1;
  }
  function Va(a) {
    var b = v.call(a);return ja.test(b) || va(a, b);
  }function Wa(a, b, c) {
    var d,
        e = a.length,
        g = b.length,
        f = !1 !== b[g - 1];if (!(g > (f ? 1 : 2))) return Xa(a, e, b[0], f, c);d = [];L(b, function (b) {
      if (la(b)) return !1;d.push(Xa(a, e, b, f, c));
    });return d;
  }function Xa(a, b, c, d, e) {
    d && (c %= b, 0 > c && (c = b + c));return e ? a.charAt(c) : a[c];
  }function Ya(a, b) {
    K(b, !0, !1, a, function (a, b) {
      a[b + ("equal" === b ? "s" : "")] = function () {
        return m[b].apply(null, [this].concat(L(arguments)));
      };
    });
  }na(m);I(w, function (a, b) {
    na(ba[b]);
  });var Za, $a;
  for ($a = 0; 9 >= $a; $a++) {
    Za = s.fromCharCode($a + Ga), Ja += Za, Ka[Za] = s.fromCharCode($a + Ea);
  }Ka[","] = "";Ka["．"] = Ia;Ka[Ia] = Ia;La = q("[" + Ja + "．," + Ia + "]", "g");
  "use strict";H(m, !1, !1, { keys: function keys(a) {
      var b = [];if (!G(a) && !D(a) && !F(a)) throw new TypeError("Object required");I(a, function (a) {
        b.push(a);
      });return b;
    } });
  function ab(a, b, c, d) {
    var e = a.length,
        g = -1 == d,
        f = g ? e - 1 : 0;c = isNaN(c) ? f : parseInt(c >> 0);0 > c && (c = e + c);if (!g && 0 > c || g && c >= e) c = f;for (; g && 0 <= c || !g && c < e;) {
      if (a[c] === b) return c;c += d;
    }return -1;
  }function bb(a, b, c, d) {
    var e = a.length,
        g = 0,
        f = M(c);ta(b);if (0 != e || f) f || (c = a[d ? e - 1 : g], g++);else throw new TypeError("Reduce called on empty array with no initial value");for (; g < e;) {
      f = d ? e - g - 1 : g, f in a && (c = b(c, a[f], f, a)), g++;
    }return c;
  }function cb(a) {
    if (0 === a.length) throw new TypeError("First argument must be defined");
  }H(p, !1, !1, { isArray: function isArray(a) {
      return A(a);
    } });
  H(p, !0, !1, { every: function every(a, b) {
      var c = this.length,
          d = 0;for (cb(arguments); d < c;) {
        if (d in this && !a.call(b, this[d], d, this)) return !1;d++;
      }return !0;
    }, some: function some(a, b) {
      var c = this.length,
          d = 0;for (cb(arguments); d < c;) {
        if (d in this && a.call(b, this[d], d, this)) return !0;d++;
      }return !1;
    }, map: function map(a, b) {
      b = arguments[1];var c = this.length,
          d = 0,
          e = Array(c);for (cb(arguments); d < c;) {
        d in this && (e[d] = a.call(b, this[d], d, this)), d++;
      }return e;
    }, filter: function filter(a) {
      var b = arguments[1],
          c = this.length,
          d = 0,
          e = [];for (cb(arguments); d < c;) {
        d in this && a.call(b, this[d], d, this) && e.push(this[d]), d++;
      }return e;
    }, indexOf: function indexOf(a, b) {
      return z(this) ? this.indexOf(a, b) : ab(this, a, b, 1);
    }, lastIndexOf: function lastIndexOf(a, b) {
      return z(this) ? this.lastIndexOf(a, b) : ab(this, a, b, -1);
    }, forEach: function forEach(a, b) {
      var c = this.length,
          d = 0;for (ta(a); d < c;) {
        d in this && a.call(b, this[d], d, this), d++;
      }
    }, reduce: function reduce(a, b) {
      return bb(this, a, b);
    }, reduceRight: function reduceRight(a, b) {
      return bb(this, a, b, !0);
    } });
  H(Function, !0, !1, { bind: function bind(a) {
      var b = this,
          c = L(arguments, null, 1),
          d;if (!F(this)) throw new TypeError("Function.prototype.bind called on a non-function");d = function d() {
        return b.apply(b.prototype && this instanceof b ? this : a, c.concat(L(arguments)));
      };d.prototype = this.prototype;return d;
    } });H(r, !1, !1, { now: function now() {
      return new r().getTime();
    } });
  (function () {
    var a = Ma().match(/^\s+$/);try {
      s.prototype.trim.call([1]);
    } catch (b) {
      a = !1;
    }H(s, !0, !a, { trim: function trim() {
        return this.toString().trimLeft().trimRight();
      }, trimLeft: function trimLeft() {
        return this.replace(q("^[" + Ma() + "]+"), "");
      }, trimRight: function trimRight() {
        return this.replace(q("[" + Ma() + "]+$"), "");
      } });
  })();
  (function () {
    var a = new r(r.UTC(1999, 11, 31)),
        a = a.toISOString && "1999-12-31T00:00:00.000Z" === a.toISOString();K(r, !0, !a, "toISOString,toJSON", function (a, c) {
      a[c] = function () {
        return T(this.getUTCFullYear(), 4) + "-" + T(this.getUTCMonth() + 1, 2) + "-" + T(this.getUTCDate(), 2) + "T" + T(this.getUTCHours(), 2) + ":" + T(this.getUTCMinutes(), 2) + ":" + T(this.getUTCSeconds(), 2) + "." + T(this.getUTCMilliseconds(), 3) + "Z";
      };
    });
  })();
  "use strict";
  var W,
      Ib,
      Jb = "ampm hour minute second ampm utc offset_sign offset_hours offset_minutes ampm".split(" "),
      Kb = "({t})?\\s*(\\d{1,2}(?:[,.]\\d+)?)(?:{h}([0-5]\\d(?:[,.]\\d+)?)?{m}(?::?([0-5]\\d(?:[,.]\\d+)?){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))",
      Lb = {},
      Mb,
      Nb,
      Ob,
      Pb = [],
      Qb = {},
      X = { yyyy: function yyyy(a) {
      return U(a, "FullYear");
    }, yy: function yy(a) {
      return U(a, "FullYear") % 100;
    }, ord: function ord(a) {
      a = U(a, "Date");return a + Pa(a);
    }, tz: function tz(a) {
      return a.getUTCOffset();
    }, isotz: function isotz(a) {
      return a.getUTCOffset(!0);
    },
    Z: function Z(a) {
      return a.getUTCOffset();
    }, ZZ: function ZZ(a) {
      return a.getUTCOffset().replace(/(\d{2})$/, ":$1");
    } },
      Rb = [{ name: "year", method: "FullYear", k: !0, b: function b(a) {
      return 864E5 * (365 + (a ? a.isLeapYear() ? 1 : 0 : 0.25));
    } }, { name: "month", error: 0.919, method: "Month", k: !0, b: function b(a, _b) {
      var c = 30.4375,
          d;a && (d = a.daysInMonth(), _b <= d.days() && (c = d));return 864E5 * c;
    } }, { name: "week", method: "ISOWeek", b: aa(6048E5) }, { name: "day", error: 0.958, method: "Date", k: !0, b: aa(864E5) }, { name: "hour", method: "Hours", b: aa(36E5) }, { name: "minute",
    method: "Minutes", b: aa(6E4) }, { name: "second", method: "Seconds", b: aa(1E3) }, { name: "millisecond", method: "Milliseconds", b: aa(1) }],
      Sb = {};function Tb(a) {
    xa(this, a);this.g = Pb.concat();
  }
  Tb.prototype = { getMonth: function getMonth(a) {
      return y(a) ? a - 1 : this.months.indexOf(a) % 12;
    }, getWeekday: function getWeekday(a) {
      return this.weekdays.indexOf(a) % 7;
    }, addFormat: function addFormat(a, b, c, d, e) {
      var g = c || [],
          f = this,
          h;a = a.replace(/\s+/g, "[,. ]*");a = a.replace(/\{([^,]+?)\}/g, function (a, b) {
        var d,
            e,
            h,
            B = b.match(/\?$/);h = b.match(/^(\d+)\??$/);var k = b.match(/(\d)(?:-(\d))?/),
            E = b.replace(/[^a-z]+$/, "");h ? d = f.tokens[h[1]] : f[E] ? d = f[E] : f[E + "s"] && (d = f[E + "s"], k && (e = [], d.forEach(function (a, b) {
          var c = b % (f.units ? 8 : d.length);c >= k[1] && c <= (k[2] || k[1]) && e.push(a);
        }), d = e), d = Ub(d));h ? h = "(?:" + d + ")" : (c || g.push(E), h = "(" + d + ")");B && (h += "?");return h;
      });b ? (b = Vb(f, e), e = ["t", "[\\s\\u3000]"].concat(f.timeMarker), h = a.match(/\\d\{\d,\d\}\)+\??$/), Wb(f, "(?:" + b + ")[,\\s\\u3000]+?" + a, Jb.concat(g), d), Wb(f, a + "(?:[,\\s]*(?:" + e.join("|") + (h ? "+" : "*") + ")" + b + ")?", g.concat(Jb), d)) : Wb(f, a, g, d);
    } };
  function Xb(a, b, c) {
    var d,
        e,
        g = b[0],
        f = b[1],
        h = b[2];b = a[c] || a.relative;if (F(b)) return b.call(a, g, f, h, c);e = a.units[8 * (a.plural && 1 < g ? 1 : 0) + f] || a.units[f];a.capitalizeUnit && (e = Yb(e));d = a.modifiers.filter(function (a) {
      return "sign" == a.name && a.value == (0 < h ? 1 : -1);
    })[0];return b.replace(/\{(.*?)\}/g, function (a, b) {
      switch (b) {case "num":
          return g;case "unit":
          return e;case "sign":
          return d.src;}
    });
  }function Zb(a, b) {
    b = b || a.code;return "en" === b || "en-US" === b ? !0 : a.variant;
  }
  function $b(a, b) {
    return b.replace(q(a.num, "g"), function (b) {
      return ac(a, b) || "";
    });
  }function ac(a, b) {
    var c;return y(b) ? b : b && -1 !== (c = a.numbers.indexOf(b)) ? (c + 1) % 10 : 1;
  }function Y(a, b) {
    var c;z(a) || (a = "");c = Sb[a] || Sb[a.slice(0, 2)];if (!1 === b && !c) throw new TypeError("Invalid locale.");return c || Ib;
  }
  function bc(a, b) {
    function c(a) {
      var b = h[a];z(b) ? h[a] = b.split(",") : b || (h[a] = []);
    }function d(a, b) {
      a = a.split("+").map(function (a) {
        return a.replace(/(.+):(.+)$/, function (a, b, c) {
          return c.split("|").map(function (a) {
            return b + a;
          }).join("|");
        });
      }).join("|");a.split("|").forEach(b);
    }function e(a, b, c) {
      var e = [];h[a].forEach(function (a, f) {
        b && (a += "+" + a.slice(0, 3));d(a, function (a, b) {
          e[b * c + f] = a.toLowerCase();
        });
      });h[a] = e;
    }function g(a, b, c) {
      a = "\\d{" + a + "," + b + "}";c && (a += "|(?:" + Ub(h.numbers) + ")+");return a;
    }function f(a, b) {
      h[a] = h[a] || b;
    }var h, l;h = new Tb(b);c("modifiers");"months weekdays units numbers articles tokens timeMarker ampm timeSuffixes dateParse timeParse".split(" ").forEach(c);l = !h.monthSuffix;e("months", l, 12);e("weekdays", l, 7);e("units", !1, 8);e("numbers", !1, 10);f("code", a);f("date", g(1, 2, h.digitDate));f("year", "'\\d{2}|" + g(4, 4));f("num", function () {
      var a = ["-?\\d+"].concat(h.articles);h.numbers && (a = a.concat(h.numbers));return Ub(a);
    }());(function () {
      var a = [];h.i = {};h.modifiers.push({ name: "day", src: "yesterday", value: -1 });
      h.modifiers.push({ name: "day", src: "today", value: 0 });h.modifiers.push({ name: "day", src: "tomorrow", value: 1 });h.modifiers.forEach(function (b) {
        var c = b.name;d(b.src, function (d) {
          var e = h[c];h.i[d] = b;a.push({ name: c, src: d, value: b.value });h[c] = e ? e + "|" + d : d;
        });
      });h.day += "|" + Ub(h.weekdays);h.modifiers = a;
    })();h.monthSuffix && (h.month = g(1, 2), h.months = "1 2 3 4 5 6 7 8 9 10 11 12".split(" ").map(function (a) {
      return a + h.monthSuffix;
    }));h.full_month = g(1, 2) + "|" + Ub(h.months);0 < h.timeSuffixes.length && h.addFormat(Vb(h), !1, Jb);
    h.addFormat("{day}", !0);h.addFormat("{month}" + (h.monthSuffix || ""));h.addFormat("{year}" + (h.yearSuffix || ""));h.timeParse.forEach(function (a) {
      h.addFormat(a, !0);
    });h.dateParse.forEach(function (a) {
      h.addFormat(a);
    });return Sb[a] = h;
  }function Wb(a, b, c, d) {
    a.g.unshift({ r: d, locale: a, q: q("^" + b + "$", "i"), to: c });
  }function Yb(a) {
    return a.slice(0, 1).toUpperCase() + a.slice(1);
  }function Ub(a) {
    return a.filter(function (a) {
      return !!a;
    }).join("|");
  }function cc() {
    var a = r.SugarNewDate;return a ? a() : new r();
  }
  function dc(a, b) {
    var c;if (G(a[0])) return a;if (y(a[0]) && !y(a[1])) return [a[0]];if (z(a[0]) && b) return [ec(a[0]), a[1]];c = {};Nb.forEach(function (b, e) {
      c[b.name] = a[e];
    });return [c];
  }function ec(a) {
    var b,
        c = {};if (a = a.match(/^(\d+)?\s?(\w+?)s?$/i)) N(b) && (b = parseInt(a[1]) || 1), c[a[2].toLowerCase()] = b;return c;
  }function fc(a, b, c) {
    var d;N(c) && (c = Ob.length);for (b = b || 0; b < c && (d = Ob[b], !1 !== a(d.name, d, b)); b++) {}
  }
  function gc(a, b) {
    var c = {},
        d,
        e;b.forEach(function (b, f) {
      d = a[f + 1];N(d) || "" === d || ("year" === b && (c.t = d.replace(/'/, "")), e = parseFloat(d.replace(/'/, "").replace(/,/, ".")), c[b] = isNaN(e) ? d.toLowerCase() : e);
    });return c;
  }function hc(a) {
    a = a.trim().replace(/^just (?=now)|\.+$/i, "");return ic(a);
  }
  function ic(a) {
    return a.replace(Mb, function (a, c, d) {
      var e = 0,
          g = 1,
          f,
          h;if (c) return a;d.split("").reverse().forEach(function (a) {
        a = Lb[a];var b = 9 < a;b ? (f && (e += g), g *= a / (h || 1), h = a) : (!1 === f && (g *= 10), e += g * a);f = b;
      });f && (e += g);return e;
    });
  }
  function jc(a, b, c, d) {
    function e(a) {
      vb.push(a);
    }function g() {
      vb.forEach(function (a) {
        a.call();
      });
    }function f() {
      var a = n.getWeekday();n.setWeekday(7 * (k.num - 1) + (a > Ba ? Ba + 7 : Ba));
    }function h() {
      var a = B.i[k.edge];fc(function (a) {
        if (M(k[a])) return E = a, !1;
      }, 4);if ("year" === E) k.e = "month";else if ("month" === E || "week" === E) k.e = "day";n[(0 > a.value ? "endOf" : "beginningOf") + Yb(E)]();-2 === a.value && n.reset();
    }function l() {
      var a;fc(function (b, c, d) {
        "day" === b && (b = "date");if (M(k[b])) {
          if (d >= wb) return n.setTime(NaN), !1;a = a || {};a[b] = k[b];
          delete k[b];
        }
      });a && e(function () {
        n.set(a, !0);
      });
    }var n, x, ha, vb, B, k, E, wb, Ba, ra, ca;n = cc();vb = [];n.utc(d);C(a) ? n.utc(a.isUTC()).setTime(a.getTime()) : y(a) ? n.setTime(a) : G(a) ? (n.set(a, !0), k = a) : z(a) && (ha = Y(b), a = hc(a), ha && I(ha.o ? [ha.o].concat(ha.g) : ha.g, function (c, d) {
      var g = a.match(d.q);if (g) {
        B = d.locale;k = gc(g, d.to);B.o = d;k.utc && n.utc();if (k.timestamp) return k = k.timestamp, !1;d.r && !z(k.month) && (z(k.date) || Zb(ha, b)) && (ca = k.month, k.month = k.date, k.date = ca);k.year && 2 === k.t.length && (k.year = 100 * R(U(cc(), "FullYear") / 100) - 100 * R(k.year / 100) + k.year);k.month && (k.month = B.getMonth(k.month), k.shift && !k.unit && (k.unit = B.units[7]));k.weekday && k.date ? delete k.weekday : k.weekday && (k.weekday = B.getWeekday(k.weekday), k.shift && !k.unit && (k.unit = B.units[5]));k.day && (ca = B.i[k.day]) ? (k.day = ca.value, n.reset(), x = !0) : k.day && -1 < (Ba = B.getWeekday(k.day)) && (delete k.day, k.num && k.month ? (e(f), k.day = 1) : k.weekday = Ba);k.date && !y(k.date) && (k.date = $b(B, k.date));k.ampm && k.ampm === B.ampm[1] && 12 > k.hour ? k.hour += 12 : k.ampm === B.ampm[0] && 12 === k.hour && (k.hour = 0);if ("offset_hours" in k || "offset_minutes" in k) n.utc(), k.offset_minutes = k.offset_minutes || 0, k.offset_minutes += 60 * k.offset_hours, "-" === k.offset_sign && (k.offset_minutes *= -1), k.minute -= k.offset_minutes;k.unit && (x = !0, ra = ac(B, k.num), wb = B.units.indexOf(k.unit) % 8, E = W.units[wb], l(), k.shift && (ra *= (ca = B.i[k.shift]) ? ca.value : 0), k.sign && (ca = B.i[k.sign]) && (ra *= ca.value), M(k.weekday) && (n.set({ weekday: k.weekday }, !0), delete k.weekday), k[E] = (k[E] || 0) + ra);k.edge && e(h);"-" === k.year_sign && (k.year *= -1);fc(function (a, b, c) {
          b = k[a];var d = b % 1;d && (k[Ob[c - 1].name] = R(d * ("second" === a ? 1E3 : 60)), k[a] = Q(b));
        }, 1, 4);return !1;
      }
    }), k ? x ? n.advance(k) : (n._utc && n.reset(), kc(n, k, !0, !1, c)) : ("now" !== a && (n = new r(a)), d && n.addMinutes(-n.getTimezoneOffset())), g(), n.utc(!1));return { c: n, set: k };
  }function lc(a) {
    var b,
        c = P(a),
        d = c,
        e = 0;fc(function (a, f, h) {
      b = Q(Da(c / f.b(), 1));1 <= b && (d = b, e = h);
    }, 1);return [d, e, a];
  }
  function mc(a) {
    var b = lc(a.millisecondsFromNow());if (6 === b[1] || 5 === b[1] && 4 === b[0] && a.daysFromNow() >= cc().daysInMonth()) b[0] = P(a.monthsFromNow()), b[1] = 6;return b;
  }function nc(a, b, c) {
    function d(a, c) {
      var d = U(a, "Month");return Y(c).months[d + 12 * b];
    }Z(a, d, c);Z(Yb(a), d, c, 1);
  }function Z(a, b, c, d) {
    X[a] = function (a, g) {
      var f = b(a, g);c && (f = f.slice(0, c));d && (f = f.slice(0, d).toUpperCase() + f.slice(d));return f;
    };
  }
  function oc(a, b, c) {
    X[a] = b;X[a + a] = function (a, c) {
      return T(b(a, c), 2);
    };c && (X[a + a + a] = function (a, c) {
      return T(b(a, c), 3);
    }, X[a + a + a + a] = function (a, c) {
      return T(b(a, c), 4);
    });
  }function pc(a) {
    var b = a.match(/(\{\w+\})|[^{}]+/g);Qb[a] = b.map(function (a) {
      a.replace(/\{(\w+)\}/, function (b, e) {
        a = X[e] || e;return e;
      });return a;
    });
  }
  function qc(a, b, c, d) {
    var e;if (!a.isValid()) return "Invalid Date";Date[b] ? b = Date[b] : F(b) && (e = mc(a), b = b.apply(a, e.concat(Y(d))));if (!b && c) return e = e || mc(a), 0 === e[1] && (e[1] = 1, e[0] = 1), a = Y(d), Xb(a, e, 0 < e[2] ? "future" : "past");b = b || "long";if ("short" === b || "long" === b || "full" === b) b = Y(d)[b];Qb[b] || pc(b);var g, f;e = "";b = Qb[b];g = 0;for (c = b.length; g < c; g++) {
      f = b[g], e += F(f) ? f(a, d) : f;
    }return e;
  }
  function rc(a, b, c, d, e) {
    var g,
        f,
        h,
        l = 0,
        n = 0,
        x = 0;g = jc(b, c, null, e);0 < d && (n = x = d, f = !0);if (!g.c.isValid()) return !1;if (g.set && g.set.e) {
      Rb.forEach(function (b) {
        b.name === g.set.e && (l = b.b(g.c, a - g.c) - 1);
      });b = Yb(g.set.e);if (g.set.edge || g.set.shift) g.c["beginningOf" + b]();"month" === g.set.e && (h = g.c.clone()["endOf" + b]().getTime());!f && g.set.sign && "millisecond" != g.set.e && (n = 50, x = -50);
    }f = a.getTime();b = g.c.getTime();h = sc(a, b, h || b + l);return f >= b - n && f <= h + x;
  }
  function sc(a, b, c) {
    b = new r(b);a = new r(c).utc(a.isUTC());23 !== U(a, "Hours") && (b = b.getTimezoneOffset(), a = a.getTimezoneOffset(), b !== a && (c += (a - b).minutes()));return c;
  }
  function kc(a, b, c, d, e) {
    function g(a) {
      return M(b[a]) ? b[a] : b[a + "s"];
    }function f(a) {
      return M(g(a));
    }var h;if (y(b) && d) b = { milliseconds: b };else if (y(b)) return a.setTime(b), a;M(b.date) && (b.day = b.date);fc(function (d, e, g) {
      var l = "day" === d;if (f(d) || l && f("weekday")) return b.e = d, h = +g, !1;!c || "week" === d || l && f("week") || Sa(a, e.method, l ? 1 : 0);
    });Rb.forEach(function (c) {
      var e = c.name;c = c.method;var h;h = g(e);N(h) || (d ? ("week" === e && (h = (b.day || 0) + 7 * h, c = "Date"), h = h * d + U(a, c)) : "month" === e && f("day") && Sa(a, "Date", 15), Sa(a, c, h), d && "month" === e && (e = h, 0 > e && (e = e % 12 + 12), e % 12 != U(a, "Month") && Sa(a, "Date", 0)));
    });d || f("day") || !f("weekday") || a.setWeekday(g("weekday"));var l;a: {
      switch (e) {case -1:
          l = a > cc();break a;case 1:
          l = a < cc();break a;}l = void 0;
    }l && fc(function (b, c) {
      if ((c.k || "week" === b && f("weekday")) && !(f(b) || "day" === b && f("weekday"))) return a[c.j](e), !1;
    }, h + 1);return a;
  }
  function Vb(a, b) {
    var c = Kb,
        d = { h: 0, m: 1, s: 2 },
        e;a = a || W;return c.replace(/{([a-z])}/g, function (c, f) {
      var h = [],
          l = "h" === f,
          n = l && !b;if ("t" === f) return a.ampm.join("|");l && h.push(":");(e = a.timeSuffixes[d[f]]) && h.push(e + "\\s*");return 0 === h.length ? "" : "(?:" + h.join("|") + ")" + (n ? "" : "?");
    });
  }function tc(a, b, c) {
    var d, e;y(a[1]) ? d = dc(a)[0] : (d = a[0], e = a[1]);return jc(d, e, b, c).c;
  }
  H(r, !1, !0, { create: function create() {
      return tc(arguments);
    }, past: function past() {
      return tc(arguments, -1);
    }, future: function future() {
      return tc(arguments, 1);
    }, addLocale: function addLocale(a, b) {
      return bc(a, b);
    }, setLocale: function setLocale(a) {
      var b = Y(a, !1);Ib = b;a && a != b.code && (b.code = a);return b;
    }, getLocale: function getLocale(a) {
      return a ? Y(a, !1) : Ib;
    }, addFormat: function addFormat(a, b, c) {
      Wb(Y(c), a, b);
    } });
  H(r, !0, !0, { set: function set() {
      var a = dc(arguments);return kc(this, a[0], a[1]);
    }, setWeekday: function setWeekday(a) {
      if (!N(a)) return Sa(this, "Date", U(this, "Date") + a - U(this, "Day"));
    }, setISOWeek: function setISOWeek(a) {
      var b = U(this, "Day") || 7;if (!N(a)) return this.set({ month: 0, date: 4 }), this.set({ weekday: 1 }), 1 < a && this.addWeeks(a - 1), 1 !== b && this.advance({ days: b - 1 }), this.getTime();
    }, getISOWeek: function getISOWeek() {
      var a;a = this.clone();var b = U(a, "Day") || 7;a.addDays(4 - b).reset();return 1 + Q(a.daysSince(a.clone().beginningOfYear()) / 7);
    }, beginningOfISOWeek: function beginningOfISOWeek() {
      var a = this.getDay();0 === a ? a = -6 : 1 !== a && (a = 1);this.setWeekday(a);return this.reset();
    }, endOfISOWeek: function endOfISOWeek() {
      0 !== this.getDay() && this.setWeekday(7);return this.endOfDay();
    }, getUTCOffset: function getUTCOffset(a) {
      var b = this._utc ? 0 : this.getTimezoneOffset(),
          c = !0 === a ? ":" : "";return !b && a ? "Z" : T(Q(-b / 60), 2, !0) + c + T(P(b % 60), 2);
    }, utc: function utc(a) {
      oa(this, "_utc", !0 === a || 0 === arguments.length);return this;
    }, isUTC: function isUTC() {
      return !!this._utc || 0 === this.getTimezoneOffset();
    }, advance: function advance() {
      var a = dc(arguments, !0);return kc(this, a[0], a[1], 1);
    }, rewind: function rewind() {
      var a = dc(arguments, !0);return kc(this, a[0], a[1], -1);
    }, isValid: function isValid() {
      return !isNaN(this.getTime());
    }, isAfter: function isAfter(a, b) {
      return this.getTime() > r.create(a).getTime() - (b || 0);
    }, isBefore: function isBefore(a, b) {
      return this.getTime() < r.create(a).getTime() + (b || 0);
    }, isBetween: function isBetween(a, b, c) {
      var d = this.getTime();a = r.create(a).getTime();var e = r.create(b).getTime();b = Ca(a, e);a = S(a, e);c = c || 0;return b - c < d && a + c > d;
    }, isLeapYear: function isLeapYear() {
      var a = U(this, "FullYear");return 0 === a % 4 && 0 !== a % 100 || 0 === a % 400;
    },
    daysInMonth: function daysInMonth() {
      return 32 - U(new r(U(this, "FullYear"), U(this, "Month"), 32), "Date");
    }, format: function format(a, b) {
      return qc(this, a, !1, b);
    }, relative: function relative(a, b) {
      z(a) && (b = a, a = null);return qc(this, a, !0, b);
    }, is: function is(a, b, c) {
      var d, e;if (this.isValid()) {
        if (z(a)) switch (a = a.trim().toLowerCase(), e = this.clone().utc(c), !0) {case "future" === a:
            return this.getTime() > cc().getTime();case "past" === a:
            return this.getTime() < cc().getTime();case "weekday" === a:
            return 0 < U(e, "Day") && 6 > U(e, "Day");case "weekend" === a:
            return 0 === U(e, "Day") || 6 === U(e, "Day");case -1 < (d = W.weekdays.indexOf(a) % 7):
            return U(e, "Day") === d;case -1 < (d = W.months.indexOf(a) % 12):
            return U(e, "Month") === d;}return rc(this, a, null, b, c);
      }
    }, reset: function reset(a) {
      var b = {},
          c;a = a || "hours";"date" === a && (a = "days");c = Rb.some(function (b) {
        return a === b.name || a === b.name + "s";
      });b[a] = a.match(/^days?/) ? 1 : 0;return c ? this.set(b, !0) : this;
    }, clone: function clone() {
      var a = new r(this.getTime());a.utc(!!this._utc);return a;
    } });
  H(r, !0, !0, { iso: function iso() {
      return this.toISOString();
    }, getWeekday: r.prototype.getDay, getUTCWeekday: r.prototype.getUTCDay });function uc(a, b) {
    function c() {
      return R(this * b);
    }function d() {
      return tc(arguments)[a.j](this);
    }function e() {
      return tc(arguments)[a.j](-this);
    }var g = a.name,
        f = {};f[g] = c;f[g + "s"] = c;f[g + "Before"] = e;f[g + "sBefore"] = e;f[g + "Ago"] = e;f[g + "sAgo"] = e;f[g + "After"] = d;f[g + "sAfter"] = d;f[g + "FromNow"] = d;f[g + "sFromNow"] = d;t.extend(f);
  }H(t, !0, !0, { duration: function duration(a) {
      a = Y(a);return Xb(a, lc(this), "duration");
    } });
  W = Ib = r.addLocale("en", { plural: !0, timeMarker: "at", ampm: "am,pm", months: "January,February,March,April,May,June,July,August,September,October,November,December", weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday", units: "millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s", numbers: "one,two,three,four,five,six,seven,eight,nine,ten", articles: "a,an,the", tokens: "the,st|nd|rd|th,of", "short": "{Month} {d}, {yyyy}", "long": "{Month} {d}, {yyyy} {h}:{mm}{tt}", full: "{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}",
    past: "{num} {unit} {sign}", future: "{num} {unit} {sign}", duration: "{num} {unit}", modifiers: [{ name: "sign", src: "ago|before", value: -1 }, { name: "sign", src: "from now|after|from|in|later", value: 1 }, { name: "edge", src: "last day", value: -2 }, { name: "edge", src: "end", value: -1 }, { name: "edge", src: "first day|beginning", value: 1 }, { name: "shift", src: "last", value: -1 }, { name: "shift", src: "the|this", value: 0 }, { name: "shift", src: "next", value: 1 }], dateParse: ["{month} {year}", "{shift} {unit=5-7}", "{0?} {date}{1}", "{0?} {edge} of {shift?} {unit=4-7?}{month?}{year?}"],
    timeParse: "{num} {unit} {sign};{sign} {num} {unit};{0} {num}{1} {day} of {month} {year?};{weekday?} {month} {date}{1?} {year?};{date} {month} {year};{date} {month};{shift} {weekday};{shift} week {weekday};{weekday} {2?} {shift} week;{num} {unit=4-5} {sign} {day};{0?} {date}{1} of {month};{0?}{month?} {date?}{1?} of {shift} {unit=6-7}".split(";") });Ob = Rb.concat().reverse();Nb = Rb.concat();Nb.splice(2, 1);
  K(r, !0, !0, Rb, function (a, b, c) {
    function d(a) {
      a /= f;var c = a % 1,
          d = b.error || 0.999;c && P(c % 1) > d && (a = R(a));return 0 > a ? Aa(a) : Q(a);
    }var e = b.name,
        g = Yb(e),
        f = b.b(),
        h,
        l;b.j = "add" + g + "s";h = function h(a, b) {
      return d(this.getTime() - r.create(a, b).getTime());
    };l = function l(a, b) {
      return d(r.create(a, b).getTime() - this.getTime());
    };a[e + "sAgo"] = l;a[e + "sUntil"] = l;a[e + "sSince"] = h;a[e + "sFromNow"] = h;a[b.j] = function (a, b) {
      var c = {};c[e] = a;return this.advance(c, b);
    };uc(b, f);3 > c && ["Last", "This", "Next"].forEach(function (b) {
      a["is" + b + g] = function () {
        return rc(this, b + " " + e, "en");
      };
    });4 > c && (a["beginningOf" + g] = function () {
      var a = {};switch (e) {case "year":
          a.year = U(this, "FullYear");break;case "month":
          a.month = U(this, "Month");break;case "day":
          a.day = U(this, "Date");break;case "week":
          a.weekday = 0;}return this.set(a, !0);
    }, a["endOf" + g] = function () {
      var a = { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 };switch (e) {case "year":
          a.month = 11;a.day = 31;break;case "month":
          a.day = this.daysInMonth();break;case "week":
          a.weekday = 6;}return this.set(a, !0);
    });
  });
  W.addFormat("([+-])?(\\d{4,4})[-.]?{full_month}[-.]?(\\d{1,2})?", !0, ["year_sign", "year", "month", "date"], !1, !0);W.addFormat("(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?", !0, ["date", "month", "year"], !0);W.addFormat("{full_month}[-.](\\d{4,4})", !1, ["month", "year"]);W.addFormat("\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/", !1, ["timestamp"]);W.addFormat(Vb(W), !1, Jb);Pb = W.g.slice(0, 7).reverse();W.g = W.g.slice(7).concat(Pb);oc("f", function (a) {
    return U(a, "Milliseconds");
  }, !0);
  oc("s", function (a) {
    return U(a, "Seconds");
  });oc("m", function (a) {
    return U(a, "Minutes");
  });oc("h", function (a) {
    return U(a, "Hours") % 12 || 12;
  });oc("H", function (a) {
    return U(a, "Hours");
  });oc("d", function (a) {
    return U(a, "Date");
  });oc("M", function (a) {
    return U(a, "Month") + 1;
  });(function () {
    function a(a, c) {
      var d = U(a, "Hours");return Y(c).ampm[Q(d / 12)] || "";
    }Z("t", a, 1);Z("tt", a);Z("T", a, 1, 1);Z("TT", a, null, 2);
  })();
  /* istanbul ignore next */
  (function () {
    function a(a, c) {
      var d = U(a, "Day");return Y(c).weekdays[d];
    }Z("dow", a, 3);Z("Dow", a, 3, 1);Z("weekday", a);Z("Weekday", a, null, 1);
  })();nc("mon", 0, 3);nc("month", 0);nc("month2", 1);nc("month3", 2);X.ms = X.f;X.milliseconds = X.f;X.seconds = X.s;X.minutes = X.m;X.hours = X.h;X["24hr"] = X.H;X["12hr"] = X.h;X.date = X.d;X.day = X.d;X.year = X.yyyy;K(r, !0, !0, "short,long,full", function (a, b) {
    a[b] = function (a) {
      return qc(this, b, !1, a);
    };
  });
  "〇一二三四五六七八九十百千万".split("").forEach(function (a, b) {
    9 < b && (b = za(10, b - 9));Lb[a] = b;
  });xa(Lb, Ka);Mb = q("([期週周])?([〇一二三四五六七八九十百千万" + Ja + "]+)(?!昨)", "g");
  /* istanbul ignore next */
  (function () {
    var a = W.weekdays.slice(0, 7),
        b = W.months.slice(0, 12);K(r, !0, !0, "today yesterday tomorrow weekday weekend future past".split(" ").concat(a).concat(b), function (a, b) {
      a["is" + Yb(b)] = function (a) {
        return this.is(b, 0, a);
      };
    });
  })();r.utc || (r.utc = { create: function create() {
      return tc(arguments, 0, !0);
    }, past: function past() {
      return tc(arguments, -1, !0);
    }, future: function future() {
      return tc(arguments, 1, !0);
    } });
  H(r, !1, !0, { RFC1123: "{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}", RFC1036: "{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}", ISO8601_DATE: "{yyyy}-{MM}-{dd}", ISO8601_DATETIME: "{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}" });
})();