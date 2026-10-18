const State = {
  ruletas: [],
  activaId: null,
  rotacionActual: 0,
  girando: false,

  init() {
    if (this.ruletas.length === 0) {
      this.crearRuleta('Mi ruleta', ['Rojo', 'Blanco', 'Amarillo neón', 'Fucsia']);
    }
    if (!this.activaId || !this.ruletas.some(r => r.id === this.activaId)) {
      this.activaId = this.ruletas[0].id;
    }
  },

  crearRuleta(nombre, opciones = []) {
    const id = 'r_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const r = { id, nombre: nombre.trim() || 'Ruleta sin nombre', opciones: opciones.slice(), historial: [] };
    this.ruletas.push(r);
    return r;
  },

  eliminarRuleta(id) {
    const i = this.ruletas.findIndex(r => r.id === id);
    if (i === -1) return;
    this.ruletas.splice(i, 1);
    if (this.activaId === id) this.activaId = this.ruletas[0]?.id ?? null;
  },

  activarRuleta(id) {
    if (this.ruletas.some(r => r.id === id)) {
      this.activaId = id;
      this.rotacionActual = 0;
    }
  },

  getRuletaActiva() {
    return this.ruletas.find(r => r.id === this.activaId) || null;
  },

  renombrarRuleta(id, nuevoNombre) {
    const r = this.ruletas.find(x => x.id === id);
    if (r) r.nombre = nuevoNombre.trim() || r.nombre;
  },

  agregarOpcion(texto) {
    const r = this.getRuletaActiva();
    if (!r) return false;
    const val = texto.trim();
    if (!val) return false;
    r.opciones.push(val);
    return true;
  },

  eliminarOpcion(i) {
    const r = this.getRuletaActiva();
    if (r) r.opciones.splice(i, 1);
  },

  limpiarOpciones() {
    const r = this.getRuletaActiva();
    if (r) r.opciones = [];
  },

  agregarHistorial(opcion) {
    const r = this.getRuletaActiva();
    if (!r) return;
    r.historial.unshift({ opcion, fecha: new Date().toISOString() });
    r.historial = r.historial.slice(0, 20);
  },

  exportar() {
    return { ruletas: this.ruletas, activaId: this.activaId };
  },

  importar(data) {
    if (!data || typeof data !== 'object') return false;
    if (Array.isArray(data.ruletas)) this.ruletas = data.ruletas;
    if (data.activaId && this.ruletas.some(r => r.id === data.activaId)) {
      this.activaId = data.activaId;
    } else if (this.ruletas[0]) {
      this.activaId = this.ruletas[0].id;
    }
    this.init();
    return true;
  }
};