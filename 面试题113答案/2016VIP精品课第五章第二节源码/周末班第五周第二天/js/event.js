/*
 * bind:处理DOM2级事件绑定的兼容性问题(绑定方法)
 * @parameter:
 *  curEle->要绑定事件的元素
 *  evenType->要绑定的事件类型("click"、"mouseover"...)
 *  evenFn->要绑定的方法
 */
function bind(curEle, evenType, evenFn) {
    if ("addEventListener" in document) {
        curEle.addEventListener(evenType, evenFn, false);
        return;
    }

    //->给evenFn化妆,并且把化妆前的照片贴在自己对应的脑门上
    var tempFn = function () {
        evenFn.call(curEle);
    };
    tempFn.photo = evenFn;

    //->首先判断该自定义属性之前是否存在,不存在话创建一个,由于要存储多个方法化妆后的结果,所以我们让其值是一个数组
    if (!curEle["myBind" + evenType]) {
        curEle["myBind" + evenType] = [];
    }
    //->解决重复问题：每一次自己在往自定义属性对应的容器中添加前，看一下之前是否已经有了，有的话就不用在重新的添加了，同理也不需要往事件池中存储了
    var ary = curEle["myBind" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === evenFn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + evenType, tempFn);
}

//unbind:移除事件绑定
function unbind(curEle, evenType, evenFn) {
    if ("removeEventListener" in document) {
        curEle.removeEventListener(evenType, evenFn, false);
        return;
    }
    //->拿evenFn到curEle["myBind"]这里找化妆后的结果,找到之后在事件池中把换装后的结果给移出事件池
    var ary = curEle["myBind" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur.photo === evenFn) {
            ary.splice(i, 1);//->找到后,把自己存储的容器中对应的移除掉
            curEle.detachEvent("on" + evenType, cur);//->在把事件池中对应的也移除掉
            break;
        }
    }
}

//->解决顺序问题：我们不用浏览器自带的事件池了，而是自己模拟标准浏览器的事件池实现

//->on:创建事件池,并且把需要给当前元素绑定的方法依次的增加到事件池中
function on(curEle, evenType, evenFn) {
    if (!curEle["myEvent" + evenType]) {
        curEle["myEvent" + evenType] = [];
    }
    var ary = curEle["myEvent" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur === evenFn) {
            return;
        }
    }
    ary.push(evenFn);

    //curEle.addEventListener(evenType, run, false);//->执行on的时候,我们给当前元素绑定了一个点击的行为,当点击的时候执行run方法:run方法中的this是当前元素curEle,并且浏览器给run传递了一个MouseEvent事件对象
    bind(curEle, evenType, run);
}

//->off:在自己的事件池中把某一个方法移除
function off(curEle, evenType, evenFn) {
    var ary = curEle["myEvent" + evenType];
    for (var i = 0; i < ary.length; i++) {
        var cur = ary[i];
        if (cur === evenFn) {
            ary.splice(i, 1);
            break;
        }
    }
}

//->run:我们只给当前元素的点击行为绑定一个方法run,当触发点击的时候执行的是run方法,我在run方法中根据自己存储的方法顺序分别的在把这些方法执行
function run(e) {
    e = e || window.event;
    var flag = e.target ? true : false;//->IE6~8下不兼容e.target,得到的flag为false
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

    //this->当前点击的这个元素curEle  e.target存储的是当前触发的元素curEle
    //->获取自己事件池中绑定的那些方法,并且让这些方法依次的执行
    var ary = this["myEvent" + e.type];
    for (var i = 0; i < ary.length; i++) {
        var tempFn = ary[i];
        tempFn.call(this, e);
    }
}













