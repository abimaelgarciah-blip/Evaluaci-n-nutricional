/*
 * auth.js — Candado de acceso sencillo para el sitio.
 *
 * IMPORTANTE: esto NO es seguridad real. Al ser un sitio estático (todo corre
 * en el navegador), un usuario avanzado puede saltarse este candado. Sirve
 * únicamente como barrera para que personas casuales no usen la herramienta.
 * Por eso guardamos solo el hash SHA-256 de la contraseña, no la contraseña.
 */
(function () {
  'use strict';

  // SHA-256 de la contraseña de acceso.
  const HASH_CORRECTO =
    '347225c259fef53163f955f0bfb211924538217d3daac91e56c155f6bce48c9a';

  // Mientras dure la pestaña/sesión no se vuelve a pedir la contraseña.
  const CLAVE_SESION = 'evalNutri_acceso';

  async function sha256Hex(texto) {
    const datos = new TextEncoder().encode(texto);
    const buffer = await crypto.subtle.digest('SHA-256', datos);
    return [...new Uint8Array(buffer)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function desbloquear() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) overlay.remove();
    document.body.classList.remove('bloqueado');
  }

  function iniciar() {
    // ¿Ya inició sesión en esta pestaña?
    try {
      if (sessionStorage.getItem(CLAVE_SESION) === '1') {
        desbloquear();
        return;
      }
    } catch (_) { /* sin sessionStorage simplemente se pedirá siempre */ }

    document.body.classList.add('bloqueado');

    const form = document.getElementById('loginForm');
    const input = document.getElementById('loginPassword');
    const error = document.getElementById('loginError');
    if (input) input.focus();

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      error.hidden = true;

      let hash = '';
      try {
        hash = await sha256Hex(input.value);
      } catch (_) {
        error.textContent = 'Tu navegador no permite verificar la contraseña.';
        error.hidden = false;
        return;
      }

      if (hash === HASH_CORRECTO) {
        try { sessionStorage.setItem(CLAVE_SESION, '1'); } catch (_) { /* opcional */ }
        desbloquear();
      } else {
        error.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
        error.hidden = false;
        input.value = '';
        input.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
