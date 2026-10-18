const Wheel = {
  canvas: null,
  ctx: null,
  COLORES: ['#ff3b6b','#3b8bff','#ffb23b','#3bff9e','#b23bff','#ff3bd4','#3bfff0','#ff6b3b'],

  init() {
    this.canvas = document.getElementById('wheel');
    this.ctx = this.canvas.getContext('2d');
  },

  dibujar(state) {
    const r = state.getRuletaActiva();
    const opciones = r ? r.opciones : [];
    const n = opciones.length;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;
    const radius = cx - 10;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (n === 0) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1c1c26';
      this.ctx.fill();
      this.ctx.fillStyle = '#666';
      this.ctx.font = '16px system-ui';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Añade opciones', cx, cy);
      return;
    }

    const anguloPorGajo = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const inicio = state.rotacionActual + i * anguloPorGajo;
      const fin = inicio + anguloPorGajo;

      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.arc(cx, cy, radius, inicio, fin);
      this.ctx.closePath();
      this.ctx.fillStyle = this.COLORES[i % this.COLORES.length];
      this.ctx.fill();
      this.ctx.strokeStyle = '#0f0f14';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.rotate(inicio + anguloPorGajo / 2);
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#fff';
      this.ctx.font = 'bold 14px system-ui';
      this.ctx.fillText(opciones[i].slice(0, 14), radius - 15, 5);
      this.ctx.restore();
    }

    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0f0f14';
    this.ctx.fill();
    this.ctx.strokeStyle = '#ff3b6b';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
  },

  girar(state, onFinish) {
    const r = state.getRuletaActiva();
    if (state.girando || !r || r.opciones.length < 2) {
      if (r && r.opciones.length < 2) alert('Añade al menos 2 opciones');
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
      const eased = 1 - Math.pow(1 - p, 3);
      state.rotacionActual = inicio + (destino - inicio) * eased;
      this.dibujar(state);

      if (p < 1) {
        requestAnimationFrame(animar);
      } else {
        state.girando = false;
        state.rotacionActual = ((state.rotacionActual % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        onFinish(this.resolverGanador(state, r.opciones));
      }
    };

    requestAnimationFrame(animar);
  },

  resolverGanador(state, opciones) {
    const n = opciones.length;
    const anguloPorGajo = (Math.PI * 2) / n;
    const pointerAngle = -Math.PI / 2;

    let rel = (pointerAngle - state.rotacionActual) % (Math.PI * 2);
    if (rel < 0) rel += Math.PI * 2;

    const idx = Math.floor(rel / anguloPorGajo) % n;
    return opciones[idx];
  }
};