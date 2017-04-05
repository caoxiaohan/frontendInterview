	Function.prototype.myBind = function myBind(context) {
        //this->fn
        var _this = this;
        var outerArg = Array.prototype.slice.call(arguments, 1);
        //->兼容
        if ("bind" in Function.prototype) {
            return this.bind.apply(this, [context].concat(outerArg));
        }
        //->不兼容
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            innerArg.length === 0 ? innerArg[innerArg.length] = window.event : null;
            _this.apply(context, outerArg.concat(innerArg));
        }
    };