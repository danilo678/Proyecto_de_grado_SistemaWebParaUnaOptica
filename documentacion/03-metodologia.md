# III. METODOLOGÍA DE LA INVESTIGACIÓN Y DESARROLLO ÁGIL

## 3.1. Tipo de investigación

> "La investigación aplicada requiere de una metodología diferente a la investigación básica y pura; la primera se funda en la identificación de problemas del contexto y después de allí, propone soluciones con base en los conocimientos adquiridos en la investigación pura."

La investigación aplicada es un tipo de investigación científica orientada a resolver problemas específicos mediante el uso de conocimientos, teorías y principios previamente desarrollados. Su propósito principal consiste en ofrecer soluciones a situaciones reales, adaptando el conocimiento existente a las necesidades de un contexto determinado.

El presente proyecto se inscribe en esa línea: parte de un problema concreto —la gestión manual y dispersa de la información en una óptica de la ciudad de Oruro— y aplica conocimientos de ingeniería de software, bases de datos y metodologías ágiles para construir una solución funcional y medible.

## 3.2. Matriz de consistencia técnica y tecnológica

> "La matriz de consistencia es un instrumento metodológico de verificación: su única función es demostrar que tu investigación tiene coherencia lógica."

La matriz constituye la hoja de ruta que permite verificar la coherencia del proyecto, relacionando problema, objetivos, metodología y resultados esperados.

| | **Problema** | **Objetivos** | **Metodología** | **Resultados esperados** |
|---|---|---|---|---|
| **General** | Gestión administrativa manual o con herramientas básicas en la óptica de Oruro, que genera pérdida de información, errores operativos y decisiones sin sustento. | **OG:** Desarrollar un sistema de gestión web para el control y administración integral de la óptica. | Investigación aplicada orientada a resolver un problema real de la organización, con metodología ágil Lean Startup. | Prototipo tecnológico funcional (MVP) que centraliza la información de la óptica y reduce las actividades manuales. |
| **OE1** | Desconocimiento sistematizado de los procesos actuales y de las oportunidades de mejora en la gestión de información. | Determinar los procesos y procedimientos actuales que se manejan en la óptica. | Fase inicial de levantamiento de información y análisis de procesos actuales. Iteración 1 y definición del alcance del MVP. | Diagnóstico documentado de los procesos actuales, listado de necesidades prioritarias y definición clara del alcance. |
| **OE2** | Información dispersa en documentos físicos y herramientas de oficina; ausencia de una estructura de datos confiable. | Diseñar una base de datos eficiente y organizada que centralice toda la información de la óptica. | Arquitectura en capas (Presentación–Negocio–Persistencia) combinada con cliente-servidor. Stack: NestJS + TypeORM + PostgreSQL (backend); React + Vite + Tailwind CSS + Axios (frontend). Iteraciones Lean: Usuarios/Seguridad → Clientes → Inventario → Recetas → Ventas → Órdenes de Trabajo → Reportes. | Base de datos relacional (`optica_db`) con las entidades definidas: usuarios, roles, clientes, productos, categorías, recetas, ventas, detalle de venta, órdenes de trabajo y recibos. |
| **OE3** | Procesos operativos lentos y propensos a errores por la falta de automatización de clientes, inventario, ventas y pedidos. | Desarrollar los módulos del sistema siguiendo los requerimientos de la óptica, de forma iterativa y adaptativa. | Desarrollo incremental por épicas e iteraciones cortas, entregando valor en cada versión del producto. | Módulos funcionales del MVP operativos: autenticación JWT/RBAC, clientes, productos/stock, recetas OD/OS, ventas con recibos PDF y órdenes de trabajo con seguimiento de estados. |
| **OE4** | Riesgo de que la solución tecnológica no funcione según lo esperado o no aporte valor real a los usuarios. | Probar el sistema realizando pruebas exhaustivas que garanticen su funcionamiento esperado. | Fases Medir y Aprender del ciclo Lean Startup: métricas operativas (tiempo de registro, precisión de stock, tiempos de atención) y retroalimentación de usuarios. | Sistema validado mediante pruebas que demuestren reducción de errores, agilización de procesos y aceptación por parte del personal. |

## 3.3. Metodología Ágil: Lean Startup

### Fundamentación de la metodología

> "Un startup se define como una organización destinada a crear un nuevo producto o servicio en medio de una gran incertidumbre."

El desarrollo de una startup no depende únicamente de una idea innovadora; también exige una adecuada gestión de esa incertidumbre. Los modelos tradicionales de gestión han servido a organizaciones consolidadas, pero no siempre responden bien cuando el producto aún debe validarse en el mercado o con los usuarios.

> "El método Lean Startup está diseñado para enseñar a conducir a una startup a través de la experimentación."

Lean Startup compara el funcionamiento de una startup con la conducción de un automóvil: se avanza girando el volante constantemente —ajustando el rumbo— en lugar de trazar todo el trayecto antes de salir. En este enfoque, el crecimiento del proyecto no depende solo de desarrollar nuevas funcionalidades, sino de aprender rápido qué funciona y qué no.

A diferencia de los modelos tradicionales, que planifican detalladamente desde el inicio, este marco propone construir versiones pequeñas del producto, medir su impacto y aprender de los resultados. Su elemento central es el ciclo Construir–Medir–Aprender: primero se desarrolla una idea, luego se mide su comportamiento real y finalmente se aprende de la evidencia para decidir el siguiente paso. Uno de sus principios más importantes es el *aprendizaje validado*, que establece que las decisiones deben fundamentarse en datos comprobables y no en suposiciones; cada iteración del proyecto puede entenderse como un experimento orientado a comprobar hipótesis.

