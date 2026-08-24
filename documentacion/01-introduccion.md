# I. INTRODUCCIÓN

Hoy es difícil imaginar una organización que funcione sin algún tipo de apoyo tecnológico. La implementación y el uso de un sistema de información se han convertido en un elemento central para optimizar los procesos administrativos y operativos de casi cualquier actividad económica.

En el sector comercial, y en particular en los establecimientos dedicados a la salud visual, la gestión adecuada de la información resulta clave para brindar un servicio eficiente, oportuno y de calidad. El manejo de datos relacionados con historiales optométricos, ventas de lentes, control de inventario y pedidos al laboratorio exige herramientas que permitan organizar y procesar esa información de manera segura y confiable. Sin embargo, muchos establecimientos ópticos todavía realizan sus procesos de forma manual o con herramientas informáticas básicas; con el tiempo esto genera pérdida de información, duplicidad de datos, errores en las recetas, retrasos en la entrega de lentes y dificultad para dar seguimiento a los clientes. Estas limitaciones afectan tanto la atención al cliente como la toma de decisiones administrativas, y evidencian la necesidad de soluciones tecnológicas más eficientes.

Frente a esa situación surge la propuesta de desarrollar un sistema de información web para el establecimiento óptico, orientado a gestionar de manera integral los procesos principales del negocio: registro de clientes, recepción y almacenamiento del historial optométrico proveniente de consultorios externos, gestión del inventario de monturas y lentes, control de ventas y generación de reportes. Al centralizar la información en una sola plataforma se busca mejorar la organización de los datos, reducir errores y agilizar las operaciones diarias.

En este contexto, el presente trabajo describe el desarrollo del **"Sistema de Información Web Fullstack para la Gestión Integral de la Óptica"**, aplicando una metodología ágil como estrategia de desarrollo, con el fin de aportar una solución tecnológica que mejore la gestión de la información del establecimiento.

## 1.1. Contexto del proyecto

Los establecimientos ópticos cumplen un papel importante en la atención de la salud visual: ofrecen productos y servicios destinados a corregir y mejorar problemas de visión. Para funcionar deben administrar gran cantidad de información relacionada con clientes, productos, ventas, inventarios y órdenes de trabajo, por lo que necesitan mecanismos adecuados para manejar esos recursos de manera eficiente y segura.

El establecimiento objeto de estudio es la **Óptica Victoria**, ubicada en la calle José Ignacio León esquina 6 de Octubre, ciudad de Oruro, y dedicada a la venta de lentes oftálmicos, monturas, accesorios ópticos y otros productos para el cuidado visual. Asimismo, recibe recetas e historiales optométricos emitidos por consultorios o especialistas externos, que luego utiliza para la elaboración y adaptación de los lentes solicitados por los clientes. Por la naturaleza de su actividad, la organización requiere mantener un control permanente sobre la información generada cada día.

El problema es que buena parte de sus procesos administrativos se realiza de forma manual, mediante registros dispersos en documentos físicos y herramientas básicas de oficina. Esto dificulta la administración de la información y produce diversos inconvenientes en la operación diaria. El control de inventarios, por ejemplo, se lleva en registros manuales que impiden conocer con exactitud la disponibilidad de productos, ocasionando desabastecimientos o acumulación innecesaria de stock.

El proceso de registro y seguimiento de ventas también presenta dificultades. La falta de automatización limita el seguimiento de las órdenes de trabajo y de las transacciones efectuadas, y complica obtener información actualizada sobre el desempeño comercial. Esta situación repercute directamente en la capacidad de los responsables para tomar decisiones oportunas y fundamentadas.

Ante este panorama, surge la necesidad de integrar y centralizar la información del establecimiento en una única plataforma. El desarrollo de un sistema de información web representa una alternativa viable para optimizar la gestión administrativa, automatizar procesos y mejorar el control de las operaciones.

La propuesta contempla la construcción de un prototipo tecnológico orientado a la gestión de clientes, inventarios, ventas, órdenes de trabajo y reportes administrativos, permitiendo reducir las actividades manuales y mejorar la disponibilidad de información para el personal autorizado. El proyecto se desarrolla bajo los principios de Lean Software Development, metodología que promueve la entrega continua de valor, la eliminación de actividades que no aportan beneficio al usuario y la mejora continua durante todo el proceso de desarrollo.

## 1.2. Justificación técnica y social

### Justificación técnica

