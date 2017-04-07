function bind(curEle, evenType, evenFn) {
    if (document.addEventListener) {
        curEle.addEventListener(evenType, evenFn, false);
        return;
    }
    //1)给每一次传递进来需要绑定的方法进行化妆
    var tempFn = function () {
        evenFn.call(curEle);
    };
    //把化妆前的放到脑门上,后期需要拿化妆前的比较
    tempFn.photo = evenFn;

    //2)把它存储到一个容器中(容器中存储的是所有需要绑定的方法化妆后的函数)
    if (!curEle["my" + evenType]) {
        curEle["my" + evenType] = [];
    }
    var ary = curEle["my" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === evenFn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + evenType, tempFn);
}

function unbind(curEle, evenType, evenFn) {
    if (document.removeEventListener) {
        curEle.removeEventListener(evenType, evenFn, false);
        return;
    }
    var ary = curEle["my" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var tempFn = ary[i];
        if (tempFn.photo === evenFn) {
            curEle.detachEvent("on" + evenType, tempFn);
            break;
        }
    }
}

/*顺序问题:内置的事件池不能用了,我们自己写一套事件池来执行我们的方法*/
function on(curEle, evenType, evenFn) {
    !curEle["myEvent" + evenType] ? curEle["myEvent" + evenType] = [] : null;
    var ary = curEle["myEvent" + evenType];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] == evenFn) {
            return;
        }
    }
    ary.push(evenFn);
    bind(curEle, evenType, run);
}

function off(curEle, evenType, evenFn) {
    var ary = curEle["myEvent" + evenType];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i] == evenFn) {
            ary[i] = null;
            break;
        }
    }
}

function run(e) {
    e = e || window.event;
    var flag = e.target ? true : false;
    if (!flag) {
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

    //this->curEle
    var ary = this["myEvent" + e.type];
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

function processThis(context, callback) {
    var outerArg = Array.prototype.slice.call(arguments, 2);
    return function () {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        var arg = innerArg.concat(outerArg);
        typeof callback === "function" ? callback.apply(context, arg) : null;
    }
}


