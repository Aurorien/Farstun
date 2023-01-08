function FindApi() {
  (this._applicationUrl = "/"),
    (this._serviceApiBaseUrl = ""),
    (this._trackId = ""),
    (this._trackParam = "_t_"),
    (this._dontTrackQueryParam = "_t_dtq"),
    (this._allowTrackingCookieName = null),
    (this._bufferTrackRequest = !0),
    (this.setApplicationUrl = function (t) {
      this._applicationUrl = t;
    }),
    (this.setServiceApiBaseUrl = function (t) {
      this._serviceApiBaseUrl = t;
    }),
    (this.setAllowTrackingCookieName = function (t) {
      this._allowTrackingCookieName = t;
    }),
    (this.setTrackParam = function (t) {
      this._trackParam = t;
    }),
    (this.setDontTrackQueryParam = function (t) {
      this._dontTrackQueryParam = t;
    }),
    (this.bindWindowEvents = function () {
      var t = this;
      window.history &&
        (window.onbeforeunload = function () {
          var e = document.location.href;
          e.indexOf("q=") > 0 &&
            -1 == e.indexOf(t._dontTrackQueryParam + "=") &&
            window.history.replaceState(
              window.history.state,
              window.document.title,
              e +
                (e.indexOf("?") > 0 ? "&" : "?") +
                t._dontTrackQueryParam +
                "=true"
            );
        }),
        window.addEventListener(
          "load",
          function () {
            var e = t._toArray(document.getElementsByTagName("A")),
              r = document.createElement("A");
            r.href = document.location.href;
            for (var n = 0; e.length > n; n++) {
              var i = function () {
                for (
                  var i = !1,
                    a = e[n].href,
                    o = t._getTrackQueryParamsFromUrl(a),
                    s = 0;
                  o.trackQueryParams.length > s;
                  s++
                )
                  if (0 == o.trackQueryParams[s].indexOf("id")) {
                    i = !0;
                    break;
                  }
                if (o.trackQueryParams.length > 0 && i) {
                  var u = document.createElement("A");
                  if (
                    ((u.href = a),
                    ("/" != t._applicationUrl &&
                      r.hostname + t._applicationUrl !=
                        u.hostname + "/" + u.pathname.split("/")[1] + "/") ||
                      "/" === t._applicationUrl)
                  ) {
                    if (
                      -1 !=
                      a.split("?")[0].indexOf(t._serviceApiBaseUrl + "_click")
                    )
                      return;
                    (e[n].href = t._getUriWithoutTrackParams(a, o)),
                      e[n].addEventListener("mousedown", function c(e) {
                        this.addEventListener("mouseup", function r(n) {
                          if (
                            e.target == n.target &&
                            e.which == n.which &&
                            (1 == n.which || 2 == n.which)
                          ) {
                            this.removeEventListener("mousedown", c),
                              this.removeEventListener("mouseup", r);
                            var i = t._constructTrackUrl(o.trackQueryParams);
                            t._sendEvent(i, !0);
                          }
                        });
                      });
                  }
                }
              };
              i();
            }
          },
          !1
        );
    }),
    (this.bindAClickEvent = function () {}),
    (this._getUriWithoutTrackParams = function (t, e) {
      return e.trackQueryParams.length > 0 && e.nonTrackQueryParams.length > 0
        ? t.split("?")[0] + "?" + e.nonTrackQueryParams.join("&")
        : e.trackQueryParams.length > 0
        ? t.split("?")[0]
        : void 0;
    }),
    (this._getTrackQueryParamsFromUrl = function (t) {
      var e = t.split("?")[1] || "",
        r = e.split("&"),
        n = [],
        i = [];
      this._bufferTrackRequest = !0;
      for (var a = 0; r.length > a; a++) {
        var o = r[a].split("=");
        if (
          (decodeURIComponent(o[0]) == this._dontTrackQueryParam &&
            "true" == o[1] &&
            (this._bufferTrackRequest = !1),
          decodeURIComponent(o[0]).slice(0, this._trackParam.length) ==
            this._trackParam)
        ) {
          var s = decodeURIComponent(o[0]).slice(this._trackParam.length);
          n.push(encodeURIComponent(s) + "=" + o[1]);
        } else i.push(r[a]);
      }
      return { trackQueryParams: n, nonTrackQueryParams: i };
    }),
    (this._constructTrackUrl = function (t) {
      return this._serviceApiBaseUrl + "_track?" + t.join("&");
    }),
    (this.processEventFromCurrentUri = function () {
      var t = document.location.href,
        e = this._getTrackQueryParamsFromUrl(t);
      e.trackQueryParams.length > 0 &&
        (this._bufferTrackRequest &&
          this._bufferEvent(this._constructTrackUrl(e.trackQueryParams)),
        window.history &&
          window.history.replaceState(
            window.history.state,
            window.document.title,
            this._getUriWithoutTrackParams(t, e)
          ));
    }),
    (this._toArray = function (t) {
      var e = [];
      if (!t || !t.length) return e;
      for (var r = 0; t.length > r; r++) r in t && e.push(t[r]);
      return e;
    }),
    (this._getCookies = function (t, e) {
      var r,
        n,
        i,
        a = [],
        o = document.cookie.split(";");
      for (
        r = 0;
        o.length > r &&
        ((n = o[r].substr(0, o[r].indexOf("="))),
        (n = n.replace(/^\s+|\s+$/g, "")),
        (t && !t(n)) ||
          ((i = o[r].substr(o[r].indexOf("=") + 1)),
          a.push({ name: n, value: decodeURIComponent(i) }),
          !e || 0 !== --e));
        r++
      );
      return a;
    }),
    (this._getCookie = function (t) {
      var e = this._getCookies(function (e) {
        return t === e;
      }, 1);
      return e.length ? e[0].value : void 0;
    }),
    (this._setCookie = function (t, e, r) {
      var n = new Date();
      n.setDate(n.getDate() + r),
        (e =
          encodeURIComponent(e) +
          "; Path=/" +
          (null === r ? "" : "; expires=" + n.toUTCString())),
        (document.cookie = t + "=" + e);
    }),
    (this._deleteCookie = function (t) {
      document.cookie = t + "=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }),
    (this._debug = function (t) {
      window.console && console.log(t);
    }),
    (this._getBufferedEvents = function () {
      return this._getCookies(function (t) {
        return 0 === t.indexOf("_findEvent");
      });
    }),
    (this._bufferEvent = function (t) {
      this._setCookie("_findEvent" + this._createUUID(), t, 3650);
    }),
    (this._deleteBufferedEvent = function (t) {
      this._deleteCookie(t);
    }),
    (this.sendBufferedEvents = function () {
      for (var t = this._getBufferedEvents(), e = 0; t.length > e; e++)
        this._sendEvent(t[e].value, !1), this._deleteBufferedEvent(t[e].name);
    }),
    (this._sendEvent = function (t, e) {
      const r = "keepalive" in new Request("");
      if (e && !r) return this._bufferEvent(t), void 0;
      if (window.fetch)
        return (
          fetch(t, {
            method: "GET",
            keepalive: !0,
            credentials: "same-origin",
            headers: { Accept: "application/json" },
          })
            .then(function (t) {
              return t.json();
            })
            .then(function (t) {
              return t;
            })
            .catch(function (t) {
              return t;
            }),
          void 0
        );
      if (window.XMLHttpRequest) {
        var n = new XMLHttpRequest();
        if ("withCredentials" in n)
          return n.open("GET", t, !1), n.send(), void 0;
      }
      if (window.XDomainRequest) {
        var i = new XDomainRequest();
        return i.open("GET", t), i.send(), void 0;
      }
      var a = new Image(1, 1);
      a.src = t;
    }),
    (this._createUUID = function () {
      for (
        var t = "", e = this._PRNG();
        32 > t.length;
        t += Math.floor(4294967295 * e()).toString(16)
      );
      return [
        t.substr(0, 8),
        t.substr(8, 4),
        "4" + t.substr(12, 3),
        "89AB"[Math.floor(4 * Math.random())] + t.substr(16, 3),
        t.substr(20, 12),
      ].join("-");
    }),
    (this._PRNG = function () {
      return (function (t) {
        var e = 0,
          r = 0,
          n = 0,
          i = 1,
          a = [],
          o = 0,
          s = 4022871197,
          u = function (t) {
            t = "" + t;
            for (var e = 0; t.length > e; e++) {
              s += t.charCodeAt(e);
              var r = 0.02519603282416938 * s;
              (s = r >>> 0),
                (r -= s),
                (r *= s),
                (s = r >>> 0),
                (r -= s),
                (s += 4294967296 * r);
            }
            return 2.3283064365386963e-10 * (s >>> 0);
          };
        (e = u(" ")), (r = u(" ")), (n = u(" "));
        for (var c = 0; 8 > c; c++) a[c] = u(" ");
        0 === t.length && (t = [+new Date()]);
        for (var h = 0; t.length > h; h++)
          for (
            e -= u(t[h]),
              0 > e && (e += 1),
              r -= u(t[h]),
              0 > r && (r += 1),
              n -= u(t[h]),
              0 > n && (n += 1),
              c = 0;
            8 > c;
            c++
          )
            (a[c] -= u(t[h])), 0 > a[c] && (a[c] += 1);
        var f = function () {
          var t = 2091639;
          o = 0 | (8 * a[o]);
          var s = a[o],
            u = t * e + 2.3283064365386963e-10 * i;
          return (
            (e = r),
            (r = n),
            (n = u - (i = 0 | u)),
            (a[o] -= n),
            0 > a[o] && (a[o] += 1),
            s
          );
        };
        return (
          (f.uint32 = function () {
            return 4294967296 * f();
          }),
          (f.fract53 = function () {
            return f() + 1.1102230246251565e-16 * (0 | (2097152 * f()));
          }),
          (f.addNoise = function () {
            for (var t = arguments.length - 1; t >= 0; t--)
              for (c = 0; 8 > c; c++)
                (a[c] -= u(arguments[t])), 0 > a[c] && (a[c] += 1);
          }),
          (f.version = "Kybos 0.9"),
          (f.args = t),
          f
        );
      })(Array.prototype.slice.call(arguments));
    });
}
