const PWA = {
  init() {
    this.registrarSW();
    this.detectarModoStandalone();
  },
  registrarSW() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(err => console.error('❌ SW error:', err));
    });
  },
  esStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
  },
  detectarModoStandalone() {
    if (this.esStandalone()) document.body.classList.add('standalone');
  }
};