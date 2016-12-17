/**
 * Created by wzq on 2016/12/16.
 */
~function(jQuery){
    jQuery.fn.extend({
        banner:wzqBanner
    });
    function wzqBanner(ajaxURL,inerval) {
        var $oSlide = $(this),
            $oSlidIco = $oSlide.children(".ico"),
            $oSlideInner = $oSlide.children("ul"),
            $oSlideLink = $oSlide.children("a");
        var $bannerList = null, $imgList = null, $oLis = null;
        var jsonData = null;
        var step = 0;
        var inteval=inteval||1000;
        $.ajax({
            url: "json/banner.txt?_=" + Math.random(),
            type: "get",
            dataType: "json",
            async: false,
            success: function (data) {
                jsonData = data;
            }
        });
        //2.数据绑定
        bindData();
        function bindData() {
            var str = "", str2 = "";
            $.each(jsonData, function (index, item) {
                str += "<li><a href='javascript:void(0);'><img src='' trueImg='" + item["img"] + "'/></a></li>";
                index === 0 ? str2 += "<a class='active' href='javascript:void(0);'></a>" :
                    (index!=jsonData.length-1?str2 += "<a href='javascript:void(0);'></a>":null);
                $oSlideInner.html(str);
                $oSlidIco.html(str2);

            })
            $bannerList = $oSlideInner.children("li");
            $imgList = $oSlideInner.find("img");
            $oLis = $oSlidIco.children("a");
            var baseWidth = $bannerList.eq(0).prop("offsetWidth");//一个li的宽度
            $oSlideInner.css("width", baseWidth * $imgList.length + 'px')
        }

//3.图片延迟加载
        window.setTimeout(lazyImg, 500);
        function lazyImg() {
            $imgList.each(function (index, item) {
                var _this = this;
                var oImg = new Image;
                oImg.src = $(this).attr("trueImg");
                oImg.onload = function () {
                    $(_this).prop("src", this.src).animate({opacity: 1}, 300);

                }
            });
        };
        //4.焦点轮播
        $oLis.each(function (index, item) {
            this.n = index;
            $(this).click(function () {
                $oSlideInner.animate({left: this.n * -930}, 700);
                step = this.n;//确定下次动画会停在那一页
                selector();
            });
        });

        //5.自动轮播无缝对接
        function autoMove() {
            step++;
            if (step >= $imgList.length) {
                $oSlideInner.css("left", 0);
                //这个表达式可以瞬间把oInner从原来的位置切换到第0张
                step = 0;//动画从一张开始
            }else{
                $oSlideInner.animate({left: step * -930}, 700)
            }
            step==$imgList.length-1?selector(0):selector(step);
        }
        var timer = window.setInterval(autoMove, inteval);
        $oSlide.on("mouseover", function () {
            window.clearInterval(timer);
        });
        $oSlide.on("mouseout", function () {
            timer = window.setInterval(autoMove, inteval);
        });

        //6.焦点对齐
        function selector(nStep) {
            nStep=nStep||step;
            var $curA = $oLis.eq(nStep);
            $curA.addClass("active").siblings().removeClass("active");
        };
        //7.左右轮播
        $oSlideLink.eq(0).click(function () {//向左移动
            autoMove();
        });
        $oSlideLink.eq(1).click(function () {
            step--;
            if (step < 0) {
                step = $oLis.length;
                $oSlideInner.css("left", step * -930);
                step = $oLis.length - 1;
            }
            $oSlideInner.animate({left: step * -930}, 700);
            selector();
        })
    };
}(jQuery);