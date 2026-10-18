const Storage = {
  KEY: 'ruleta_multiple_v3',

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
    a.download = 'Respaldo_Ruletas.json';
    
    // Se añade al DOM temporalmente (necesario para Firefox/Safari)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Se le da 1 segundo de margen antes de destruir la URL en memoria
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },

  exportarRuletaIndividual(ruleta) {
    const data = {
      ruletas: [ruleta],
      activaId: ruleta.id
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    
    // Limpiamos el nombre para que sea seguro en el sistema de archivos
    const nombreSeguro = ruleta.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `Ruleta_${nombreSeguro}.json`;
    
    // Se añade al DOM temporalmente (necesario para Firefox/Safari)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Se le da 1 segundo de margen antes de destruir la URL en memoria
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
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