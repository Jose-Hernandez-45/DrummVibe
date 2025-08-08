# Política Interna de Liberación (Release Policy)

## Control de Versiones

Usamos **Versionado Semántico (SemVer)** para controlar las versiones del software:

- Formato: `vMAJOR.MINOR.PATCH`  
- **MAJOR**: Cambios incompatibles o que rompen compatibilidad.  
- **MINOR**: Nuevas funcionalidades compatibles con versiones anteriores.  
- **PATCH**: Corrección de errores sin cambios funcionales.

Ejemplo: `v1.2.0`

---

## Criterios para la Liberación

Antes de liberar una nueva versión, se deben cumplir los siguientes requisitos:

### 1. Pruebas Automatizadas

- Todas las pruebas unitarias, de integración y de sistema deben pasar exitosamente sin errores.

### 2. Revisión de Código

- La versión debe ser revisada y aprobada por al menos **dos revisores** independientes.
- Las revisiones deben incluir validación de funcionalidad, seguridad y calidad del código.

### 3. Validación del Líder Técnico

- El líder técnico debe validar la versión, firmando digitalmente o dejando constancia de aprobación.

### 4. Documentación Técnica

- Debe existir documentación actualizada mínima, incluyendo:
  - `README.md` con instrucciones generales y funcionalidades nuevas.
  - `CHANGELOG.md` con registro detallado de cambios y versiones.

### 5. Registro de Versión

- La versión actual debe quedar registrada en el archivo `VERSION.txt` con el número SemVer correspondiente.

### 6. Firma de Liberación por QA

- El equipo de Control de Calidad (QA) debe validar la versión en un entorno de pruebas.
- QA debe firmar y dejar constancia de la liberación aprobada.

---

## Ejemplo de Proceso

1. Se desarrolla una nueva funcionalidad o corrección en la app de clases de batería.  
2. Se actualizan y ejecutan pruebas, las cuales deben pasar.  
3. Se crea un Pull Request para revisión.  
4. Dos revisores aprueban la solicitud.  
5. El líder técnico valida y firma la versión.  
6. Se actualiza el `README.md`, `CHANGELOG.md` y `VERSION.txt`.  
7. QA valida la versión en entorno de pruebas y firma la liberación.  
8. Se publica la versión oficial (ejemplo: `v1.0.0`).

---

## Firma de Liberación

| Fecha       | Versión | QA Responsable | Firma Digital / Validación |
|-------------|---------|----------------|----------------------------|
| 2025-08-08  | v1.0.0  | Juan Pérez     | Firma_LD_123abc            |

---

Este documento debe revisarse y actualizarse periódicamente para garantizar la calidad del proceso de liberación.
