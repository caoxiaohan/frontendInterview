var banner = document.getElementById("banner2");
var bannerInner = utils.firstChild(banner),
    bannerTip = utils.children(banner, "ul")[0],
    bannerLink = utils.children(banner, "a"),
    bannerLeft = bannerLink[0],
    bannerRight = bannerLink[1];
var divList = bannerInner.getElementsByTagName("div"),
    imgList = bannerInner.getElementsByTagName("img"),
    oLis = bannerTip.getElementsByTagName("li");

//1、Ajax读取数据
var jsonData = null;
~function () {
    var xhr = new XMLHttpRequest;
    xhr.open("get", "json/banner.txt?_=" + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
            jsonData = utils.formatJSON(xhr.responseText);
        }
    };
    xhr.send(null);
}();

//2、数据绑定
~function () {
    var str = "", str2 = "";
    if (jsonData) {
        for (var i = 0, len = jsonData.length; i < len; i++) {
            var curData = jsonData[i];
            str += "<div><img src='' trueImg='" + curData["img"] + "'/></div>";
            i === 0 ? str2 += "<li class='bg'></li>" : str2 += "<li></li>";
        }
    }
    bannerInner.innerHTML = str;
    bannerTip.innerHTML = str2;
}();

//3、图片的延迟加载
window.setTimeout(lazyImg, 500);
function lazyImg() {
    for (var i = 0, len = imgList.length; i < len; i++) {
        ~function (i) {
            var curImg = imgList[i];
            var oImg = new Image;
            oImg.src = curImg.getAttribute("trueImg");
            oImg.onload = function () {
                curImg.src = this.src;
                curImg.style.display = "block";
                //->只对第一张做处理:z-index=1 opacity=1
                if (i === 0) {
                    var curDiv = curImg.parentNode;
                    curDiv.style.zIndex = 1;
                    zhufengAnimate(curDiv, {opacity: 1}, 200);
                }
                oImg = null;
            }
        }(i);
    }
}

//4、实现我们的自动轮播
var interval = 2000, autoTimer = null, step = 0;//->记录当前展示图片的索引
autoTimer = window.setInterval(autoMove, interval);
function autoMove() {
    //->当我们已经把最后一张展示完成后(step等于最后一张的索引),我们应该从新的展示第一张了,我们让step=-1,这样在经过一次累加,step=0,就可以展示第一张了
    if (step === (jsonData.length - 1)) {
        step = -1;
    }
    step++;
    setBanner();
}

//->实现轮播图切换效果的代码:
// 让step索引对应的那个DIV的zIndex=1,让其余的DIV的zIndex=0;
// 让当前的透明度从零变为一,当动画结束,我们需要让其他的DIV的透明度的值直接的变为零
//->实现焦点对齐
function setBanner() {
    //->实现轮播图切换效果
    for (var i = 0, len = divList.length; i < len; i++) {
        var curDiv = divList[i];
        if (i === step) {
            utils.css(curDiv, "zIndex", 1);
            zhufengAnimate(curDiv, {opacity: 1}, 200, function () {
                var curDivSib = utils.siblings(this);
                for (var k = 0, len = curDivSib.length; k < len; k++) {
                    utils.css(curDivSib[k], "opacity", 0);
                }
            });
            continue;
        }
        utils.css(curDiv, "zIndex", 0);
    }

    //->实现焦点对齐
    for (i = 0, len = oLis.length; i < len; i++) {
        var curLi = oLis[i];
        i === step ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
    }
}

//5、实现鼠标悬停停止自动轮播和离开在开启自动轮播的效果
banner.onmouseover = function () {
    window.clearInterval(autoTimer);
    bannerLeft.style.display = bannerRight.style.display = "block";
};
banner.onmouseout = function () {
    autoTimer = window.setInterval(autoMove, interval);
    bannerLeft.style.display = bannerRight.style.display = "none";
};

//6、实现点击焦点切换
~function () {
    for (var i = 0, len = oLis.length; i < len; i++) {
        var curLi = oLis[i];
        curLi.index = i;
        curLi.onclick = function () {
            step = this.index;
            setBanner();
        }
    }
}();

//7、实现左右切换
bannerRight.onclick = autoMove;
bannerLeft.onclick = function () {
    if (step === 0) {
        step = jsonData.length;
    }
    step--;
    setBanner();
};