var bofuwaEvent = (function () {
    function processThis(callBack, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            callBack.apply(context, outerArg.concat(innerArg));
        }
    }

    function bind(curEle, type, fn) {
        if ("addEventListener" in curEle) {
            curEle.addEventListener(type, fn, false);
            return;
        }
        var tempFn = processThis(fn, curEle);
        tempFn.photo = fn;
        if (!curEle["myBind" + type]) {
            curEle["myBind" + type] = [];
        }
        var ary = curEle["myBind" + type];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].photo === fn) {
                return;
            }
        }
        ary.push(tempFn);
        curEle.attachEvent("on" + type, tempFn);
    }

    function unbind(curEle, type, fn) {
        if ("removeEventListener" in curEle) {
            curEle.removeEventListener(type, fn, false);
            return;
        }
        var ary = curEle["myBind" + type];
        if (ary) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (tempFn.photo === fn) {
                    curEle.detachEvent("on" + type, tempFn);
                    ary.splice(i, 1);
                    break;
                }
            }
        }
    }

    function on(curEle, type, fn) {
        if (!curEle["myEvent" + type]) {
            curEle["myEvent" + type] = [];
        }
        var ary = curEle["myEvent" + type];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === fn) {
                return;
            }
        }
        ary.push(fn);
        bind(curEle, type, fire);
    }

    function off(curEle, type, fn) {
        var ary = curEle["myEvent" + type];
        if (ary) {
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === fn) {
                    ary[i] = null;
                    return;
                }
            }
        }
    }

    function fire(e) {
        if (window.event) {
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }

        var ary = this["myEvent" + e.type];
        if (ary) {
            for (var i = 0; i < ary.length; i++) {
                var curFn = ary[i];
                if (typeof curFn === "function") {
                    curFn.call(this, e);
                } else {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
    }

    return {
        on: on,
        off: off,
        processThis: processThis
    }
})();