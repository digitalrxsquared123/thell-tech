document.addEventListener('DOMContentLoaded', function () {
  var homeLinks = document.querySelectorAll('#mainnav .menu-item a');
  var currentHash = window.location.hash || '';

  homeLinks.forEach(function (link) {
    link.classList.remove('nav-current'); // clear any prior state
    var linkHash = new URL(link.href, window.location.origin).hash || '';
    if (linkHash === currentHash) {
      link.classList.add('nav-current');
    }
  });
});