(function() {
    console.log('[AboutScroll] Script loaded.');

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
        console.log('[AboutScroll] typeof highlightCurrentNavLink:', typeof highlightCurrentNavLink);
        if (typeof highlightCurrentNavLink === 'function') {
            highlightCurrentNavLink();
            console.log('[AboutScroll] highlightCurrentNavLink() executed.');
        } else {
            console.warn('[AboutScroll] highlightCurrentNavLink is NOT defined at this point.');
        }
    }
    
    function attachListeners() {
        var links = document.querySelectorAll('a[href$="#' + anchorId + '"]');
        console.log('[AboutScroll] Links matched:', links.length);
        
        links.forEach(function(link, i) {
            console.log('[AboutScroll] Attaching to link ' + i + ':', link.href, link);
            link.addEventListener('click', function(e) {
                console.log('[AboutScroll] Click fired on About link.');
                var target = document.getElementById(anchorId);
                
                if (target) {
                    console.log('[AboutScroll] Same-page path taken.');
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    scrollToAnchorWithOffset(anchorId);
                    history.pushState(null, '', '#' + anchorId);
                    console.log('[AboutScroll] URL after pushState:', window.location.href);
                    tryHighlight('same-page click');
                } else {
                    console.log('[AboutScroll] Cross-page path taken — setting sessionStorage.');
                    sessionStorage.setItem('pendingAnchorScroll', anchorId);
                }
            }, true);
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachListeners);
    } else {
        attachListeners();
    }
    
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