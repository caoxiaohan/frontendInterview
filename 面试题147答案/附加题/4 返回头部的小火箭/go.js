function show(obj) { obj.style.display = "block";}
function hide(obj) { obj.style.display = "none";}
function getScoll(){
                  	 var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                  	 var left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
                  	 var isQ=(/MSIE\s(5.0|6.0|7.0)/.test(navigator.userAgent)&&document.compatMode==="BackCompat");
              		 var height = isQ?document.body.scrollHeight:document.documentElement.scrollHeight;
              		 var width = isQ?document.body.scrollWidth:document.documentElement.scrollWidth;
              		 return {"left":left,"top":top,"width":width,"height":height}
                  }     