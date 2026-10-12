
PWA.init();

(function () {
  'use strict';

  // Init
  Wheel.init();
  Storage.cargar(State);
  refrescarTodo();

  // --- Refrescos ---
  function refrescarTodo() {
    UI.renderLista(State);
    UI.renderHistorial(State);
    Wheel.dibujar(State);
  }

  function refrescarRuleta() {
    Wheel.dibujar(State);
  }

  // --- Tabs ---
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => UI.cambiarTab(tab.dataset.tab));
  });

  // --- Añadir opción ---
  const inputNueva = document.getElementById('nuevaOpcion');
  document.getElementById('addBtn').addEventListener('click', agregar);
  inputNueva.addEventListener('keydown', e => {
    if (e.key === 'Enter') agregar();
  });

  function agregar() {
    if (State.agregarOpcion(inputNueva.value)) {
      inputNueva.value = '';
      Storage.guardar(State);
      UI.renderLista(State);
      refrescarRuleta();
      inputNueva.focus();
    }
  }

  // --- Eliminar opción (delegación de eventos) ---
  document.getElementById('lista').addEventListener('click', e => {
    if (!e.target.classList.contains('del-btn')) return;
    const i = parseInt(e.target.dataset.index, 10);
    State.eliminarOpcion(i);
    Storage.guardar(State);
    UI.renderLista(State);
    refrescarRuleta();
  });

  // --- Girar ---
  const spinBtn = document.getElementById('spinBtn');
  spinBtn.addEventListener('click', () => {
    spinBtn.disabled = true;
    Wheel.girar(State, ganador => {
      spinBtn.disabled = false;
      State.agregarHistorial(ganador);
      Storage.guardar(State);
      UI.renderHistorial(State);
      UI.mostrarGanador(ganador);
    });
  });

  // --- Guardar / Cargar / Export / Import / Clear ---
  document.getElementById('saveBtn').addEventListener('click', () => {
    Storage.guardar(State);
    alert('✅ Guardado en este navegador');
  });

  document.getElementById('loadBtn').addEventListener('click', () => {
    if (Storage.cargar(State)) {
      refrescarTodo();
      alert('📂 Cargado');
    } else {
      alert('No hay nada guardado');
    }
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    Storage.exportarArchivo(State);
  });

  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });

  document.getElementById('fileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    Storage.importarArchivo(file, State, ok => {
      if (ok) {
        Storage.guardar(State);
        refrescarTodo();
        alert('⬆ Importado');
      } else {
        alert('❌ Archivo inválido');
      }
      e.target.value = '';
    });
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('¿Borrar todas las opciones?')) {
      State.limpiarOpciones();
      Storage.guardar(State);
      UI.renderLista(State);
      refrescarRuleta();
    }
  });

  // --- Cerrar modal ---
  document.getElementById('closeModal').addEventListener('click', UI.cerrarModal);
  document.getElementById('modalBg').addEventListener('click', e => {
    if (e.target.id === 'modalBg') UI.cerrarModal();
  });
})();