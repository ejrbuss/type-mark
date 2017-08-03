type.modify('collapse', function collapse(test) {
    return function() {

        var args = type.util.toArray(arguments);
        args.pop();

        for(var i in this._value) {
            if(test.apply(this, args.concat([this._value[i]]))) {
                this._return = this._value[i];
                return true;
            }
        }
        return false;
    };
});