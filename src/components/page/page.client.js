{
  const html = document.documentElement;

  function getFontSizeFactor() {
    const style = Number.parseFloat(window.getComputedStyle(html).fontSize);
    return style / 16;
  }

  function calc() {
    html.style.setProperty('--viewport-width', window.innerWidth);
    html.style.setProperty('--viewport-height', window.innerHeight);
    html.style.setProperty('--font-size-factor', getFontSizeFactor());
  }

  window.addEventListener('resize', calc);
  window.screen?.orientation?.addEventListener('change', calc);
  calc();

  function getScrollBarSize() {
    const element = document.createElement('div');
    Object.assign(element.style, {
      width: '99px',
      height: '99px',
      overflow: 'scroll',
      positio: 'fixed',
      visiblity: 'hidden'
    });
    document.body.appendChild(element);
    const size = element.offsetWidth - element.clientWidth;
    element.remove();
    return size;
  }

  document.addEventListener('DOMContentLoaded', () => {
    html.style.setProperty('--scroll-bar-size', getScrollBarSize());
  })
}
