~function () {
    //->linear:设定一个匀速运动的公式,获取当前元素的位置
    function linear(t, b, c, d) {
        return c * t / d + b;
    }

    function move(curEle, target, duration, callBack) {
        //1)首先根据传递进来的每一个方向的目标值获取到每一个方向的起始值和总距离
        var begin = {}, change = {};
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(curEle, key);
                change[key] = target[key] - begin[key];
            }
        }
        //2)设置定时器让当前的元素开始运动:在新动画开始之前先把之前当前元素正在运行的动画都结束掉
        var time = null;
        window.clearInterval(curEle.zhufengTimer);
        curEle.zhufengTimer = window.setInterval(function () {
            time += 10;
            if (time >= duration) {
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        utils.css(curEle, key, target[key]);
                    }
                }
                window.clearInterval(curEle.zhufengTimer);

                //3)动画结束后,执行回调函数
                callBack && callBack.call(curEle);
                return;
            }
            for (key in target) {
                if (target.hasOwnProperty(key)) {
                    var curPos = linear(time, begin[key], change[key], duration);
                    utils.css(curEle, key, curPos);
                }
            }
        }, 10);
    }

    window.zhufengAnimate = move;
}();