Desde el punto de vista técnico, el sistema proporcionará una herramienta moderna y eficiente que integra las áreas necesarias del establecimiento óptico. Actualmente los procesos se realizan de manera convencional —papel y lápiz— con apoyos básicos como Excel, lo que deja al negocio lejos de las posibilidades que ofrece el software actual.

Automatizar el registro y la consulta elimina tareas repetitivas y minimiza errores humanos. El desarrollo aplica principios de ingeniería de software, bases de datos relacionales y metodologías ágiles, buscando un producto funcional, escalable y fácil de mantener. Toda la solución se construye con herramientas de software libre y código abierto, aprovechando al máximo esos recursos para obtener un producto de calidad sin costos de licenciamiento.

De esta manera, el proyecto aporta una solución tecnológica actualizada y adaptable a las necesidades futuras de la empresa.

### Justificación social

En el ámbito social, el proyecto impacta directamente en la calidad del servicio que la óptica brinda a la comunidad. Con un sistema digital eficiente, los clientes reciben una atención más rápida, precisa y personalizada, lo que aumenta su satisfacción y confianza.

El personal también se beneficia: el sistema agiliza los procesos que se repiten todos los días, presenta la información ordenada y precisa, y permite enfocarse en un trato más humano y profesional, reduciendo la carga administrativa y mejorando el desempeño laboral.

A nivel comunitario, el proyecto contribuye a promover la cultura tecnológica en pequeñas y medianas empresas del sector salud, demostrando que la innovación digital puede mejorar la calidad de vida de las personas al garantizar un acceso más eficiente y confiable a los servicios de salud visual.

## 1.3. Objetivos

### Objetivo general

Diseñar e implementar un sistema de información web para la gestión y el control administrativo de la óptica, que permita optimizar y agilizar los procesos comerciales con el fin de integrar y centralizar la información manejada en la óptica.

### Objetivos específicos

1. Determinar los procesos y procedimientos actuales que se manejan en la óptica, con el fin de identificar las principales necesidades y oportunidades de mejora en la gestión de información y control de operaciones.
2. Diseñar una base de datos eficiente y organizada que permita almacenar y gestionar toda la información de la óptica de manera segura, confiable y accesible, facilitando la integración de los módulos del sistema.
3. Desarrollar los módulos del sistema de información siguiendo los requerimientos del establecimiento óptico, implementando las necesidades del usuario de forma clara, directa y adaptativa, mediante iteraciones que permitan ajustes continuos durante el desarrollo.
4. Probar el sistema mediante pruebas exhaustivas que garanticen su funcionamiento acorde a lo esperado, sin problemas y con un rendimiento adecuado.

## 1.4. Alcance del prototipo tecnológico o MVP

El proyecto contempla el desarrollo de un Producto Mínimo Viable (MVP) orientado a resolver los problemas prioritarios identificados en la gestión administrativa de la óptica. El MVP incluye las funcionalidades esenciales para automatizar las actividades principales de la organización y validar la viabilidad de la solución propuesta. El alcance queda definido de forma clara y delimitada, evitando el desborde de funcionalidades que no corresponden a esta fase inicial.

Las épicas críticas definidas para el MVP son siete:

### Épica 1: Gestión de Usuarios y Seguridad

La óptica requiere proteger sus datos, por lo que esta épica controla el acceso al sistema garantizando que cada usuario acceda únicamente a las funcionalidades autorizadas según su rol dentro de la organización.

Historias de usuario:

- Como Administrador, quiero iniciar sesión con usuario y contraseña para acceder de forma segura al sistema.
- Como Administrador, quiero crear usuarios con rol (Administrador, Vendedor) para controlar el acceso según la función de cada empleado.
- Como cualquier rol, quiero cerrar sesión de forma segura para proteger mis credenciales.

### Épica 2: Gestión de Clientes

La óptica necesita mantener un registro organizado de los clientes para agilizar la atención y disponer de información actualizada cuando sea requerida. La funcionalidad almacena datos personales, historial de compras, recetas asociadas y demás información relevante, facilitando la consulta y el seguimiento de cada cliente.

Historias de usuario:

- Como Vendedor, quiero registrar un nuevo cliente con datos básicos (CI, nombre, apellido, teléfono, email) para tenerlo disponible en el sistema.
- Como Vendedor, quiero buscar clientes por nombre, CI o teléfono para atenderlos rápidamente.
- Como cualquier rol autorizado, quiero ver el historial de prescripciones y compras de un cliente.

### Épica 3: Gestión de Productos

