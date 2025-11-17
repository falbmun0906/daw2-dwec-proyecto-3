"use strict";

// Inicializar cuando el DOM esté listo para asegurar que los elementos existen
document.addEventListener('DOMContentLoaded', function() {
    let db;

    const messageEl = document.getElementById('message');

    const request = indexedDB.open("CRM_Database", 1);

    request.onupgradeneeded = function(e) {
        db = e.target.result;
        if (!db.objectStoreNames.contains('clients')) {
            const objectStore = db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('phone', 'phone', { unique: false });
        }
    }

    request.onerror = function(event) {
        console.error("Error abriendo IndexedDB:", event);
        if (messageEl) messageEl.textContent = 'Error abriendo IndexedDB';
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        fetchClients();
    }

    const form = document.getElementById('client-form');
    const addBtn = document.getElementById('add-btn');
    const inputs = form ? form.querySelectorAll('input') : [];

    const phoneInput = form ? form.querySelector('[name="phone"]') : null;
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatearTelefono(this);
            validateField(this);
            validateAllInputs();
        });
    }

    // validar también en input (no sólo en blur) para mejorar UX
    inputs.forEach(input => {
        // validar en tiempo real mientras se escribe y también al perder el foco
        input.addEventListener('input', () => {
            // marcar como tocado la primera vez que se escribe
            if (!input.dataset.touched) input.dataset.touched = 'true';
            // si es teléfono, formatear antes de validar
            if (input.name === 'phone') formatearTelefono(input);
            validateField(input);
            // revalidar todos los campos para actualizar clases de los no modificados
            [...inputs].forEach(i => { if (i !== input) validateField(i); });
            validateAllInputs();
        });
        input.addEventListener('blur', () => {
            // marcar como tocado al perder foco también (por si sólo se hace focus/blur)
            if (!input.dataset.touched) input.dataset.touched = 'true';
            // refuerza validación en blur
            validateField(input);
            validateAllInputs();
        });
        // cubrir pegados de texto
        input.addEventListener('paste', () => {
            setTimeout(() => {
                if (!input.dataset.touched) input.dataset.touched = 'true';
                if (input.name === 'phone') formatearTelefono(input);
                validateField(input);
                // revalidar todos los campos después del pegado
                [...inputs].forEach(i => { if (i !== input) validateField(i); });
                validateAllInputs();
            }, 0);
        });
    });

    // ejecutar validación inicial para marcar campos ya rellenos (por ejemplo al editar)
    inputs.forEach(input => {
        // si hay valor inicial, considerar el campo como tocado y aplicar formateo para teléfono
        if (input.value) input.dataset.touched = 'true';
        if (input.name === 'phone' && input.value) formatearTelefono(input);
        validateField(input);
    });
    validateAllInputs();

    function validateField(input) {
        const valido = isFieldValid(input);

        if (valido) {
            input.classList.add('valid');
            input.classList.remove('invalid');
        } else {
            // En modo edición queremos mostrar el estado inválido aunque el usuario no haya tocado el campo
            const inEditMode = !!form.dataset.editing;
            if (input.dataset.touched || inEditMode) {
                input.classList.add('invalid');
                input.classList.remove('valid');
            } else {
                input.classList.remove('invalid');
                input.classList.remove('valid');
            }
        }
    }

    function validateAllInputs() {
        if (!form || !addBtn) return;
        // calcular validez real de los campos (no depender solo de las clases)
        const allValid = [...inputs].every(i => isFieldValid(i));
        addBtn.disabled = !allValid;
    }

    // Funciones de validación
    function validarNombre(nombre) {
        return nombre.trim().length >= 2;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefono(telefono) {
        const regex = /^\d{3}-\d{3}-\d{4}$/;
        return regex.test(telefono);
    }

    // helper: comprobar validez de un input (sin tocar clases)
    function isFieldValid(input) {
        if (!input) return false;
        if (input.name === 'name') return validarNombre(input.value);
        if (input.name === 'email') return validarEmail(input.value);
        if (input.name === 'phone') return validarTelefono(input.value);
        return false;
    }

    function formatearTelefono(input) {
        if(!input) return;
        // Eliminar todos los caracteres que no sean números
        let numero = input.value.replace(/\D/g, '');

        // Limitar a 10 dígitos
        numero = numero.substring(0, 10);

        // Aplicar el formato XXX-XXX-XXXX
        if (numero.length >= 3) {
            numero = numero.substring(0,3) + "-" + numero.substring(3);
        }
        if (numero.length >= 7) {
            numero = numero.substring(0,7) + "-" + numero.substring(7);
        }

        input.value = numero;
    }

    // --- LISTADO DINÁMICO ---
    function fetchClients() {
        if (!db) return;
        const store = db.transaction('clients', 'readonly').objectStore('clients');
        const request = store.getAll()
        request.onsuccess = function(event) {
            const clients = request.result || [];

            const listado = document.getElementById('clients-list');
            if (!listado) return;
            listado.innerHTML = '';
            clients.forEach(cliente => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${escapeHtml(cliente.name)}</td>
                    <td>${escapeHtml(cliente.email)}</td>
                    <td>${escapeHtml(cliente.phone)}</td>
                    <td>
                        <button data-id="${cliente.id}" class="edit-btn">Editar</button>
                        <button data-id="${cliente.id}" class="delete-btn">Eliminar</button>
                    </td>
                `;
                listado.appendChild(fila);
            });

            // delegación de eventos para editar/eliminar
            listado.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    editClient(Number(this.dataset.id));
                });
            });
            listado.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    deleteClient(Number(this.dataset.id));
                });
            });
        };
        request.onerror = function(e) {
            console.error('Error al leer clientes', e);
            if (messageEl) messageEl.textContent = 'Error al leer clientes';
        }
    }

    // --- EDITAR CLIENTE ---
    window.editClient = function(id) {
        if (!db) return;
        const store = db.transaction('clients', 'readonly').objectStore('clients');
        const request = store.get(id);
        request.onsuccess = function() {
            const cliente = request.result;
            if (!cliente) return;
            form.name.value = cliente.name;
            form.email.value = cliente.email;
            form.phone.value = cliente.phone;
            form.dataset.editing = id;

            // marcar y validar todos los inputs inmediatamente para evitar tener que entrar/salir de cada uno
            const allInputs = form.querySelectorAll('input');
            allInputs.forEach(i => {
                // aplicar formateo si es teléfono
                if (i.name === 'phone' && i.value) formatearTelefono(i);
                // marcar como tocado para que los campos muestren estado inválido si no son correctos
                i.dataset.touched = 'true';
                // aplicar clases directamente según validez
                if (isFieldValid(i)) {
                    i.classList.add('valid');
                    i.classList.remove('invalid');
                } else {
                    i.classList.add('invalid');
                    i.classList.remove('valid');
                }
                // despachar un evento 'input' para reutilizar los handlers existentes y sincronizar el estado
                i.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // actualizar estado del botón según validación actual
            validateAllInputs();
            // no forzar habilitado; dejar que validateAllInputs decida
            // addBtn.disabled = false; // permitir guardar/actualizar
        };
    };

    // --- EDITAR / AÑADIR CLIENTE ---
    form.addEventListener('submit', e => {
        e.preventDefault()

        // detectar editingId sólo si dataset.editing existe y no es cadena vacía
        const editingId = (form.dataset.editing !== undefined && form.dataset.editing !== '') ? Number(form.dataset.editing) : null;

        // Construimos el objeto sin la propiedad `id` cuando es nuevo
        const cliente = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value
        };

        const transaction = db.transaction(['clients'], 'readwrite');
        const store = transaction.objectStore('clients');

        console.debug('Guardando cliente, editingId=', editingId, cliente);

        if (editingId !== null) {
            // validar editingId
            if (!Number.isFinite(editingId) || isNaN(editingId)) {
                console.error('ID de edición no válido:', editingId);
                if (messageEl) messageEl.textContent = 'ID de edición no válido. Operación cancelada.';
                return;
            }

            // en edición, incluimos el id y hacemos put
            cliente.id = editingId;
            console.debug('Actualizando cliente con id=', cliente.id);
            try {
                store.put(cliente);
            } catch (err) {
                console.error('Error en put():', err);
                if (messageEl) messageEl.textContent = 'Error actualizando cliente: ' + err.message;
                return;
            }
            delete form.dataset.editing;
        } else {
            // si por alguna razón existe la propiedad id en cliente, elimínala si es inválida
            if (Object.prototype.hasOwnProperty.call(cliente, 'id')) {
                console.debug('cliente contiene id antes de add:', cliente.id, 'keys:', Object.keys(cliente));
                if (cliente.id === undefined || cliente.id === null || cliente.id === '') {
                    delete cliente.id;
                    console.debug('id eliminado del objeto cliente antes de add');
                } else if (!isValidKey(cliente.id)) {
                    console.error('Clave id inválida para IndexedDB:', cliente.id);
                    if (messageEl) messageEl.textContent = 'Clave de cliente inválida. Operación cancelada.';
                    return;
                }
            }

            // en alta, no enviamos la propiedad id (IndexedDB la generará)
            console.debug('Añadiendo nuevo cliente', cliente, 'keys:', Object.keys(cliente));
            try {
                const req = store.add(cliente);
                req.onsuccess = function() {
                    // opcional: mostrar mensaje breve
                    if (messageEl) {
                        messageEl.style.color = 'green';
                        messageEl.textContent = 'Cliente añadido correctamente';
                        setTimeout(()=> { messageEl.textContent = ''; messageEl.style.color = 'red'; }, 2000);
                    }
                }
                req.onerror = function(e) {
                    console.error('Error añadiendo cliente (request):', e);
                    if (messageEl) messageEl.textContent = 'No se pudo añadir el cliente: ' + (e.target.error?.message || e.target.error);
                }
            } catch (err) {
                console.error('Error en add():', err);
                if (messageEl) messageEl.textContent = 'Error al añadir cliente: ' + err.message;
                return;
            }
        }

        transaction.oncomplete = function() {
            fetchClients();
            form.reset();
            // limpiar clases
            inputs.forEach(i => { i.classList.remove('valid', 'invalid'); });
            addBtn.disabled = true;
        };

        transaction.onerror = function(e) {
            alert("Error al guardar el cliente: " + (e.target.error?.message || e.target.error));
        };
    });

    function isValidKey(key) {
        // IndexedDB keys: numbers, dates, strings, arrays; reject objects/functions
        const t = typeof key;
        if (t === 'number') return Number.isFinite(key) && !Number.isNaN(key);
        if (t === 'string') return key !== '';
        if (key instanceof Date) return true;
        if (Array.isArray(key)) return key.length > 0;
        return false;
    }

    // --- ELIMINAR CLIENTE ---
    window.deleteClient = function(id) {
        if (!db) return;
        const transaction = db.transaction(['clients'], 'readwrite');
        const store = transaction.objectStore('clients');
        store.delete(id);

        transaction.oncomplete = function() {
            fetchClients();
        };

        transaction.onerror = function(e) {
            alert("Error al eliminar el cliente: " + (e.target.error?.message || e.target.error));
        };
    };

    function escapeHtml(str = '') {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
    }

    // inicial validation
    validateAllInputs();
});
