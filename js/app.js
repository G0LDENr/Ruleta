(function () {
  'use strict';

  Wheel.init();
  Storage.cargar(State);
  State.init();
  PWA.init();
  refrescarTodo();

  function refrescarTodo() {
    UI.renderHeader(State);
    UI.renderLista(State);
    UI.renderHistorial(State);
    UI.renderRuletas(State);
    Wheel.dibujar(State);
  }

  function refrescarRuletaYHeader() {
    UI.renderHeader(State);
    Wheel.dibujar(State);
    UI.renderHistorial(State);
  }

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => UI.cambiarTab(btn.dataset.tab));
  });

  const inputNueva = document.getElementById('nuevaOpcion');
  document.getElementById('addBtn').addEventListener('click', agregar);
  inputNueva.addEventListener('keydown', e => { if (e.key === 'Enter') agregar(); });

  function agregar() {
    if (State.agregarOpcion(inputNueva.value)) {
      inputNueva.value = '';
      Storage.guardar(State);
      UI.renderLista(State);
      UI.renderRuletas(State);
      Wheel.dibujar(State);
      inputNueva.focus();
    }
  }

  document.getElementById('lista').addEventListener('click', async e => {
    const btnDel = e.target.closest('.del-btn');
    if (btnDel) {
      State.eliminarOpcion(parseInt(btnDel.dataset.index, 10));
      Storage.guardar(State);
      UI.renderLista(State);
      UI.renderRuletas(State);
      Wheel.dibujar(State);
      return;
    }

    const btnEdit = e.target.closest('.edit-btn');
    const textoEdit = e.target.closest('.opcion-texto');
    
    if (btnEdit || textoEdit) {
      const index = parseInt((btnEdit || textoEdit).dataset.index, 10);
      const r = State.getRuletaActiva();
      const valorActual = r.opciones[index];
      
      const nuevoValor = await UI.prompt('Editar opción', valorActual);
      
      if (nuevoValor !== null && nuevoValor.trim() !== '' && nuevoValor !== valorActual) {
        r.opciones[index] = nuevoValor.trim();
        Storage.guardar(State);
        UI.renderLista(State);
        Wheel.dibujar(State);
        UI.toast('Opción actualizada', 'success');
      }
    }
  });

  const spinBtn = document.getElementById('spinBtn');
  spinBtn.addEventListener('click', () => {
    const r = State.getRuletaActiva();
    if (!r) return;
    if (r.opciones.length < 2) { 
      UI.toast('Añade al menos 2 opciones para girar', 'error'); 
      return; 
    }
    
    spinBtn.disabled = true;
    Wheel.girar(State, ganador => {
      spinBtn.disabled = false;
      State.agregarHistorial(ganador);
      Storage.guardar(State);
      UI.renderHistorial(State);
      UI.renderRuletas(State);
      UI.mostrarGanador(ganador);
    });
  });

  document.getElementById('clearBtn').addEventListener('click', async () => {
    const seguro = await UI.confirmar('Limpiar opciones', '¿Estás seguro de que quieres borrar todas las opciones de esta ruleta?');
    if (seguro) {
      State.limpiarOpciones();
      Storage.guardar(State);
      UI.renderLista(State);
      UI.renderRuletas(State);
      Wheel.dibujar(State);
      UI.toast('Opciones limpiadas', 'success');
    }
  });

  const inputNombre = document.getElementById('nombreRuleta');
  document.getElementById('crearRuletaBtn').addEventListener('click', crearRuleta);
  inputNombre.addEventListener('keydown', e => { if (e.key === 'Enter') crearRuleta(); });

  function crearRuleta() {
    const nombre = inputNombre.value.trim();
    if (!nombre) {
      UI.toast('Escribe un nombre para la ruleta', 'error');
      return;
    }
    const r = State.crearRuleta(nombre);
    State.activarRuleta(r.id);
    inputNombre.value = '';
    Storage.guardar(State);
    UI.renderRuletas(State);
    refrescarRuletaYHeader();
    UI.cambiarTab('ruleta');
    UI.toast(`Ruleta "${nombre}" creada`, 'success');
  }

  document.getElementById('listaRuletas').addEventListener('click', async e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    const r = State.ruletas.find(x => x.id === id);
    if (!r) return;

    if (action === 'activar') {
      State.activarRuleta(id);
      Storage.guardar(State);
      UI.renderRuletas(State);
      refrescarRuletaYHeader();
      UI.cambiarTab('ruleta');
    }

    if (action === 'renombrar') {
      const nuevo = await UI.prompt('Renombrar ruleta', r.nombre);
      if (nuevo !== null && nuevo.trim() !== '') {
        State.renombrarRuleta(id, nuevo);
        Storage.guardar(State);
        UI.renderRuletas(State);
        UI.renderHeader(State);
        UI.toast('Nombre actualizado', 'success');
      }
    }

    if (action === 'descargar') {
      Storage.exportarRuletaIndividual(r);
      UI.toast(`Ruleta "${r.nombre}" descargada`, 'success');
    }

    if (action === 'eliminar') {
      const seguro = await UI.confirmar('Eliminar ruleta', `¿Estás seguro de que quieres eliminar "${r.nombre}"? Esta acción no se puede deshacer.`);
      if (seguro) {
        State.eliminarRuleta(id);
        Storage.guardar(State);
        UI.renderRuletas(State);
        refrescarRuletaYHeader();
        UI.renderLista(State);
        UI.toast('Ruleta eliminada', 'success');
      }
    }
  });

  // El botón de exportar global ya no existe, así que quitamos su listener

  document.getElementById('importAllBtn').addEventListener('click', () => document.getElementById('fileInputAll').click());

  document.getElementById('fileInputAll').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    Storage.importarArchivo(file, State, ok => {
      if (ok) {
        Storage.guardar(State);
        refrescarTodo();
        UI.toast('Ruletas cargadas correctamente', 'success');
      } else {
        UI.toast('El archivo no es válido', 'error');
      }
      e.target.value = '';
    });
  });

  document.getElementById('closeModal').addEventListener('click', UI.cerrarModal);
  document.getElementById('modalBg').addEventListener('click', e => {
    if (e.target.id === 'modalBg') UI.cerrarModal();
  });
})();