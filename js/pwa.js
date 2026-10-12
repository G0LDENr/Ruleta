// Registro del service worker + detección de modo standalone
const PWA = {
  init() {
    this.registrarSW();
    this.detectarModoStandalone();
  },

  registrarSW() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('✅ SW registrado:', reg.scope);

          reg.addEventListener('updatefound', () => {
            const nuevo = reg.installing;
            nuevo.addEventListener('statechange', () => {
              if (nuevo.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('🔄 Nueva versión disponible');
              }
            });
          });
        })
        .catch(err => console.error('❌ SW error:', err));
    });
  },

  esStandalone() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  },

  detectarModoStandalone() {
    if (this.esStandalone()) {
      document.body.classList.add('standalone');
    }
  }
};