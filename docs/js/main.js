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


    // Configure tables to be striped by default
    $('table').addClass('table table-striped');

    // Add space before headers
    $('h3, h4, h5, h6').before('<br>');
});

// Check that script loaded
console.log('hello world!');