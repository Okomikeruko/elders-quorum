$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(function () {
  var siteHostname = window.location.hostname;
  var exemptions = window.externalLinkExemptions || [];

  $('a[href^="http"]').each(function () {
    var href = $(this).attr('href');
    var isExternal = href.indexOf(siteHostname) === -1;
    var isExempt = exemptions.some(function (url) {
      return href.indexOf(url) === 0;
    });

    if (isExternal && !isExempt) {
      $(this).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    }
  });
})
