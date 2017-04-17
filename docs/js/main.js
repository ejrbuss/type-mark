$(document).ready(function() {

    // Initialize code highlighting
    $('pre code').each(function(_, block) {
        var $this = $(this);
        var lang  = $this
            .parent()
            .parent()
            .attr('class')
            .replace(/highlighter[^\s]*|language-|\s/g, '');
        $this
            .addClass(lang.replace('js', 'javascript'))
            .parent()
            .addClass('code')
            .attr('data-lang', lang);

        hljs.highlightBlock(block);
    });

    // Automatically fill nav
    var $sideNav = $('#side-nav .nav');
    $('h3').each(function() {

        var $h3 = $(this);

        if($h3.hasClass('no-nav')) {
            return;
        }
        $sideNav.append(
            '<li class="nav-item">' +
                '<a id="nav-' + $h3.attr('id') + '" href="#' + $h3.attr('id') + '">' +
                    $h3.text() +
                '</a>' +
                '<ul id="nav-ul-' + $h3.attr('id') + '" class="nav"></ul>' +
            '</li>'
        );

        var h4s = $h3.nextUntil('h3', 'h4');

        h4s.each(function() {

            var $h4 = $(this);

            if($h4.hasClass('no-nav')) {
                return;
            }
            $('#nav-ul-' + $h3.attr('id')).append(
                '<li class="nav-item">' +
                    '<a id="nav-' + $h4.attr('id') + '" href="#' + $h4.attr('id') + '">' +
                        $h4.text() +
                    '</a>' +
                '</li>'
            )
        });
    });

    // Remove empty nav lists
    $("#side-nav ul").each(function(){

        var $this = $(this);

        if($this.html() === '') {
            $this.remove();
        }

    });

    // Configure scrollfire to set the active nav item
    $('h3, h4').scrollfire({
        onScroll : activate,
    });

    // Highlight the default nav-item
    activate($('h3:not(.no-nav)').first());

    // Configure tables to be striped by default
    $('table').addClass('table table-striped');

    // Add space before headers
    $('h3, h4, h5, h6').before('<br>');
});

function activate(elem) {

    var $h    = $(elem);
    var $nav  = $('#nav-' + $h.attr('id')).parent();
    var $navp = $nav.parent().parent();

    if($h.hasClass('no-nav')) {
        return;
    }
    if($nav.hasClass('active')) {
        return;
    }
    // Deactivate all previous navs
    $('.nav-item').removeClass('active');

    // Activate correct nav
    $nav.addClass('active');
    $navp.addClass('active');

    // Close unpoened navs
    $('.nav-item').each(function() {

        var $this = $(this);
        var $ul   = $this.children('ul');

        if($this.hasClass('active')) {
            $ul.show();
        } else {
            $ul.hide();
        }
    });
}

console.log('Try out type-mark out in the console!\n> type(4).string');
console.log(type(4).string);