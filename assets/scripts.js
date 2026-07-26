$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

$(function () {
  var siteHostname = window.location.hostname;
  var exemptions = window.externalLinkExemptions || [];
  var gospelLibraryHost = 'https://www.churchofjesuschrist.org';

  function getGospelLibraryAppUrl(href) {
    try {
      var url = new URL(href);

      if (url.origin !== gospelLibraryHost || url.pathname.indexOf('/study/') !== 0) {
        return null;
      }

      return 'gospellibrary://content' + url.pathname.replace(/^\/study/, '') + url.search + url.hash;
    } catch (error) {
      return null;
    }
  }

  function isModifiedActivation(event) {
    var originalEvent = event.originalEvent || {};
    var button = typeof originalEvent.button === 'number' ? originalEvent.button : 0;

    return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || button !== 0 || event.which > 1;
  }

  $('a[href^="http"]').each(function () {
    var href = $(this).attr('href');
    var appHref = getGospelLibraryAppUrl(href);
    var isExternal = href.indexOf(siteHostname) === -1;
    var isExempt = exemptions.some(function (url) {
      return href.indexOf(url) === 0;
    });

    if (isExternal && !isExempt) {
      $(this).attr('target', '_blank').attr('rel', 'noopener noreferrer');
    }

    if (appHref) {
      $(this).on('click', function (event) {
        if (isModifiedActivation(event)) {
          return;
        }

        event.preventDefault();

        var fallback = window.setTimeout(function () {
          window.open(href, '_blank', 'noopener,noreferrer');
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }, 1400);

        function handleVisibilityChange() {
          if (!document.hidden) {
            return;
          }

          window.clearTimeout(fallback);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.location.href = appHref;
      });
    }
  });
})
