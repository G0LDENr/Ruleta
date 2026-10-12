// Renderizado e interacción con el DOM
const UI = {
  escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  },

  renderLista(state) {
    const ul = document.getElementById('lista');
    ul.innerHTML = '';

    if (state.opciones.length === 0) {
      ul.innerHTML = '<li class="empty">No hay opciones. Añade una arriba.</li>';
      return;
    }

    state.opciones.forEach((op, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${this.escapeHtml(op)}</span>`;
      const btn = document.createElement('button');
      btn.textContent = '🗑';
      btn.dataset.index = i;
      btn.classList.add('del-btn');
      li.appendChild(btn);
      ul.appendChild(li);
    });
  },

  renderHistorial(state) {
    const cont = document.getElementById('historial');
    if (state.historial.length === 0) {
      cont.innerHTML = '<div class="hist-item" style="color:#555">Sin resultados aún</div>';
      return;
    }
    cont.innerHTML = state.historial.map(h => {
      const fecha = new Date(h.fecha).toLocaleString('es', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
      return `<div class="hist-item">
        <span>${this.escapeHtml(h.opcion)}</span>
        <span>${fecha}</span>
      </div>`;
    }).join('');
  },

  mostrarGanador(texto) {
    document.getElementById('winnerText').textContent = texto;
    document.getElementById('modalBg').classList.add('show');
  },

  cerrarModal() {
    document.getElementById('modalBg').classList.remove('show');
  },

  cambiarTab(nombre) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${nombre}"]`).classList.add('active');
    document.getElementById('view-' + nombre).classList.add('active');
  }
};