jQuery(document).ready(function ($) {
    var l = 2500,
        n = 3800,
        t = n - 3000,
        r = 50,
        o = 150,
        c = 500,
        h = c + 800,
        p = 600,
        e = 1500;

    var s = $(".cd-headline.letters").find("b").each(function () {
        var $this = $(this),
            letters = $this.text().split(""),
            isVisible = $this.hasClass("is-visible");

        for (var i in letters) {
            if ($this.parents(".rotate-2").length > 0) {
                letters[i] = "<em>" + letters[i] + "</em>";
            }
            letters[i] = isVisible
                ? '<i class="in">' + letters[i] + "</i>"
                : '<i>' + letters[i] + "</i>";
        }

        var newContent = letters.join("");
        $this.html(newContent).css("opacity", 1);
    });

    var u = l;

    function f($item) {
        var $nextItem = w($item);

        if ($item.parents(".cd-headline").hasClass("type")) {
            var $wrapper = $item.parent(".cd-words-wrapper");
            $wrapper.addClass("selected").removeClass("waiting");

            setTimeout(function () {
                $wrapper.removeClass("selected");
                $item
                    .removeClass("is-visible")
                    .addClass("is-hidden")
                    .children("i")
                    .removeClass("in")
                    .addClass("out");
            }, c);

            setTimeout(function () {
                C($nextItem, o);
            }, h);
        } else if ($item.parents(".cd-headline").hasClass("letters")) {
            var isLonger =
                $item.children("i").length >= $nextItem.children("i").length;

            function removeLetters($letter, $item, isLast, delay) {
                $letter.removeClass("in").addClass("out");
                if ($letter.is(":last-child")) {
                    if (isLast) {
                        setTimeout(function () {
                            f(w($item));
                        }, l);
                    }
                } else {
                    setTimeout(function () {
                        removeLetters($letter.next(), $item, isLast, delay);
                    }, delay);
                }
            }

            removeLetters($item.find("i").eq(0), $item, isLonger, r);
            m($nextItem.find("i").eq(0), $nextItem, isLonger, r);
        } else if ($item.parents(".cd-headline").hasClass("clip")) {
            $item
                .parents(".cd-words-wrapper")
                .animate({ width: "2px" }, p, function () {
                    v($item, $nextItem);
                    C($nextItem);
                });
        } else if ($item.parents(".cd-headline").hasClass("loading-bar")) {
            $item.parents(".cd-words-wrapper").removeClass("is-loading");
            v($item, $nextItem);
            setTimeout(function () {
                f($nextItem);
            }, n);
            setTimeout(function () {
                $item.parents(".cd-words-wrapper").addClass("is-loading");
            }, t);
        } else {
            v($item, $nextItem);
            setTimeout(function () {
                f($nextItem);
            }, l);
        }
    }

    function C($item, delay) {
        if ($item.parents(".cd-headline").hasClass("type")) {
            m($item.find("i").eq(0), $item, false, delay);
            $item.addClass("is-visible").removeClass("is-hidden");
        } else if ($item.parents(".cd-headline").hasClass("clip")) {
            $item
                .parents(".cd-words-wrapper")
                .animate({ width: $item.width() + 10 }, p, function () {
                    setTimeout(function () {
                        f($item);
                    }, e);
                });
        }
    }

    function m($letter, $word, isLast, delay) {
        $letter.addClass("in").removeClass("out");

        if ($letter.is(":last-child")) {
            if ($word.parents(".cd-headline").hasClass("type")) {
                setTimeout(function () {
                    $word.parents(".cd-words-wrapper").addClass("waiting");
                }, 200);
            }
            if (!isLast) {
                setTimeout(function () {
                    f($word);
                }, l);
            }
        } else {
            setTimeout(function () {
                m($letter.next(), $word, isLast, delay);
            }, delay);
        }
    }

    function w($item) {
        return $item.is(":last-child")
            ? $item.parent().children().eq(0)
            : $item.next();
    }

    function v($oldItem, $newItem) {
        $oldItem.removeClass("is-visible").addClass("is-hidden");
        $newItem.removeClass("is-hidden").addClass("is-visible");
    }

    s.each(function () {
        var $this = $(this);

        if ($this.hasClass("loading-bar")) {
            u = n;
            setTimeout(function () {
                $this.find(".cd-words-wrapper").addClass("is-loading");
            }, t);
        } else if ($this.hasClass("clip")) {
            var width = $this.find(".cd-words-wrapper").width() + 10;
            $this.find(".cd-words-wrapper").css("width", width);
        } else if (!$this.hasClass("type")) {
            var maxWidth = 0;
            $this.find(".cd-words-wrapper b").each(function () {
                var width = $(this).width();
                if (width > maxWidth) {
                    maxWidth = width;
                }
            });
            $this.find(".cd-words-wrapper").css("width", maxWidth);
        }

        setTimeout(function () {
            f($this.find(".is-visible").eq(0));
        }, u);
    });
});