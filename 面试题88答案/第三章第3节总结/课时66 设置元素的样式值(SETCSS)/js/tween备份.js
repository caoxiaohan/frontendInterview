~function () {
    var zhufengEffect = {
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        }
    };


    //->move:实现动画效果的方法
    //curEle:当前要运动的元素  target:当前要运动到达的目标位置(它是一个对象集合,包含了多方向运动的目标值) duration:当前动画需要运动的总时间
    function move(curEle, target, duration) {
        window.clearInterval(curEle.zhufengTimer);//->在进行当前动画执行之前,首先把之前当前元素正在运行的动画给结束掉,保证当前元素只有一个动画在运行

        //->根据传递进来的目标值,把每一个方向上的起始值和总距离都获取到:target存储的是每一个方向的目标值(需要用户传递) begin存储的是每一个方向的起始位置(自己获取) change存储的是每一个方向的总距离(自己计算)
        var begin = {}, change = {};
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(curEle, key);
                change[key] = target[key] - begin[key];
            }
        }

        var time = null;//->用来记录运动的时间
        curEle.zhufengTimer = window.setInterval(function () {
            time += 10;
            //->到达目标位置后,清除定时器,然后让当前元素的位置等于目标位置
            if (time >= duration) {
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        utils.css(curEle, key, target[key]);
                    }
                }
                window.clearInterval(curEle.zhufengTimer);
                return;
            }
            //->暂时没有到达目标位置,我们获取每一个方向的当前位置(通过动画的公式获取到结果),并且让每一个方向的值是当前的位置
            for (key in target) {
                if (target.hasOwnProperty(key)) {
                    var cur = zhufengEffect.Linear(time, begin[key], change[key], duration);
                    utils.css(curEle, key, cur);
                }
            }
        }, 10);
    }

    window.zhufengAnimate = move;
}();

//for (var i = 0; i < ary.length; i++) {
//    if (i === effect) {
//        var curItem = ary[i];
//        curItem = curItem.split(/-/g);
//        effect = curItem.length >= 2 ? zhufengEffect[curItem[0]][curItem[1]] : zhufengEffect[curItem[0]];
//        break;
//    }
//}