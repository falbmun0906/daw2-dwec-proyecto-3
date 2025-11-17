# CRM con IndexedDB | Ampliación y Mejora

## Descripción general

Este proyecto es una ampliación del CRM web desarrollado en clase, el cual utiliza **IndexedDB** para la gestión offline de clientes desde el navegador. El objetivo de este trabajo es **demostrar la capacidad de mejora y refactorización sobre proyectos existentes**, incorporando mejoras a nivel funcional, de interfaz y de experiencia de usuario, tal como se demanda en situaciones reales de desarrollo web profesional.

---

## Funcionalidades básicas

- **Altas, edición y borrado de clientes** empleando formularios validados.
- **Persistencia de datos** con IndexedDB (almacenamiento local robusto para grandes volúmenes).
- **Interfaz intuitiva** y responsive, con estados visuales para formularios y acciones.

---

## Mejoras implementadas

### 1. Búsqueda y filtrado de clientes en tiempo real

- Añadido un campo de búsqueda sobre la tabla que permite **filtrar clientes** por nombre, correo o teléfono.
- La búsqueda es instantánea, con respuesta en vivo según el usuario escribe.
- Mejora enormemente la experiencia cuando se gestiona una lista amplia de clientes.

### 2. Confirmación visual y manejo elegante de errores

- Al intentar **eliminar un cliente**, se muestra un cuadro de diálogo de confirmación para evitar borrados accidentales.
- Todos los errores del sistema (IndexedDB o validaciones) se reflejan de manera destacada en la interfaz, usando un área de mensajes específica.
- Mejora la robustez y profesionalidad de la aplicación, incrementando la confianza del usuario.

### 3. Uso de etiquetas semánticas y personalización por usuario

- El HTML utiliza ahora **etiquetas semánticas** (`<main>`, `<section>`, `<header>`, etc.) mejorando accesibilidad y SEO.
- El nombre del usuario se solicita la primera vez que accede y se muestra en la bienvenida, guardándose en `localStorage` para personalizar la experiencia en visitas posteriores.
- Los textos y etiquetas han sido adaptados para mayor creatividad, alineados con buenas prácticas UI/UX.

---

## Capturas de pantalla

<img width="587" height="265" alt="image" src="https://github.com/user-attachments/assets/19c8ed09-7f8e-42e2-b5f3-ed39e49f9d78" />
<img width="1040" height="68" alt="image" src="https://github.com/user-attachments/assets/27b9d967-0e25-4fb6-9428-4e100b6d2434" />
<img width="1906" height="507" alt="image" src="https://github.com/user-attachments/assets/88d88a4a-7871-465c-90a0-b88ad2010a87" />
<img width="1920" height="398" alt="image" src="https://github.com/user-attachments/assets/b4db37d2-9441-4e55-a10d-8223f237049f" />
<img width="572" height="195" alt="image" src="https://github.com/user-attachments/assets/aabbbddc-4b76-4a58-9e79-7ccd294b6c9c" />

---

## Instalación y uso

1. **Descarga o clona este repositorio** en tu ordenador.
2. Abre `index.html` en cualquier navegador moderno.  
   *(No se requiere servidor ni conexión a internet; todo funciona 100% en local.)*
3. Al iniciar, se solicitará tu nombre para personalizar la experiencia.
4. Usa el formulario para añadir, editar y eliminar clientes. Utiliza la barra de búsqueda para filtrar el listado.

---

## Estructura del repositorio

- **index.html**: Página principal, estructura semántica y formularios.
- **css/styles.css**: Estilos modernos y responsive.
- **js/crm-indexeddb.js**: Lógica principal (IndexedDB, eventos, validación, mejoras).

---

## Características técnicas

- **Eventos DOM** en formularios, botones, búsqueda en tiempo real y validación avanzada de campos.
- **Validación exhaustiva** de todos los campos, con feedback visual y formateo automático.
- **Manejo de errores**: Todas las acciones críticas gestionan errores y notifican al usuario.
- **Código limpio y comentado**: El JS está organizado según responsabilidades (validación, renderizado, CRUD) y contiene comentarios explicativos en las partes más importantes.
- **Etiquetas semánticas** empleadas en el HTML para máxima accesibilidad y escalabilidad.
- **Personalización** con persistencia del nombre del usuario (localStorage).

---

## Ejemplo de uso

- Añadir cliente → Aparece automáticamente en la lista.
- Buscar por nombre, email o teléfono → La tabla muestra solo coincidencias en tiempo real.
- Editar un cliente → Los campos del formulario se rellenan y se puede guardar la edición.
- Eliminar cliente → Se solicita confirmación antes de borrar y se actualiza la lista al instante.

---

## Comentarios y mejoras

Este proyecto puede seguir ampliándose, por ejemplo, permitiendo paginar los resultados, exportar a CSV, o integrar nuevos tipos de búsqueda (por rangos, fechas, etc.), o añadir animaciones visuales mediante CSS.

---

## Autor

Francisco Alba Muñoz 
2025 | CFGS DAW | Desarrollo Web en Entorno Cliente

---

## Licencia

Uso educativo.
