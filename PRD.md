# Planning Guide

Una interfaz de chat inteligente para analizar documentos PDF con retroalimentación en tiempo real del progreso de análisis de reglas y detección de errores.

**Experience Qualities**:
1. **Transparente** - Los usuarios deben ver exactamente qué está haciendo el sistema en cada momento del análisis
2. **Informativo** - Cada paso del proceso debe comunicarse claramente con mensajes de estado detallados
3. **Profesional** - La interfaz debe inspirar confianza en un proceso técnico complejo

**Complexity Level**: Light Application (multiple features with basic state)
  - Gestiona conversaciones de chat, carga de archivos, y simulación de análisis progresivo con estado persistente

## Essential Features

### Chat Interface
- **Functionality**: Conversación bidireccional con el agente AI
- **Purpose**: Permitir comunicación natural para enviar comandos y recibir respuestas
- **Trigger**: Usuario escribe mensaje y presiona Enter o botón enviar
- **Progression**: Usuario escribe mensaje → presiona enviar → mensaje aparece en chat → agente procesa → respuesta aparece
- **Success criteria**: Mensajes se muestran cronológicamente, scroll automático al último mensaje

### PDF Upload & Analysis
- **Functionality**: Subir documentos PDF para análisis de reglas con feedback progresivo
- **Purpose**: Procesar documentos complejos mostrando cada paso del análisis
- **Trigger**: Usuario arrastra archivo PDF o hace clic en botón de carga
- **Progression**: Seleccionar archivo → iniciar carga → mostrar "Extrayendo información" → "Leyendo documento" → "Procesando información" → "Analizando regla 1/N" → "Detectando errores" → mostrar resultados finales
- **Success criteria**: Cada fase muestra mensaje de estado distintivo y barra de progreso actualiza en tiempo real

### Real-time Status Verbosity
- **Functionality**: Mostrar actualizaciones detalladas línea por línea del proceso de análisis
- **Purpose**: Dar transparencia total sobre operaciones de larga duración
- **Trigger**: Inicia automáticamente cuando comienza el análisis
- **Progression**: Análisis comienza → aparece mensaje "Extrayendo información..." → actualiza a "Leyendo documento..." → "Procesando información..." → "Analizando regla X/N" (incrementando) → "Detectando errores..." → "Análisis completo"
- **Success criteria**: Mensajes aparecen secuencialmente, sin reemplazarse, creando un log visible

### Progress Bar
- **Functionality**: Barra visual que muestra items procesados vs total
- **Purpose**: Dar indicador visual rápido del avance
- **Trigger**: Aparece cuando inicia el análisis
- **Progression**: Muestra 0/N al inicio → incrementa a 1/N, 2/N... → completa a N/N → desaparece o muestra completado
- **Success criteria**: Porcentaje y números actualizan suavemente, barra visual refleja progreso

## Edge Case Handling

- **Archivos no-PDF**: Mostrar error claro indicando que solo se aceptan PDFs
- **Archivos muy grandes**: Mostrar advertencia si el archivo excede límite razonable
- **Análisis interrumpido**: Si usuario navega fuera, guardar estado de conversación
- **Mensajes vacíos**: Deshabilitar envío de mensajes sin contenido
- **Chat largo**: Scroll automático se mantiene en último mensaje pero permite navegación manual

## Design Direction

La interfaz debe sentir profesional y técnica, como una terminal de desarrollador modernizada - inspirando confianza en procesos complejos sin sentirse intimidante. Interfaz limpia y enfocada que privilegia la legibilidad del contenido sobre decoración, con animaciones sutiles solo para comunicar cambios de estado importantes.

## Color Selection

Triadic - Usando azul profesional, verde de éxito, y naranja de acento para crear jerarquía visual clara entre estados del sistema (procesando, éxito, advertencia).

