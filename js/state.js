// Estado global de la app
const State = {
  opciones: ['Rojo', 'Blanco', 'Amarillo neón', 'Fucsia'],
  historial: [],
  rotacionActual: 0,
  girando: false,

  agregarOpcion(texto) {
    const val = texto.trim();
    if (!val) return false;
    this.opciones.push(val);
    return true;
  },

  eliminarOpcion(i) {
    this.opciones.splice(i, 1);
  },

  limpiarOpciones() {
    this.opciones = [];
  },

  agregarHistorial(opcion) {
    this.historial.unshift({
      opcion,
      fecha: new Date().toISOString()
    });
    this.historial = this.historial.slice(0, 20);
  },

  exportar() {
    return {
      opciones: this.opciones,
      historial: this.historial
    };
  },

  importar(data) {
    if (!data || typeof data !== 'object') return false;
    if (Array.isArray(data.opciones)) this.opciones = data.opciones;
    if (Array.isArray(data.historial)) this.historial = data.historial;
    return true;
  }
};