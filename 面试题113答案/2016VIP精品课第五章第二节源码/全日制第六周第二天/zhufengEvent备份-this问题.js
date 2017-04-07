(function () {

    //->bind:给当前元素的某一个行为绑定方法
    function bind(curEle, evenType, evenFn) {
        if ("addEventListener" in document) {
            curEle.addEventListener(evenType, evenFn, false);
            return;
        }

        var tempFn = function () {
            //->this是window
            evenFn.call(curEle);
        };
        tempFn.photo = evenFn;

        //curEle["myBind"] = tempFn;//->第一次给自定属性存储的是fn1包装后的结果,第二次让它的值变为fn2包装后的结果,这样的话就把上一次的给覆盖掉了
        if (!curEle["myBind" + evenType]) {
            curEle["myBind" + evenType] = [];
        }
        var ary = curEle["myBind" + evenType];
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
                    curEle.detachEvent("on" + evenType, cur);//->移除事件池中的
                    ary.splice(i, 1);//->移除自定义属性中存储的
                    break;
                }
            }
        }
    }

    bind(oDiv, "click", fn1);
    bind(oDiv, "click", fn2);
    bind(oDiv, "mouseover", fn1);

    unbind(oDiv, "mouseover", fn1);


    //oDiv.attachEvent("onclick",fn1.call(oDiv));//->绑定的时候就立即的把fn1执行了,把其返回值赋值undefined给我们的onclick行为
    //oDiv.attachEvent("onclick",fn1.bind(oDiv));//->bind方法不兼容,我们不考虑
})();