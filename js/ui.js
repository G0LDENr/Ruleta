const UI = {
  escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },

  // ===== NUEVO: SISTEMA DE TOASTS =====
  toast(mensaje, tipo = 'info') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${tipo}`;
    el.innerHTML = `<span>${this.escapeHtml(mensaje)}</span>`;
    container.appendChild(el);

    setTimeout(() => {
      el.classList.add('fade-out');
      el.addEventListener('animationend', () => el.remove());
    }, 3000);
  },

  // ===== NUEVO: MODAL DE CONFIRMACIÓN =====
  confirmar(titulo, mensaje) {
    return new Promise((resolve) => {
      const modal = document.getElementById('confirmBg');
      document.getElementById('confirmTitle').textContent = titulo;
      document.getElementById('confirmMsg').textContent = mensaje;
      
      const btnYes = document.getElementById('confirmYes');
      const btnNo = document.getElementById('confirmNo');

      // Limpiamos eventos viejos clonando
      const newBtnYes = btnYes.cloneNode(true);
      const newBtnNo = btnNo.cloneNode(true);
      btnYes.replaceWith(newBtnYes);
      btnNo.replaceWith(newBtnNo);

      newBtnYes.onclick = () => { modal.classList.remove('show'); resolve(true); };
      newBtnNo.onclick = () => { modal.classList.remove('show'); resolve(false); };
      
      modal.classList.add('show');
    });
  },

  // ===== NUEVO: MODAL DE PROMPT (Renombrar) =====
  prompt(titulo, valorInicial) {
    return new Promise((resolve) => {
      const modal = document.getElementById('promptBg');
      const input = document.getElementById('promptInput');
      
      // Actualizamos el título del modal de prompt
      modal.querySelector('.label').textContent = titulo;
      input.value = valorInicial;

      const btnYes = document.getElementById('promptYes');
      const btnNo = document.getElementById('promptNo');

      const newBtnYes = btnYes.cloneNode(true);
      const newBtnNo = btnNo.cloneNode(true);
      btnYes.replaceWith(newBtnYes);
      btnNo.replaceWith(newBtnNo);

      newBtnYes.onclick = () => { modal.classList.remove('show'); resolve(input.value); };
      newBtnNo.onclick = () => { modal.classList.remove('show'); resolve(null); };
      
      modal.classList.add('show');
      setTimeout(() => input.focus(), 100);
    });
  },

  // ===== RESTO DE FUNCIONES =====
  renderLista(state) {
    const ul = document.getElementById('lista');
    const r = state.getRuletaActiva();
    ul.innerHTML = '';

    if (!r || r.opciones.length === 0) {
      ul.innerHTML = '<li class="empty">No hay opciones. Añade una arriba.</li>';
      return;
    }

    r.opciones.forEach((op, i) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${this.escapeHtml(op)}</span>
        <button class="del-btn" data-index="${i}">
          <re-icon icon="trash" size="18"></re-icon>
        </button>
      `;
      ul.appendChild(li);
    });
  },

  renderHistorial(state) {
    const cont = document.getElementById('historial');
    const r = state.getRuletaActiva();
    const hist = r?.historial || [];

    if (hist.length === 0) {
      cont.innerHTML = '<div class="hist-item" style="color:#555">Sin resultados aún</div>';
      return;
    }

    cont.innerHTML = hist.map(h => {
      const fecha = new Date(h.fecha).toLocaleString('es', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      return `<div class="hist-item">
        <span>${this.escapeHtml(h.opcion)}</span>
        <span>${fecha}</span>
      </div>`;
    }).join('');
  },

  renderRuletas(state) {
    const ul = document.getElementById('listaRuletas');
    ul.innerHTML = '';

    if (state.ruletas.length === 0) {
      ul.innerHTML = '<li class="empty">No hay ruletas guardadas. Crea una arriba.</li>';
      return;
    }

    state.ruletas.forEach(r => {
      const li = document.createElement('li');
      li.className = 'ruleta-item' + (r.id === state.activaId ? ' activa' : '');
      
      li.innerHTML = `
        <div class="info">
          <div class="nombre">${this.escapeHtml(r.nombre)}</div>
          <div class="meta">${r.opciones.length} opciones · ${r.historial.length} resultados</div>
        </div>
        <div class="acciones">
          <button class="icon activo" data-action="activar" data-id="${r.id}" title="Cargar">
            <re-icon icon="play" size="18"></re-icon>
          </button>
          <button class="icon" data-action="renombrar" data-id="${r.id}" title="Renombrar">
            <re-icon icon="edit" size="18"></re-icon>
          </button>
          <button class="icon peligro" data-action="eliminar" data-id="${r.id}" title="Eliminar">
            <re-icon icon="trash" size="18"></re-icon>
          </button>
        </div>
      `;
      ul.appendChild(li);
    });
  },

  renderHeader(state) {
    const r = state.getRuletaActiva();
    document.getElementById('tituloRuleta').textContent = r ? r.nombre : 'Ruleta';
  },

  mostrarGanador(texto) {
    document.getElementById('winnerText').textContent = texto;
    document.getElementById('modalBg').classList.add('show');
  },

  cerrarModal() {
    document.getElementById('modalBg').classList.remove('show');
  },

  cambiarTab(nombre) {
    document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector(`.nav-item[data-tab="${nombre}"]`).classList.add('active');
    document.getElementById('view-' + nombre).classList.add('active');
  }
};