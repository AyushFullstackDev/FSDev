(function () {
    function bind(fn, context) {
        return function () {
            return fn.apply(context, arguments);
        };
    }

    var indexOf = [].indexOf || function (item) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

    function WOW(options) {
        if (options == null) options = {};
        this.scrollCallback = bind(this.scrollCallback, this);
        this.scrollHandler = bind(this.scrollHandler, this);
        this.resetAnimation = bind(this.resetAnimation, this);
        this.start = bind(this.start, this);
        this.scrolled = true;

        this.config = this.util().extend(options, this.defaults);

        if (options.scrollContainer != null) {
            this.config.scrollContainer = document.querySelector(options.scrollContainer);
        }

        this.animationNameCache = new Cache();
        this.wowEvent = this.util().createEvent(this.config.boxClass);
    }

    function Cache() {
        this.keys = [];
        this.values = [];
    }

    Cache.prototype.get = function (key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === key) {
                return this.values[i];
            }
        }
    };

    Cache.prototype.set = function (key, value) {
        for (var i = 0; i < this.keys.length; i++) {
            if (this.keys[i] === key) {
                this.values[i] = value;
                return;
            }
        }
        this.keys.push(key);
        this.values.push(value);
    };

    WOW.prototype.defaults = {
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: true,
        live: true,
        callback: null,
        scrollContainer: null
    };

    WOW.prototype.init = function () {
        this.element = window.document.documentElement;
        if (document.readyState === "interactive" || document.readyState === "complete") {
            this.start();
        } else {
            this.util().addEvent(document, "DOMContentLoaded", this.start);
        }
        this.finished = [];
    };

    WOW.prototype.start = function () {
        this.stopped = false;
        this.boxes = Array.prototype.slice.call(this.element.querySelectorAll("." + this.config.boxClass));
        this.all = Array.prototype.slice.call(this.boxes);

        if (this.boxes.length) {
            if (this.disabled()) {
                this.resetStyle();
            } else {
                for (var i = 0; i < this.boxes.length; i++) {
                    this.applyStyle(this.boxes[i], true);
                }
            }
        }

        if (!this.disabled()) {
            this.util().addEvent(this.config.scrollContainer || window, "scroll", this.scrollHandler);
            this.util().addEvent(window, "resize", this.scrollHandler);
            this.interval = setInterval(this.scrollCallback, 50);
        }

        if (this.config.live) {
            new MutationObserver((mutations) => {
                for (var mutation of mutations) {
                    Array.prototype.slice.call(mutation.addedNodes).forEach((node) => {
                        this.doSync(node);
                    });
                }
            }).observe(document.body, { childList: true, subtree: true });
        }
    };

    WOW.prototype.util = function () {
        if (!this._util) {
            this._util = new Util();
        }
        return this._util;
    };

    function Util() {}

    Util.prototype.extend = function (target, source) {
        for (var key in source) {
            if (target[key] == null) {
                target[key] = source[key];
            }
        }
        return target;
    };

    Util.prototype.isMobile = function (userAgent) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    };

    Util.prototype.createEvent = function (eventName) {
        var event;
        if (document.createEvent) {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, false, false, null);
        } else {
            event = document.createEventObject();
            event.eventType = eventName;
        }
        return event;
    };

    Util.prototype.addEvent = function (el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + event, fn);
        } else {
            el[event] = fn;
        }
    };

    Util.prototype.removeEvent = function (el, event, fn) {
        if (el.removeEventListener) {
            el.removeEventListener(event, fn, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + event, fn);
        } else {
            delete el[event];
        }
    };

    Util.prototype.innerHeight = function () {
        return window.innerHeight || document.documentElement.clientHeight;
    };

    window.WOW = WOW;
})();