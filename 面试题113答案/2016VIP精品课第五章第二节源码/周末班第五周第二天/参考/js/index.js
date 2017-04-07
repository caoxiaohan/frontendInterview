var winW = document.documentElement.clientWidth || document.body.clientWidth;
var winH = document.documentElement.clientHeight || document.body.clientHeight;
var oDiv = document.getElementById("div1");

on(oDiv, "mousedown", down);

function down(e) {
    //记录当前鼠标的开始坐标
    this["strX"] = e.clientX;
    this["strY"] = e.clientY;

    //记录当前盒子的开始位置(top/left)->offsetTop/offsetLeft盒子模型属性获取的结果是没有小数的都是整数,采取的规则是四舍五入
    this["strT"] = this.offsetTop;
    this["strL"] = this.offsetLeft;

    //如果支持setCapture,我们用它来处理鼠标焦点丢失的问题,不兼容的话我们把事件绑定给document
    if (this.setCapture) {
        this.setCapture();
        on(this, "mousemove", move);
        on(this, "mouseup", up);
    } else {
        //绑定给document的话前往不要忘记让方法中的this重新指向当前的元素
        this.moveFn = processThis(this, move);
        this.upFn = processThis(this, up);
        on(document, "mousemove", this.moveFn);
        on(document, "mouseup", this.upFn);
    }

    //当每一次点击的时候先把之前的正在运动的fly和drop动画清除掉
    window.clearTimeout(this.flyTimer);
    window.clearTimeout(this.dropTimer);
}

function move(e) {
    //计算最新的top/left位置值
    var curL = this["strL"] + (e.clientX - this["strX"]);
    var curT = this["strT"] + (e.clientY - this["strY"]);

    //拖拽时候的边界判断
    if (curL >= (winW - this.offsetWidth)) {
        this.style.left = winW - this.offsetWidth + "px";
    } else if (curL <= 0) {
        this.style.left = 0;
    } else {
        this.style.left = curL + "px";
    }
    if (curT >= (winH - this.offsetHeight)) {
        this.style.top = winH - this.offsetHeight + "px";
    } else if (curT <= 0) {
        this.style.top = 0;
    } else {
        this.style.top = curT + "px";
    }

    //计算抛物效果的速度
    //pre存储的是上一次浏览器记录的位置
    if (!this.pre) {
        //第一次没有的时候首先先记录一个值
        this.pre = this.offsetLeft;
    } else {
        this.speed = this.offsetLeft - this.pre;//->本次移动后的最新位置减去上一次的位置就是当前最小时间内移动的距离->我们的速度
        //当前可能还没有松开呢,没有松开的话我们要随时更新本阶段的位置信息值，只有这样最后一次松开的时候才可以获取到相邻最短时间内的偏移值
        this.pre = this.offsetLeft;
    }
}

function up(e) {
    //把开始绑定的move/up都移除掉
    if (this.releaseCapture) {
        this.releaseCapture();
        off(this, "mousemove", move);
        off(this, "mouseup", up);
    } else {
        off(document, "mousemove", this.moveFn);
        off(document, "mouseup", this.upFn);
    }

    //fly.call(this);
    drop.call(this);
}

function fly() {
    window.clearTimeout(this.flyTimer);
    this.speed *= 0.98;//->乘以一个小于1的数做我们的指数衰减运动
    var curL = this.offsetLeft + this.speed;
    if (curL >= (winW - this.offsetWidth)) {
        this.style.left = winW - this.offsetWidth + "px";
        this.speed *= -1;
    } else if (curL <= 0) {
        this.style.left = 0;
        this.speed *= -1;
    } else {
        this.style.left = curL + "px";
    }
    //当我们的速度小于0.5的时候就没有必要在继续的走了,结束当前的fly动画
    if (Math.abs(this.speed) < 0.5) {
        return;
    }
    this.flyTimer = window.setTimeout(processThis(this, fly), 20);
}

var dropFlag = 0;//->一个标记，当坠落或者弹起的时候我们都让其为0，当到底了我们让其累加1，这样的话开始都是0 1 0 1 0 1...直到不再弹起,我们的dropFlag会一直累加下去
function drop() {
    window.clearTimeout(this.dropTimer);
    !this.dropSpeed ? this.dropSpeed = 9.8 : this.dropSpeed += 9.8;
    this.dropSpeed *= 0.98;
    var curT = this.offsetTop + this.dropSpeed;
    if (curT >= (winH - this.offsetHeight)) {
        this.style.top = winH - this.offsetHeight + "px";
        this.dropSpeed *= -1;
        dropFlag++;
    } else {
        this.style.top = curT + "px";
        dropFlag = 0;
    }

    //当到底了不再弹起结束动画
    if (dropFlag >= 2) {
        return;
    }
    this.dropTimer = window.setTimeout(processThis(this, drop), 20);
}








