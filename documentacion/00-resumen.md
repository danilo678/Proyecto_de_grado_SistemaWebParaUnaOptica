# RESUMEN

El presente trabajo describe el diseño, desarrollo y validación de un sistema de información web para la gestión integral de la Óptica Victoria, establecimiento dedicado a la salud visual ubicado en la calle José Ignacio León esquina 6 de Octubre, ciudad de Oruro. El negocio conducía sus operaciones principales —registro de clientes, control de inventario, ventas y seguimiento de órdenes de trabajo— mediante registros en papel y hojas de cálculo, lo que provocaba pérdida de información, errores en las recetas ópticas y retrasos en la entrega de los lentes.

La solución se planteó como un prototipo tecnológico (Producto Mínimo Viable) construido bajo los principios de Lean Startup, con iteraciones cortas orientadas a entregar valor desde la primera versión. El sistema sigue una arquitectura cliente-servidor organizada en capas: el frontend se desarrolló con React 19 y TypeScript, el backend con NestJS exponiendo una API REST documentada con Swagger, y los datos persisten en PostgreSQL 16 a través de TypeORM. La autenticación utiliza tokens JWT con control de acceso basado en roles (Administrador y Vendedor), y cada venta genera automáticamente su recibo descargable en formato PDF.

Los resultados obtenidos muestran que el prototipo centraliza la información del negocio, reduce las tareas manuales y facilita el control del stock y de los pedidos de lentes hacia el laboratorio. Las pruebas funcionales y unitarias aplicadas sobre los módulos críticos confirman un comportamiento acorde a lo esperado, con lo cual se cumplen los objetivos específicos definidos al inicio del proyecto.

**Palabras clave:** sistema de información web, óptica, Lean Startup, NestJS, React, PostgreSQL, MVP.
