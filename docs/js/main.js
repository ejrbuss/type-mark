// Initialize code highlighting
hljs.initHighlightingOnLoad();

$(document).ready(function() {

    // Initialize codeblocks correctly
    $('pre code.hljs').each(function() {
        var $this = $(this);
        var lang  = $this
            .attr('class')
            .replace(/hljs|\s/g, '')
            .replace(/xml/i, 'html')
            .replace(/javascript/i, 'js');

        $this
            .parent()
            .addClass('code')
            .attr('data-lang', lang);
    });
});

// Check that script loaded
console.log('hello world!');