document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('a[href]');
  const currentDomain = window.location.hostname;

  links.forEach((link) => {
    if (link.hostname !== currentDomain && !link.href.startsWith('#')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer'; // セキュリティとパフォーマンス向上のために追加
    }
  });
});
