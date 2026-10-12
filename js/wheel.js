// Dibujo y lógica de la ruleta
const Wheel = {
  canvas: null,
  ctx: null,
  COLORES: [
    '#ff3b6b','#3b8bff','#ffb23b','#3bff9e',
    '#b23bff','#ff3bd4','#3bfff0','#ff6b3b'
  ],

  init() {
    this.canvas = document.getElementById('wheel');
    this.ctx = this.canvas.getContext('2d');
  },

  dibujar(state) {
    const n = state.opciones.length;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const r = cx - 10;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (n === 0) {
      this._dibujarVacio(cx, cy, r);
      return;
    }

    const anguloPorGajo = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const inicio = state.rotacionActual + i * anguloPorGajo;
      const fin = inicio + anguloPorGajo;

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.arc(cx, cy, r, inicio, fin);
      this.ctx.closePath();
      this.ctx.fillStyle = this.COLORES[i % this.COLORES.length];
      this.ctx.fill();
      this.ctx.strokeStyle = '#0f0f14';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Texto del gajo
      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.rotate(inicio + anguloPorGajo / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 14px system-ui';
      this.ctx.fillText(state.opciones[i].slice(0, 14), r - 15, 5);
      this.ctx.restore();
    }

    // Círculo central
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0f0f14';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ff3b6b';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  },

  _dibujarVacio(cx, cy, r) {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = '#1c1c26';
    this.ctx.fill();
    this.ctx.fillStyle = '#666';
    this.ctx.font = '16px system-ui';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Añade opciones', cx, cy);
  },

  girar(state, onFinish) {
    if (state.girando || state.opciones.length < 2) {
      if (state.opciones.length < 2) alert('Añade al menos 2 opciones');
      return;
    }
    state.girando = true;

    const vueltas = 5 + Math.random() * 3;
    const anguloExtra = Math.random() * Math.PI * 2;
    const destino = state.rotacionActual + vueltas * Math.PI * 2 + anguloExtra;
    const inicio = state.rotacionActual;
    const duracion = 4000;
    const t0 = performance.now();

    const animar = (t) => {
      const p = Math.min((t - t0) / duracion, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easing out cubic
      state.rotacionActual = inicio + (destino - inicio) * eased;
      this.dibujar(state);

      if (p < 1) {
        requestAnimationFrame(animar);
      } else {
        state.girando = false;
        state.rotacionActual =
          ((state.rotacionActual % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        onFinish(this.resolverGanador(state));
      }
    };

    requestAnimationFrame(animar);
  },

  resolverGanador(state) {
    const n = state.opciones.length;
    const anguloPorGajo = (Math.PI * 2) / n;
    const pointerAngle = -Math.PI / 2; // puntero arriba

    let rel = (pointerAngle - state.rotacionActual) % (Math.PI * 2);
    if (rel < 0) rel += Math.PI * 2;

    const idx = Math.floor(rel / anguloPorGajo) % n;
    return state.opciones[idx];
  }
};