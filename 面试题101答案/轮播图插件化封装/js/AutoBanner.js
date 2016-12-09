~function () {
    function AutoBanner(curEleId, ajaxURL, interval) {
        //->把之前存储获取元素的变量都作为当前实例的私有的属性
        this.banner = document.getElementById(curEleId);
        this.bannerInner = utils.firstChild(this.banner);
        this.bannerTip = utils.children(this.banner, "ul")[0];
        this.bannerLink = utils.children(this.banner, "a");
        this.bannerLeft = this.bannerLink[0];
        this.bannerRight = this.bannerLink[1];
        this.divList = this.bannerInner.getElementsByTagName("div");
        this.imgList = this.bannerInner.getElementsByTagName("img");
        this.oLis = this.bannerTip.getElementsByTagName("li");

        //->之前的全局变量也应该变为自己的私有的属性
        this.jsonData = null;
        this.interval = interval || 3000;
        this.autoTimer = null;
        this.step = 0;
        this.ajaxURL = ajaxURL;
        console.log(this.init);

        return this.init();
    }

    AutoBanner.prototype = {
        constructor: AutoBanner,
        //->Ajax请求数据
        getData: function () {
            var _this = this;
            var xhr = new XMLHttpRequest;
            xhr.open("get", this.ajaxURL + "?_=" + Math.random(), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                    _this.jsonData = utils.formatJSON(xhr.responseText);
                }
            };
            xhr.send(null);
        },
        //->实现数据绑定
        bindData: function () {
            var str = "", str2 = "";
            if (this.jsonData) {
                for (var i = 0, len = this.jsonData.length; i < len; i++) {
                    var curData = this.jsonData[i];
                    str += "<div><img src='' trueImg='" + curData["img"] + "'/></div>";
                    i === 0 ? str2 += "<li class='bg'></li>" : str2 += "<li></li>";
                }
            }
            this.bannerInner.innerHTML = str;
            this.bannerTip.innerHTML = str2;
        },
        //->延迟加载
        lazyImg: function () {
            var _this = this;
            for (var i = 0, len = this.imgList.length; i < len; i++) {
                ~function (i) {
                    var curImg = _this.imgList[i];
                    var oImg = new Image;
                    oImg.src = curImg.getAttribute("trueImg");
                    oImg.onload = function () {
                        curImg.src = this.src;
                        curImg.style.display = "block";
                        if (i === 0) {
                            var curDiv = curImg.parentNode;
                            curDiv.style.zIndex = 1;
                            animate(curDiv, {opacity: 1}, 200);
                        }
                        oImg = null;
                    }
                }(i);
            }
        },
        //->自动轮播
        autoMove: function () {
            if (this.step === (this.jsonData.length - 1)) {
                this.step = -1;
            }
            this.step++;
            this.setBanner();
        },
        //->切换效果和焦点对齐
        setBanner: function () {
            //->实现轮播图切换效果
            for (var i = 0, len = this.divList.length; i < len; i++) {
                var curDiv = this.divList[i];
                if (i === this.step) {
                    utils.css(curDiv, "zIndex", 1);
                    animate(curDiv, {opacity: 1}, 200, function () {
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
            for (i = 0, len = this.oLis.length; i < len; i++) {
                var curLi = this.oLis[i];
                i === this.step ? utils.addClass(curLi, "bg") : utils.removeClass(curLi, "bg");
            }
        },
        //->控制自动轮播
        mouseEvent: function () {
            var _this = this;
            this.banner.onmouseover = function () {
                window.clearInterval(_this.autoTimer);
                _this.bannerLeft.style.display = _this.bannerRight.style.display = "block";
            };
            this.banner.onmouseout = function () {
                _this.autoTimer = window.setInterval(function () {
                    _this.autoMove();
                }, _this.interval);
                _this.bannerLeft.style.display = _this.bannerRight.style.display = "none";
            };
        },
        //->实现焦点切换
        tipEvent: function () {
            var _this = this;
            for (var i = 0, len = this.oLis.length; i < len; i++) {
                var curLi = this.oLis[i];
                curLi.index = i;
                curLi.onclick = function () {
                    _this.step = this.index;
                    _this.setBanner();
                }
            }
        },
        //->实现左右切换
        leftRight: function () {
            var _this = this;
            this.bannerRight.onclick = function () {
                _this.autoMove();
            };
            this.bannerLeft.onclick = function () {
                if (_this.step === 0) {
                    _this.step = _this.jsonData.length;
                }
                _this.step--;
                _this.setBanner();
            };
        },
        //->命令模式：init相当于指挥室，指挥各军队协同作战
        init: function () {
            var _this = this;
            this.getData();
            this.bindData();

            window.setTimeout(function () {
                _this.lazyImg();
            }, 500);

            this.autoTimer = window.setInterval(function () {
                _this.autoMove();
            }, this.interval);

            this.mouseEvent();
            this.tipEvent();
            this.leftRight();

            return this;
        }
    };
    window.AutoBanner = AutoBanner;
}();