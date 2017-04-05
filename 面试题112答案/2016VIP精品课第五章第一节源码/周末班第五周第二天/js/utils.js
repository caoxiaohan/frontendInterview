var utils = {
    //listToArray:将类数组转换为数组
    listToArray: function listToArray(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry, 0);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i];
            }
        }
        return ary;
    },
    //toJSON:将字符串转换为JSON格式的对象
    toJSON: function toJSON(str) {
        return "JSON" in window ? JSON.parse(str) : eval("(" + str + ")");
    }
};

//win:获取或者设置和浏览器相关的盒子模型信息
utils.win = function win(attr, value) {
    if (typeof value === "undefined") {
        return document.documentElement[attr] || document.body[attr];
    }
    document.documentElement[attr] = value;
    document.body[attr] = value;
};

//getCss:获取当前元素经过浏览器计算的样式
utils.getCss = function getCss(curEle, attr) {
    var val = reg = null;
    if ("getComputedStyle" in window) {
        val = window.getComputedStyle(curEle, null)[attr];
    } else {
        if (attr === "opacity") {
            val = curEle.currentStyle["filter"];
            reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
            val = reg.test(val) ? reg.exec(val)[1] / 100 : 1;
        } else {
            val = curEle.currentStyle[attr];
        }
    }
    reg = /^-?\d+(\.\d+)?(px|pt|em|rem)?$/;
    return reg.test(val) ? parseFloat(val) : val;
};

//offset:获取元素距离body的偏移量(不管body是否为父级参照物)
utils.offset = function offset(curEle) {
    var t = curEle.offsetTop, l = curEle.offsetLeft, p = curEle.offsetParent;
    while (p) {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            t += p.clientTop;
            l += p.clientLeft;
        }
        t += p.offsetTop;
        l += p.offsetLeft;
        p = p.offsetParent;
    }
    return {top: t, left: l};
};

/*--------------------------------------------------*/

//prev:获取当前元素的上一个哥哥元素节点
utils.prev = function prev(curEle) {
    if ("previousElementSibling" in curEle) {
        return curEle.previousElementSibling;
    }
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
        pre = pre.previousSibling;
    }
    return pre;
};

//prevAll:获取当前元素的所有的哥哥元素节点
utils.prevAll = function prevAll(curEle) {
    //this->utils
    var ary = [], pre = this.prev(curEle);
    while (pre) {
        ary.unshift(pre);
        pre = this.prev(pre);
    }
    return ary;
};

//next:获取当前元素的下一个弟弟元素节点
utils.next = function next(curEle) {
    if ("nextElementSibling" in curEle) {
        return curEle.nextElementSibling;
    }
    var nex = curEle.nextSibling;
    while (nex && nex.nodeType !== 1) {
        nex = nex.nextSibling;
    }
    return nex;
};

//nextAll:获取当前元素的所有的弟弟元素节点
utils.nextAll = function nextAll(curEle) {
    var ary = [], nex = this.next(curEle);
    while (nex) {
        ary[ary.length] = nex;
        nex = this.next(nex);
    }
    return ary;
};

//sibling:获取当前元素的相邻节点(上一个哥哥+下一个弟弟)
utils.sibling = function sibling(curEle) {
    var pre = this.prev(curEle), nex = this.next(curEle);
    var ary = [];
    pre ? ary[ary.length] = pre : null;
    nex ? ary[ary.length] = nex : null;
    return ary;
};

//sibling:获取当前元素的兄弟元素节点(哥哥+弟弟)
utils.siblings = function sibling(curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle));
};

//getIndex:获取当前元素的索引,有几个哥哥,我的索引就是几
utils.getIndex = function getIndex(curEle) {
    return this.prevAll(curEle).length;
};

/*--------------------------------------------------*/

//hasClass:判断当前元素是否包含某个样式类名
utils.hasClass = function hasClass(curEle, cName) {
    var reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
    return reg.test(curEle.className);
};

//addClass:给当前的元素增加样式类名
utils.addClass = function addClass(curEle, cName) {
    if (!this.hasClass(curEle, cName)) {//->首先判断当前的元素中是否已经存在cName这个样式名了,存在就不在增加了...
        curEle.className += " " + cName;
    }
};

//removeClass:给当前的元素移除某一个样式类名
utils.removeClass = function removeClass(curEle, cName) {
    if (this.hasClass(curEle, cName)) {//->首先判断当前的元素中是否已经存在cName这个样式名了,有的话才移除...
        var reg = new RegExp("(?:^| +)" + cName + "(?: +|$)", "g");
        curEle.className = curEle.className.replace(reg, " ");
    }
};

/*--------------------------------------------------*/

//children:获取当前元素下所有的元素子节点,如果传递了tag值,意思是在所有的子元素节点中在把标签名为tag的筛选出来
utils.children = function children(curEle, tag) {
    var nodeList = curEle.childNodes, ary = [];
    for (var i = 0; i < nodeList.length; i++) {
        var cur = nodeList[i];
        if (cur.nodeType === 1) {
            if (typeof tag !== "undefined") {
                var reg = new RegExp("^" + tag + "$", "i");
                reg.test(cur.tagName) ? ary[ary.length] = cur : null;
                continue;
            }
            ary[ary.length] = cur;
        }
    }
    return ary;
};

/*--------------------------------------------------*/

//getElementsByClass:通过元素的样式类名,在指定的上下文中获取相关的元素
utils.getElementsByClass = function getElementsByClass(strClass, context) {
    context = context || document;
    if ("getElementsByClassName" in document) {
        return this.listToArray(context.getElementsByClassName(strClass));
    }
    var tagList = context.getElementsByTagName("*"), ary = [];
    strClass = strClass.replace(/(^ +| +$)/g, "").split(/ +/);
    for (var i = 0; i < tagList.length; i++) {
        var curTag = tagList[i], curTagClass = curTag.className;
        var flag = true;
        for (var k = 0; k < strClass.length; k++) {
            var reg = new RegExp("(?:^| +)" + strClass[k] + "(?: +|$)");
            if (!reg.test(curTagClass)) {
                flag = false;
                break;
            }
        }
        flag ? ary[ary.length] = curTag : null;
    }
    return ary;
};