function page(e){
	var top = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    var left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
    var y = e.pageY || top + e.clientY;
    var x = e.pageX || left + e.clientX;
    return {"x":x,"y":y};
}