/*
 * utils(v1.0)：Set up a utils namespace, and add the method used in the project to the namespace to avoid contamination of global variables.
 * by team on 2015/09/29
 */
var utils = {
    //win:Set or get the information about the browser's box model
    win: function (attr, value) {
        var len = arguments.length;
        if (len === 0) {
            return;
        }
        if (len === 1) {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = value;
        document.body[attr] = value;
    },
    //listToArray:Converts an array of classes into an array set
    listToArray: function (likeArray) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeArray, 0);
        } catch (e) {
            for (var i = 0; i < likeArray.length; i++) {
                ary[ary.length] = likeArray[i];
            }
        }
        return ary;
    },
    //toJSON:JSON format string, converted to JSON format object
    toJSON: function (jsonStr) {
        return "JSON" in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }
};

//getElementsByClass:Through the collection of elements of the class can access the corresponding elements
utils.getElementsByClass = function (cName, context) {
    context = context || document;
    if ("getElementsByClassName" in context) {
        return this.listToArray(context.getElementsByClassName(cName));
    }
    var cAry = cName.replace(/^\s+|\s+$/g, "").split(/\s+/), allTags = context.getElementsByTagName("*"), ary = [];
    for (var i = 0; i < allTags.length; i++) {
        var curTag = allTags[i], flag = true;
        for (var k = 0; k < cAry.length; k++) {
            var reg = new RegExp("(^| +)" + cAry[k] + "( +|$)");
            if (!reg.test(curTag.className)) {
                flag = false;
                break;
            }
        }
        flag ? ary[ary.length] = curTag : null;
    }
    return ary;
};

//children:Gets all the elements of an element under the child node
utils.children = function (curEle, tagName) {
    var ary = [], nodes = curEle.childNodes;
    for (var i = 0; i < nodes.length; i++) {
        var curNode = nodes[i];
        curNode.nodeType === 1 ? (typeof tagName === "undefined" ? ary[ary.length] = curNode : (curNode.nodeName.toLowerCase() === tagName.toLowerCase() ? ary[ary.length] = curNode : null)) : null;
    }
    return ary;
};

//prev:Get on a brother element node
utils.prev = function (curEle) {
    if ("previousElementSibling" in curEle) {
        return curEle.previousElementSibling;
    }
    var pre = curEle.previousSibling;
    while (pre && pre.nodeType !== 1) {
        pre = pre.previousSibling;
    }
    return pre;
};

//next:Gets the next younger brother element node
utils.next = function (curEle) {
    if ("nextElementSibling" in curEle) {
        return curEle.nextElementSibling;
    }
    var nex = curEle.nextSibling;
    while (nex && nex.nodeType !== 1) {
        nex = nex.nextSibling;
    }
    return nex;
};

//sibling:Gets two adjacent elements.
utils.sibling = function (curEle) {
    var pre = this.prev(curEle), nex = this.next(curEle), ary = [];
    pre ? ary[ary.length] = pre : null;
    nex ? ary[ary.length] = nex : null;
    return ary;
};

//prevAll:Gets all the older brother element nodes
utils.prevAll = function (curEle) {
    var ary = [], pre = this.prev(curEle);
    while (pre) {
        ary.unshift(pre);
        pre = this.prev(pre);
    }
    return ary;
};

//nextAll:Gets all the younger brother element nodes
utils.nextAll = function (curEle) {
    var ary = [], nex = this.next(curEle);
    while (nex) {
        ary[ary.length] = nex;
        nex = this.next(nex);
    }
    return ary;
};

//siblings:Gets all the sibling nodes
utils.siblings = function (curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle));
};

//getIndex:Gets the index position of the current element
utils.getIndex = function (curEle) {
    return this.prevAll(curEle).length;
};

//first:Gets the first element child node
utils.first = function (curEle, tagName) {
    var chd = this.children(curEle, tagName);
    return chd.length > 0 ? chd[0] : null;
};

//last:Gets the last element child node
utils.last = function (curEle, tagName) {
    var chd = this.children(curEle, tagName);
    return chd.length > 0 ? chd[chd.length - 1] : null;
};

//attr:Sets or gets the attributes of an element
utils.attr = function (curEle, property, value) {
    var len = arguments.length;
    if (len <= 1) return;
    if (len === 2) {
        return property === "class" ? curEle.className : curEle.getAttribute(property);
    }
    property === "class" ? curEle.className = value : curEle.setAttribute(property, value);
};

//removeAttr:The related attributes of an element
utils.removeAttr = function (curEle, property) {
    var len = arguments.length;
    if (len <= 1) return;
    property === "class" ? curEle.className = null : curEle.removeAttribute(property);
};

//getCss:Get elements of the style
utils.getCss = function (curEle, attr) {
    var val = "getComputedStyle" in window ? window.getComputedStyle(curEle, null)[attr] : curEle.currentStyle[attr];
    var temp = parseFloat(val);
    return isNaN(temp) ? val : temp;
};

