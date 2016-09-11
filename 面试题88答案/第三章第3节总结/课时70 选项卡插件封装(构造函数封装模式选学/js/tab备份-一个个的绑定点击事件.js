//->实现一个选项卡的封装:我们可以分析出,只要多个选项卡的主体结构一样,那么每一个实现的思想都是一模一样的,唯一不一样的就是最外层的盒子不一样
~function () {
    /*
     * tabChange:封装一个选项卡的插件,只要大结构保持统一,以后实现选项卡的功能,只需要调取这个方法执行即可实现
     * ->container:当前要实现选项卡的这个容器
     * ->defaultIndex:默认选中项的索引
     */
    function tabChange(container, defaultIndex) {
        var tabFirst = utils.firstChild(container), oLis = utils.children(tabFirst), divList = utils.children(container, "div");

        //->让defaultIndex对应的页卡有选中的样式
        defaultIndex = defaultIndex || 0;
        utils.addClass(oLis[defaultIndex], "select");
        utils.addClass(divList[defaultIndex], "select");

        //->实现具体的切换功能
        for (var i = 0; i < oLis.length; i++) {
            oLis[i].onclick = function () {
                utils.addClass(this, "select");

                var curSiblings = utils.siblings(this);
                for (var i = 0; i < curSiblings.length; i++) {
                    utils.removeClass(curSiblings[i], "select");
                }

                var index = utils.index(this);
                for (i = 0; i < divList.length; i++) {
                    i === index ? utils.addClass(divList[i], "select") : utils.removeClass(divList[i], "select");
                }
            }
        }
    }

    window.zhufengTab = tabChange;
}();

