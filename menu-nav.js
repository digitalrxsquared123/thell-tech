(function() {
    console.log('[AboutScroll] Script loaded (delegated version).');

    var headerOffset = 100;
    var anchorId = 'about';

    function scrollToAnchorWithOffset(id) {
        var target = document.getElementById(id);
        console.log('[AboutScroll] Target found for #' + id + ':', !!target);
        if (!target) return false;

        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = targetPosition - headerOffset;
        console.log('[AboutScroll] Scrolling to:', offsetPosition);

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        return true;
    }

    function tryHighlight(context) {
        console.log('[AboutScroll] tryHighlight called from:', context);
        if (typeof highlightCurrentNavLink === 'function') {
            highlightCurrentNavLink();
            console.log('[AboutScroll] highlightCurrentNavLink() executed.');
        } else {
            console.warn('[AboutScroll] highlightCurrentNavLink is NOT defined at this point.');
        }
    }

    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href$="#' + anchorId + '"]');
        if (!link) return;

        console.log('[AboutScroll] Delegated click matched About link:', link.href);

        var target = document.getElementById(anchorId);

        if (target) {
            console.log('[AboutScroll] Same-page path taken.');
            e.preventDefault();
            e.stopImmediatePropagation();
            scrollToAnchorWithOffset(anchorId);
            history.pushState(null, '', '#' + anchorId);
            tryHighlight('same-page click');
        } else {
            console.log('[AboutScroll] Cross-page path taken.');
            sessionStorage.setItem('pendingAnchorScroll', anchorId);
        }
    }, true);

    window.addEventListener('load', function() {
        var pending = sessionStorage.getItem('pendingAnchorScroll');
        console.log('[AboutScroll] Window load. Pending value:', pending);

        if (pending) {
            sessionStorage.removeItem('pendingAnchorScroll');
            setTimeout(function() {
                console.log('[AboutScroll] Executing delayed scroll + highlight.');
                scrollToAnchorWithOffset(pending);
                tryHighlight('cross-page load');
            }, 300);
        }
    });
})();