- **Primary Color**: Azul índigo profundo (oklch(0.45 0.15 260)) - Comunica profesionalismo, tecnología y confiabilidad
- **Secondary Colors**: Gris neutro suave (oklch(0.96 0 0)) para fondos de mensajes del usuario y elementos secundarios
- **Accent Color**: Verde esmeralda (oklch(0.65 0.18 160)) para estados de éxito y progreso completado
- **Foreground/Background Pairings**:
  - Background (Gris muy claro oklch(0.98 0 0)): Texto oscuro (oklch(0.25 0 0)) - Ratio 12.8:1 ✓
  - Card/Agent messages (Blanco oklch(1 0 0)): Texto oscuro (oklch(0.25 0 0)) - Ratio 14.5:1 ✓
  - Primary (Azul índigo oklch(0.45 0.15 260)): Texto blanco (oklch(1 0 0)) - Ratio 7.2:1 ✓
  - Secondary (Gris suave oklch(0.96 0 0)): Texto oscuro (oklch(0.3 0 0)) - Ratio 9.8:1 ✓
  - Accent (Verde esmeralda oklch(0.65 0.18 160)): Texto blanco (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Muted (Gris medio oklch(0.92 0 0)): Texto medio (oklch(0.5 0 0)) - Ratio 5.2:1 ✓

## Font Selection

Tipografía que equilibra legibilidad técnica con calidez moderna - Inter para UI y mensajes cortos, JetBrains Mono para estados de proceso que requieren scanning rápido.

- **Typographic Hierarchy**:
  - H1 (Header título): Inter SemiBold/24px/normal letter spacing - Para título principal "Análisis de Documentos"
  - H2 (Status header): Inter Medium/16px/tight letter spacing - Para encabezados de sección
  - Body (Chat messages): Inter Regular/15px/relaxed leading (1.6) - Para mensajes del chat
  - Code/Status (Verbosity logs): JetBrains Mono Regular/14px/normal leading - Para logs de proceso técnico
  - Small (Timestamps): Inter Regular/12px/wide letter spacing - Para metadatos y timestamps
  - Progress label: Inter Medium/13px/normal spacing - Para contadores "X/N items"

## Animations

Las animaciones deben ser utilitarias y casi invisibles - principalmente para suavizar la aparición de nuevos mensajes y actualizaciones de progreso, evitando distraer de información importante que cambia rápidamente.

- **Purposeful Meaning**: 
  - Fade-in suave para nuevos mensajes (evita "pop" abrupto)
  - Progress bar crece suavemente con easing natural
  - Typing indicator pulsa gentilmente cuando AI está "pensando"
  
- **Hierarchy of Movement**:
  - Alta prioridad: Progress bar y contadores (deben ser inmediatamente visibles)
  - Media prioridad: Nuevos mensajes de chat (fade-in 200ms)
  - Baja prioridad: Micro-interacciones de hover en botones (100ms)

## Component Selection

- **Components**:
  - `ScrollArea` (Shadcn) - Para área de mensajes de chat con scroll automático
  - `Card` (Shadcn) - Para mensajes del agente con fondo diferenciado
  - `Button` (Shadcn) - Para enviar mensajes y cargar archivos, variante primary para envío
  - `Input` (Shadcn) - Para campo de entrada de mensajes con borde sutil
  - `Progress` (Shadcn) - Para barra de progreso de análisis, personalizado con color accent
  - `Badge` (Shadcn) - Para indicadores de estado (procesando, completado, error)
  - `Separator` (Shadcn) - Para dividir secciones visuales
  - `Alert` (Shadcn) - Para mostrar errores de validación de archivos

- **Customizations**:
  - Mensaje de usuario: div simple con fondo secondary, alineado a la derecha, borde redondeado
  - Mensaje de agente: Card con fondo blanco, alineado a la izquierda, con avatar icono
  - Status log container: ScrollArea con fondo muted, fuente monospace, padding interno
  - File upload zone: Area con border dashed, hover state que cambia a border-primary
  
- **States**:
  - Button enviar: disabled cuando input vacío o análisis en progreso, loading state con spinner
  - Input mensajes: disabled durante análisis activo
  - Progress bar: indeterminado al inicio, determinado cuando hay total conocido
  - File upload: hover muestra border más marcado, disabled durante análisis
  
- **Icon Selection**:
  - `PaperPlaneRight` (Phosphor) - Para botón enviar mensaje
  - `FilePdf` (Phosphor) - Para botón subir PDF y indicador de archivo
  - `Robot` (Phosphor) - Para avatar del agente AI
  - `User` (Phosphor) - Para avatar del usuario
  - `CheckCircle` (Phosphor) - Para reglas analizadas exitosamente
  - `WarningCircle` (Phosphor) - Para errores detectados
  - `SpinnerGap` (Phosphor) - Para indicador de carga
  
- **Spacing**:
  - Gap entre mensajes: `gap-3` (12px)
  - Padding interno de mensajes: `p-4` (16px)
  - Margin de chat container: `p-6` (24px)
  - Gap en input group: `gap-2` (8px)
  
- **Mobile**:
  - Stack vertical completo: input fijo en bottom, chat ocupa resto de viewport
  - Mensajes con max-width 85% para no pegar a bordes
  - Botones de acción mantienen tamaño táctil (44px min)
  - Font size incrementa ligeramente (16px) para evitar zoom en iOS
  - Status logs con scroll horizontal si necesario
  - Progress bar se mantiene visible en posición sticky
