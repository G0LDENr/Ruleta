const Storage = {
  KEY: 'ruleta_multiple_v3', // Subí la versión por si acaso

  guardar(state) {
    localStorage.setItem(this.KEY, JSON.stringify(state.exportar()));
  },

  cargar(state) {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw);
      state.importar(data);
      return true;
    } catch (e) {
      console.error('Error al cargar:', e);
      return false;
    }
  },

  exportarArchivo(state) {
    const blob = new Blob([JSON.stringify(state.exportar(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ruletas.json';
    a.click();
    URL.revokeObjectURL(a.href);
  },

  importarArchivo(file, state, callback) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        callback(state.importar(data));
      } catch (err) {
        callback(false);
      }
    };
    reader.readAsText(file);
  }
};