Para el desarrollo del "Sistema de Información Web Fullstack para la Gestión Integral de la Óptica", esta metodología resultó adecuada porque permitió identificar qué funcionalidades aportan valor inmediato al establecimiento y cuáles pueden esperar. El objetivo nunca fue construir el sistema completo desde el primer día, sino entregarlo progresivamente, módulo por módulo, validando cada entrega con quienes lo usarán.

### Ciclo Construir – Medir – Aprender

El núcleo de Lean Startup está representado por este ciclo, que transforma las ideas en productos, las opiniones en datos y los datos en decisiones.

#### Fase Construir (Build)

Consiste en desarrollar la mínima cantidad de funcionalidades necesarias para validar una hipótesis específica. En lugar de construir el sistema completo desde el inicio, se implementan únicamente aquellas características que permiten comprobar si la solución resuelve efectivamente los problemas identificados en la óptica.

Durante esta etapa se utilizaron las tecnologías seleccionadas: React para la interfaz de usuario, NestJS y TypeORM para el backend, y PostgreSQL para la gestión de datos. La construcción del MVP se realizó de manera incremental, priorizando funcionalidades de mayor impacto; así, antes de desarrollar módulos complejos de análisis se construyó primero la gestión de clientes, uno de los problemas principales detectados durante el levantamiento de información. De esta forma se redujo el riesgo de desarrollar características innecesarias y se garantizó un uso eficiente de los recursos.

#### Fase Medir (Measure)

Puesta en marcha una primera versión funcional, corresponde evaluar su desempeño recopilando información confiable sobre el uso del sistema, la experiencia de los usuarios y los resultados obtenidos. Esa evidencia revela necesidades reales, deficiencias y nivel de aceptación, y orienta el rumbo hacia funcionalidades que respondan mejor a los requerimientos.

Para cada iteración se definieron métricas específicas:

- **Gestión de clientes:** tiempo requerido para registrar un cliente nuevo, velocidad de consulta del historial y cantidad de errores cometidos durante el registro.
- **Inventarios:** precisión del control de stock, tiempo necesario para localizar productos y capacidad del sistema para detectar existencias bajas.
- **Ventas:** tiempo de registro de una transacción, facilidad de generación de comprobantes y disponibilidad de información comercial.

Estas mediciones permiten comparar la situación previa de la organización con los resultados posteriores a la implementación.

#### Fase Aprender (Learn)

La última etapa corresponde al aprendizaje validado: analizar los resultados de la medición para extraer conclusiones que mejoren el producto. El aprendizaje se basa en evidencia del uso real, no en suposiciones ni criterios personales.

Los resultados indican qué aspectos cumplen las expectativas y cuáles requieren ajustes. Si una funcionalidad genera mejoras significativas y buena recepción, la hipótesis queda validada y se continúa profundizando en esa línea; si las métricas muestran poco impacto o problemas de adopción, toca replantear su diseño o modificar la estrategia. A este proceso Lean Startup lo denomina *aprendizaje validado*: las decisiones se fundamentan en evidencia obtenida directamente del sistema, reduciendo incertidumbre y aumentando la probabilidad de éxito.

### Iteraciones del proyecto

El desarrollo se organizó en iteraciones sucesivas, cada una enfocada en implementar y validar un conjunto específico de funcionalidades:

**Iteración 1: Gestión de Usuarios y Seguridad.** Implementación del módulo de autenticación y control de acceso. Los usuarios inician sesión con credenciales seguras y el sistema distingue entre Administrador y Vendedor: los administradores crean, editan y eliminan cuentas; los vendedores acceden únicamente a las funciones de venta y atención al cliente. Esta iteración estableció las bases de seguridad sobre las cuales se construyeron los demás módulos.

**Iteración 2: Gestión de Clientes.** Registro, búsqueda y consulta de clientes. Formularios para datos personales (CI, nombre, teléfono), barra de búsqueda y perfil del cliente que consolida su historial de prescripciones y compras. Se validó midiendo el tiempo de registro y la facilidad para localizar clientes existentes.

**Iteración 3: Gestión de Productos.** Control de inventario. Los administradores registran productos con categoría (monturas, lentes, accesorios), precios y stock mínimo. El sistema muestra el stock actual y genera alertas visuales en el dashboard cuando un producto cae por debajo del mínimo; los vendedores consultan disponibilidad antes de vender.

**Iteración 4: Gestión de Recetas Optométricas.** Registro de prescripciones visuales por cliente con los datos completos de ambos ojos (OD derecho / OS izquierdo): esfera, cilindro, eje y adición. Las recetas quedan asociadas al perfil del cliente y ordenadas por fecha para dar seguimiento a cada paciente.

**Iteración 5: Gestión de Ventas.** El vendedor busca productos y los agrega al carrito; al confirmar la venta, el sistema actualiza automáticamente el stock, calcula el total, registra el método de pago (efectivo o QR) y genera un comprobante consultable posteriormente.

**Iteración 6: Reportes y Dashboard.** Dashboard administrativo con indicadores clave —ventas del día, productos con stock bajo, clientes registrados, actividad reciente— y reportes de ventas por período, productos con mayor rotación y resumen de clientes atendidos. Esta iteración se validó con la administración de la óptica para confirmar la relevancia de la información presentada.
