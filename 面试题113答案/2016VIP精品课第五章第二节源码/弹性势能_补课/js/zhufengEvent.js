(function () {
    //->bind:给当前元素的某一个行为绑定方法(this问题和重复问题)
    function bind(curEle, evenType, evenFn) {
        if ("addEventListener" in document) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }

        var tempFn = function () {
            evenFn.call(curEle);
        };
        tempFn.photo = evenFn;

        if (!curEle["myBind" + evenType]) {
            curEle["myBind" + evenType] = [];
        }
        var ary = curEle["myBind" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i].photo === evenFn) {
                return;
            }
        }
        ary.push(tempFn);
        curEle.attachEvent("on" + evenType, tempFn);
    }

    //->unbind:移除当前元素的某一个行为绑定的某个方法
    function unbind(curEle, evenType, evenFn) {
        if ("removeEventListener" in document) {
            curEle.removeEventListener(evenType, evenFn, false);
            return;
        }

        var ary = curEle["myBind" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur.photo === evenFn) {
                    curEle.detachEvent("on" + evenType, cur);
                    ary.splice(i, 1);
                    break;
                }
            }
        }
    }

    //->on:把给当前元素某一个行为类型绑定的所有的方法都存放到自己定义的容器中
    function on(curEle, evenType, evenFn) {
        if (!curEle["myEvent" + evenType]) {
            curEle["myEvent" + evenType] = [];
        }
        var ary = curEle["myEvent" + evenType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === evenFn) {
                return;
            }
        }
        ary.push(evenFn);
        bind(curEle, evenType, run);
    }

    //->off:在自己定义的容器中,把需要删除的方法从容器中删除掉
    function off(curEle, evenType, evenFn) {
        var ary = curEle["myEvent" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur === evenFn) {
                    ary[i] = null;
                    break;
                }
            }
        }
    }

    //->run:是我们唯一给当前元素的某个行为在内置事件池中绑定的方法，当行为触发，执行run方法，我们在run中在分别的把存储在自己容器中的所有的方法依次的执行
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

        var ary = this["myEvent" + e.type];
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (typeof tempFn === "function") {
                tempFn.call(this, e);
            } else {
                ary.splice(i, 1);
                i--;
            }
        }
    }

    window.zhufengEvent = {
        on: on,
        off: off
    };
})();