//setCss:Add inline styles to elements
utils.setCss = function (curEle, attr, value) {
    var reg = /^(width|height|top|left|right|bottom|((margin|padding)(Left|Top|Right|Bottom)?))$/;
    if (attr === "opacity") {
        curEle["style"]["opacity"] = value;
        curEle["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
    } else if (reg.test(attr)) {
        curEle["style"][attr] = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/.test(value) ? value + "px" : value;
    } else {
        curEle["style"][attr] = value;
    }
};

//setGroupCss:Batch to add inline style
utils.setGroupCss = function (curEle, opations) {
    if (({}).toString.call(opations) !== "[object Object]") {
        return;
    }
    for (var key in opations) {
        if (opations.hasOwnProperty(key)) {
            this.setCss(curEle, key, opations[key]);
        }
    }
};

//offset:Gets the offset of the element distance body. attr:"left"/"top"
utils.offset = function (curEle, attr) {
    var offsetL = curEle.offsetLeft, offsetT = curEle.offsetTop, offsetP = curEle.offsetParent;
    while (offsetP) {
        offsetL += offsetP.offsetLeft;
        offsetT += offsetP.offsetTop;
        if (navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
            offsetL += offsetP.clientLeft;
            offsetT += offsetP.clientTop;
        }
        offsetP = offsetP.offsetParent;
    }
    return attr === "left" ? offsetL : offsetT;
};

//hasClass:To determine whether the current element contains a class name
utils.hasClass = function (curEle, cName) {
    var cur = curEle.className, reg = new RegExp("(^| +)" + cName + "( +|$)");
    return reg.test(cur);
};

//addClass:The class name to add style elements
utils.addClass = function (curEle, cName) {
    var cAry = cName.replace(/^\s+|\s+$/g, "").split(/\s+/);
    for (var i = 0; i < cAry.length; i++) {
        var cur = cAry[i];
        if (!this.hasClass(curEle, cur)) {
            curEle.className += " " + cur;
        }
    }
};

//removeClass:Style name delete element
utils.removeClass = function (curEle, cName) {
    var cAry = cName.replace(/^\s+|\s+$/g, "").split(/\s+/);
    for (var i = 0; i < cAry.length; i++) {
        var cur = cAry[i], reg = new RegExp("(^| +)" + cur + "( +|$)", "g");
        if (this.hasClass(curEle, cur)) {
            curEle.className = curEle.className.replace(reg, " ");
        }
    }
};

//html:Sets or gets the contents of an element
utils.html = function (curEle, value) {
    var len = arguments.length;
    if (len === 0) {
        return;
    }
    if (len === 1) {
        return curEle.innerHTML;
    }
    curEle.innerHTML = value;
};

//val:Sets or gets the value of the form element
utils.val = function (curEle, value) {
    var len = arguments.length;
    if (len === 0) {
        return;
    }
    if (len === 1) {
        return curEle.value;
    }
    curEle.value = value;
};

//prepend(appendChild):Add an element to the beginning of the specified container
utils.prepend = function (newEle, container) {
    var fir = this.first(container);
    fir ? container.insertBefore(newEle, fir) : container.appendChild(newEle);
};

//insertAfter:Add the new element to the back of the old elements
utils.insertAfter = function (newEle, oldEle) {
    var nex = this.next(oldEle), par = oldEle.parentNode;
    nex ? par.insertBefore(newEle, nex) : par.appendChild(newEle);
};

//utils.isNum(val):Detect whether the current Val is a number，And so on, there are isBoo, isObj, isAry, isReg, isStr, isDate, isFun, isNul, isUnd
~function (utils) {
    var numObj = {
        isNum: "Number",
        isStr: "String",
        isBoo: "Boolean",
        isNul: "Null",
        isUnd: "Undefined",
        isObj: "Object",
        isAry: "Array",
        isFun: "Function",
        isReg: "RegExp",
        isDate: "Date"
    }, isType = function () {
        var outerArg = arguments[0];
        return function () {
            var innerArg = arguments[0], reg = new RegExp("^\\[object " + outerArg + "\\]$", "i");
            return reg.test(Object.prototype.toString.call(innerArg));
        }
    };
    for (var key in numObj) {
        if (numObj.hasOwnProperty(key)) {
            utils[key] = isType(numObj[key]);
        }
    }
}(utils);

//Extended method on the prototype of the built-in class
~function () {
    var aryPro = Array.prototype, strPro = String.prototype, regPro = RegExp.prototype;
    aryPro.unique = function () {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            obj[cur] == cur ? (this[i] = this[this.length - 1], this.length -= 1, i--) : obj[cur] = cur;
        }
        obj = null;
        return this;
    };
    aryPro.myForEach = function (callBack, context) {
        if (Array.prototype.forEach) {
            return this.forEach(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            callBack.call(context, this[i], i, this);
        }
    };
    aryPro.myMap = function (callBack, context) {
        if (Array.prototype.map) {
            return this.map(callBack, context);
        }
        for (var i = 0; i < this.length; i++) {
            this[i] = callBack.call(context, this[i], i, this);
        }
        return this;
    };

    strPro.myTrim = function () {
        return this.replace(/(^\s+|\s+$)/g, "");
    };
    strPro.mySub = function () {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };
    strPro.myFormatTime = function () {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日 {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };
    strPro.queryURLParameter = function () {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };

    regPro.myExec = function (str) {
        var reg = !this.global ? eval(this.toString() + "g") : this;
        var ary = [], res = reg.exec(str);
        while (res) {
            ary[ary.length] = res[0];
            res = reg.exec(str);
        }
        return ary.length === 0 ? null : ary;
    };
}();