# Fotos para "Trabajos realizados"

Guía corta para Torres Contractor Solution. La web acepta fotos **verticales y horizontales** tomadas con el celular normal: no hace falta cámara profesional ni editar nada.

## Cómo tomar las fotos
- Usa la cámara normal en modo **Foto** (no Retrato, no Panorámica, sin filtros).
- **Vertical** sirve para la mayoría de los trabajos: baños, puertas, paneles, lámparas, cargadores, detalles.
- **Horizontal** sirve para lo ancho o largo: techos, marquesinas, paredes largas, pisos.
- La relación de aspecto normal del celular (**4:3**) es la ideal. Evita 16:9 o "pantalla completa", porque recortan más.
- Toma la foto con buena luz, de día o con las luces prendidas, y con el área limpia y recogida.
- Para cuartos pequeños puedes usar el lente gran angular (0.5×).

## Cuántas fotos por trabajo
De **3 a 6** fotos por trabajo:
1. **Portada:** el resultado terminado. Es la que más se ve.
2. Una o dos fotos de **detalle** (terminaciones, uniones, instalación).
3. *(Opcional)* una foto del **proceso**.
4. *(Opcional)* **Antes y después** tomadas **desde el mismo lugar y ángulo**. Así la web muestra un deslizador para compararlas.

## Cómo enviarlas
- Envíalas por WhatsApp **como Documento** (📎 → Documento) para que no pierdan calidad. Por Google Drive o por correo también sirve.
- No importa el tamaño: cualquier foto del celular sirve (normalmente 3000×4000 px). La web las optimiza sola.

## Datos de cada trabajo
| Campo | Ejemplo | ¿Obligatorio? |
|---|---|---|
| Título | Remodelación de baño | Sí |
| Categoría | Plomería / Electricidad / Handyman / Pintura / Losas / Lavado y sellado / Concreto | Sí |
| Pueblo | Bayamón | Recomendado |
| Mes | Septiembre 2026 | Recomendado |
| Descripción (1–2 oraciones) | Instalación de toilet y lavamanos nuevos con losa de pared. | Recomendado |
| Servicios hechos | Toilet, lavamanos, losa de pared | Opcional |

La descripción puede ir solo en español; la web la muestra igual en inglés.

---

### Para el desarrollador
1. Pon las fotos en `portfolio-inbox/<id-del-trabajo>/` en orden (portada primero).
2. Corre `npm run photos`. El script gira las fotos según el EXIF, las convierte a WebP (1600 px + miniatura de 700 px), les quita el GPS e imprime el bloque `photos: [...]` con las medidas.
3. Agrega el trabajo en `src/portfolio.ts` y borra los de ejemplo (`sample: true`).

En la cuadrícula, cada tarjeta respeta la orientación de su foto (las verticales salen altas y las horizontales anchas) y se reparte en dos columnas tipo mosaico. En el visor, la foto siempre se ve completa sobre un fondo difuminado de ella misma, así que ninguna orientación se corta. El modelo `Project` en `src/portfolio.ts` es plano a propósito: se puede pasar tal cual a una tabla de un panel de administración (Supabase, etc.).
