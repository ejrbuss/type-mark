module.exports = function() {

    var args = Array.prototype.slice.call(arguments);
    var tfn  = args.pop();

    args.forEach(function(path) {
        tfn(require(path));
    });
}