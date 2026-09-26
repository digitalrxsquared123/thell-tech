(function() {
    var headerOffset = 100;
    var anchorId = 'about';
    var lastHandled = 0;

    function scrollToAnchorWithOffset(id) {
        var target = document.getElementById(id);
        if (!target) return false;

        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = targetPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        return true;
    }

    function tryHighlight() {
        if (typeof highlightCurrentNavLink === 'function') {
            highlightCurrentNavLink();
        }
    }

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href$="#' + anchorId + '"]');
        if (!link) return;

        var now = Date.now();
        if (now - lastHandled < 100) return;
        lastHandled = now;

        var target = document.getElementById(anchorId);

        if (target) {
            e.preventDefault();
            e.stopImmediatePropagation();
            scrollToAnchorWithOffset(anchorId);
            history.pushState(null, '', '#' + anchorId);
            tryHighlight();
        } else {
            sessionStorage.setItem('pendingAnchorScroll', anchorId);
        }
    }, true);

    window.addEventListener('load', function() {
        var pending = sessionStorage.getItem('pendingAnchorScroll');

        if (pending) {
            sessionStorage.removeItem('pendingAnchorScroll');
            setTimeout(function() {
                scrollToAnchorWithOffset(pending);
                tryHighlight();
            }, 300);
        }
    });
})();