Constituye uno de los procesos más importantes del negocio, pues permite controlar la disponibilidad y movimiento de los productos comercializados: monturas, lentes oftálmicos, lentes de contacto, accesorios e insumos relacionados con la salud visual. Cada producto cuenta con código único, categoría, marca, color, precio de compra, precio de venta, stock actual y stock mínimo.

Historias de usuario:

- Como Administrador, quiero registrar productos con código, categoría, nombre, marca, color, precio de compra, precio de venta y stock mínimo.
- Como Vendedor, quiero ver el stock actual de un producto antes de venderlo.
- Como Administrador, quiero recibir una alerta visual de productos con stock por debajo del mínimo establecido en el Dashboard.

### Épica 4: Gestión de Recetas Optométricas

La óptica necesita almacenar y consultar las recetas optométricas emitidas para cada cliente. La funcionalidad registra los datos de las prescripciones visuales, las asocia al historial del cliente y permite consultarlas para la elaboración de lentes o futuras atenciones.

Historias de usuario:

- Como cualquier rol, quiero registrar una nueva prescripción para un cliente con datos completos de ambos ojos (OD/OS): esfera, cilindro, eje, adición y distancia interpupilar.
- Como Vendedor, quiero ver todas las prescripciones anteriores de un cliente ordenadas por fecha.
- Como Vendedor, quiero imprimir la receta óptica en formato PDF para entregarla al cliente.

### Épica 5: Gestión de Ventas

Permite registrar las ventas diarias para llevar un control adecuado de las transacciones comerciales. Incluye el registro de productos vendidos, el cálculo de importes, la generación de comprobantes y el historial de ventas, actualizando automáticamente el stock al concretar cada operación.

Historias de usuario:

- Como Vendedor, quiero buscar productos por nombre o código y agregarlos al carrito de venta.
- Como Vendedor, quiero que al confirmar la venta se actualice automáticamente el stock de los productos vendidos.
- Como Vendedor, quiero ver el total de la venta y registrar el método de pago (efectivo, QR).
- Como Vendedor, quiero imprimir un comprobante de venta en formato PDF para entregarlo al cliente.

### Épica 6: Gestión de Órdenes de Trabajo

Controla el flujo de elaboración de los lentes solicitados por los clientes. Las órdenes de trabajo asocian un cliente, su receta óptica y la venta realizada, llevando seguimiento del estado del trabajo desde su ingreso hasta la entrega final. Cada orden cuenta con estados que facilitan el control del progreso: Pendiente, En Proceso, Listo para Entrega, Entregado y Cancelado.

Historias de usuario:

- Como Vendedor, quiero crear una nueva orden de trabajo asociando un cliente, su receta óptica y la venta realizada.
- Como Vendedor, quiero actualizar el estado de una orden de trabajo (Pendiente, En Proceso, Listo para Entrega, Entregado, Cancelado) para llevar el seguimiento del progreso.
- Como Vendedor, quiero filtrar las órdenes de trabajo por estado para visualizar rápidamente las pendientes.
- Como Vendedor, quiero imprimir la orden de trabajo en formato PDF con los datos del cliente, la receta asociada, la venta y las observaciones del trabajo a realizar.

### Épica 7: Generación de Reportes

La administración necesita información consolidada para evaluar el desempeño del negocio y apoyar la toma de decisiones. Esta épica genera reportes de ventas, productos y clientes, presentando la información de forma clara y organizada.

Historias de usuario:

- Como Administrador, quiero visualizar un dashboard con indicadores clave para monitorear el estado general de la óptica (ventas del día, productos con stock bajo, clientes registrados).
- Como Administrador, quiero generar reportes de ventas por período para analizar el comportamiento comercial.
- Como Administrador, quiero generar reportes de productos para identificar los de mayor rotación y los que presentan stock bajo.
- Como Administrador, quiero exportar los reportes en formato PDF para archivado y análisis.

### Funcionalidades fuera del alcance

Quedan excluidas del MVP actual por no ser prioritarias, aunque podrían considerarse en versiones futuras:

- Módulo de citas médicas y gestión de consultas optométricas en línea.
- Integración con laboratorios externos para envío automático de pedidos de lentes.
- Pasarela de pagos en línea para transacciones digitales.
- Aplicación móvil complementaria para acceso desde smartphones.
- Sistema de notificaciones por correo electrónico para alertas de stock bajo.
- Gestión de categorías de productos desde la interfaz administrativa.
- Módulo de registro de proveedores.
