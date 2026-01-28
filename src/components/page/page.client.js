{
  const html = document.documentElement;

  function getScrollBarSize() {
    const element = document.createElement('div');
    Object.assign(element.style, {
      width: '99px',
      height: '99px',
      overflow: 'scroll',
      position: 'fixed',
      visiblity: 'hidden'
    });
    document.body.appendChild(element);
    const size = element.offsetWidth - element.clientWidth;
    element.remove();
    return size;
  }

  document.addEventListener('DOMContentLoaded', () => {
    html.style.setProperty('--scroll-bar-size', getScrollBarSize());
  });
}
