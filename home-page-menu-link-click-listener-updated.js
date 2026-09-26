(function() {

    var headerOffset = 100;
    var anchorId = 'about';
    
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
    
    function attachListeners() {
        var links = document.querySelectorAll('a[href$="#' + anchorId + '"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var target = document.getElementById(anchorId);
                
                if (target) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    scrollToAnchorWithOffset(anchorId);
                    history.pushState(null, '', '#' + anchorId);
                    if (typeof highlightCurrentNavLink === 'function') {
                        highlightCurrentNavLink();
                    }
                } else {
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
        
        if (pending) {
            sessionStorage.removeItem('pendingAnchorScroll');
            setTimeout(function() {
                scrollToAnchorWithOffset(pending);
                if (typeof highlightCurrentNavLink === 'function') {
                    highlightCurrentNavLink();
                }
            }, 300);
        }
    });
})();