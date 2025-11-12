// Inject shared footer partial into all pages inside /pages
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var footer = document.querySelector('footer.main-footer');
    if(!footer) return;
    fetch('partials/footer.html', { cache: 'no-store' })
      .then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return res.text(); })
      .then(function(html){ footer.outerHTML = html; })
      .catch(function(err){ console.warn('Footer include failed:', err); });
  });
})();