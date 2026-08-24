# II. MARCO TEÓRICO Y TECNOLÓGICO

## 2.1. Análisis del Stack Tecnológico

El desarrollo del sistema de información web se lleva a cabo con las herramientas propias del software moderno. El stack tecnológico representa el conjunto de tecnologías empleadas para construir la solución: lenguajes de programación, gestores de bases de datos, herramientas de desarrollo, servidores y plataformas de despliegue. La selección adecuada de este stack influye directamente en la calidad, mantenibilidad, escalabilidad y rendimiento del sistema.

El stack seleccionado combina React para el frontend, Node.js y NestJS para el backend, PostgreSQL como gestor de base de datos relacional, y un conjunto de librerías complementarias orientadas al consumo de servicios, la validación de datos, la autenticación, la autorización y la protección de la información. Como lenguaje principal se utiliza TypeScript en todas las capas.

Al elegir las tecnologías se consideraron factores como facilidad de implementación, compatibilidad entre componentes, disponibilidad de documentación, curva de aprendizaje, costos y capacidad de adaptación a futuros requerimientos. Apoyarse en tecnologías ampliamente adoptadas por la industria reduce riesgos durante el desarrollo y facilita el mantenimiento posterior.

### Sistema de información web

> "Un sistema web, también conocido como aplicación web, es un tipo de software que se ejecuta en un servidor remoto y se accede a través de un navegador web. A diferencia de las aplicaciones tradicionales que requieren ser descargadas e instaladas en un dispositivo."

#### Características de un sistema web

Los sistemas web se han convertido en una herramienta fundamental para las organizaciones, ya que permiten administrar información y automatizar procesos mediante una plataforma accesible desde Internet. Sus principales características son las siguientes:

**Accesibilidad.** Un sistema web puede utilizarse desde cualquier lugar con acceso a Internet. Los usuarios autorizados consultan información y realizan sus actividades sin depender de un único equipo o ubicación física.

**Compatibilidad.** Están diseñados para funcionar en los navegadores más utilizados —Chrome, Firefox, Edge o Safari—, de modo que no hace falta instalar programas adicionales y la experiencia resulta uniforme en distintas plataformas.

**Rentabilidad.** Al ejecutarse en un servidor y accederse mediante navegador, disminuyen los costos de implementación, mantenimiento y actualización, ya que las mejoras se aplican de forma centralizada.

**Escalabilidad.** Pueden adaptarse al crecimiento de la organización: a medida que aumentan usuarios, datos o funcionalidades, el sistema se amplía sin rehacer su estructura.

**Seguridad.** Incorporan mecanismos para resguardar los datos frente a accesos no autorizados, garantizar la integridad de la información y mantener la disponibilidad del servicio mediante controles de acceso, autenticación y cifrado.

#### Beneficios de implementar un sistema web

El beneficio más evidente es la mejora de la eficiencia operativa: centralizar la información reduce tareas manuales y agiliza las actividades diarias del personal. También contribuye a una mejor atención, porque facilita el acceso rápido a la información y acorta los tiempos de respuesta.

A ello se suma la posibilidad de generar reportes e indicadores que apoyan la toma de decisiones con información actualizada sobre el funcionamiento de la organización. Y finalmente, los sistemas web ofrecen flexibilidad: permiten incorporar nuevas funcionalidades conforme evolucionan las necesidades de la empresa sin afectar el funcionamiento general de la aplicación.

Entre sus propiedades más relevantes están la posibilidad de ofrecer experiencias personalizadas, actualizar información en tiempo real y conectarse con bases de datos para el almacenamiento y gestión de información. Por todo esto, resultan especialmente útiles para empresas en crecimiento, tiendas virtuales o proveedores de servicios digitales.

### Node.js

> "Node.js se pensó y diseñó para entornos de servidores con un alto grado de concurrencia. El modelo de evaluación que utiliza es de un único hilo de ejecución, apoyándose en un esquema asíncrono de entrada/salida llamado EventLoop."

La programación en Node.js utiliza la sintaxis definida por el estándar ECMAScript, desarrollado por ECMA International, que establece las reglas del lenguaje JavaScript. Node.js trabaja además con una arquitectura orientada a eventos que le permite gestionar varias tareas de forma eficiente, y para ejecutar el código emplea el motor V8 creado por Google, reconocido por su rendimiento.

> "En la actualidad, Node.js cuenta con un gran número de módulos y componentes orientados y optimizados para networking (redes), que sirven de soporte para el manejo de los estándares y protocolos más populares de Internet, como DNS, HTTP, TCP, TLS/SSL y UDP."

Cuando se habla de Node.js suele asociárselo con la capa de servicios de aplicaciones orientadas a Internet, aunque va mucho más allá de ser un simple servidor web.

> "En comparación con otra plataforma, Node.js tiene un flujo de trabajo particular. Funciona como un único proceso, lo que significa que no crea un nuevo hilo para cada petición."

Su arquitectura está formada por diversos componentes, bibliotecas y estándares que trabajan en conjunto; buena parte del proceso ocurre de forma transparente para el desarrollador, aunque el comportamiento interno depende del sistema operativo sobre el cual se ejecute.

### NestJS

> "Nest (NestJS) es un framework para construir aplicaciones eficientes y escalables Node.js del lado del servidor. Utiliza JavaScript progresivo, está construido con y soporta completamente TypeScript y combina elementos de POO, FP y FRP."

Node.js impulsó el uso de JavaScript más allá del navegador, permitiendo el mismo lenguaje tanto en frontend como en backend. De esa convergencia surgieron tecnologías como Angular, React y Vue, que facilitan interfaces modernas, rápidas y mantenibles.

Pese a la abundancia de bibliotecas para el lado del servidor, muchas resuelven problemas puntuales sin ofrecer una estructura completa para aplicaciones grandes. Ahí aparece NestJS: proporciona una arquitectura bien definida para construir sistemas escalables, modulares y con bajo acoplamiento, lo que facilita su evolución a medida que el proyecto crece. Su diseño toma como referencia la arquitectura de Angular e incorpora principios que favorecen la organización del código.

Para el sistema de la óptica se implementaron nueve módulos funcionales. El módulo de autenticación maneja el login, la generación de tokens JWT y la validación de credenciales. El módulo de usuarios cubre el CRUD completo con paginación, búsqueda y control de acceso por roles. Los módulos de clientes, categorías y productos gestionan las operaciones CRUD de sus respectivas entidades. El módulo de recetas registra prescripciones ópticas con los datos específicos de ambos ojos. El módulo de ventas crea transacciones con lógica de negocio que incluye validación de stock, descuento automático de inventario y generación de comprobantes. El módulo de órdenes de trabajo administra el flujo de pedidos según sus estados (Pendiente, En Proceso, Listo para Entrega, Entregado), y el módulo dashboard entrega estadísticas agregadas: ingresos totales, ventas del día, productos con stock bajo y órdenes pendientes.

### TypeScript

> "TypeScript es un superset de JavaScript que introduce tipado estático, herramientas avanzadas para el desarrollo y una mejor estructuración del código. Esto permite a los desarrolladores de programación detectar errores antes de ejecutar el código y mejorar la colaboración en equipos de desarrollo."

TypeScript amplía JavaScript incorporando herramientas que mejoran organización y confiabilidad del código. Al ser un superset, todo programa JavaScript válido funciona también como TypeScript, con ventajas como tipado estático, interfaces y una programación orientada a objetos más completa.

Siendo un proyecto de código abierto, ha sido adoptado ampliamente por desarrolladores y empresas que buscan software robusto y fácil de mantener. Su fortaleza principal es detectar errores durante el desarrollo, antes de que la aplicación llegue a producción, lo cual reduce fallos en proyectos grandes. El código TypeScript se transforma después en JavaScript estándar, ejecutable en cualquier entorno compatible: navegador, servidor o móvil.

#### Diferencias con JavaScript

**Tipado estático.** En JavaScript el tipo de una variable puede cambiar durante la ejecución; TypeScript permite declararlo anticipadamente, lo que detecta errores temprano y disminuye fallos.

**Mayor capacidad para proyectos grandes.** JavaScript basta para aplicaciones pequeñas; TypeScript ofrece interfaces, clases y módulos que mantienen el código ordenado cuando el proyecto crece.

**Mejor soporte durante el desarrollo.** Autocompletado inteligente, detección de errores previa a la ejecución y refactorizaciones seguras agilizan el trabajo del programador.

**Compatibilidad con nuevas versiones de ECMAScript.** Permite usar características recientes y compilarlas a JavaScript compatible con distintos navegadores y entornos.

En este proyecto TypeScript se emplea de forma transversal. En el backend, todas las entidades de base de datos, los servicios de negocio, los controladores HTTP y los DTOs (*Data Transfer Objects*) se definen con TypeScript, precisando la estructura y relaciones de los datos entre capas. En el frontend ocurre lo mismo con los componentes de interfaz, los servicios de comunicación con la API, los tipos de respuesta del servidor y los esquemas de validación de formularios. Esta disciplina resulta valiosa en módulos como ventas e inventario, donde se manipulan múltiples entidades relacionadas simultáneamente —un cliente, varios productos con precios distintos, una receta asociada, un método de pago— y donde un error de tipo podría pasar desapercibido hasta que un usuario intenta una operación real.

### React

> "Con React, puede crear componentes reutilizables y administrar fácilmente el estado de su aplicación. Además, utiliza un DOM virtual que agiliza las actualizaciones y mejora el rendimiento general."

Antes de las interfaces basadas en componentes, las redes sociales ofrecían experiencias simples y con poca interacción. Con el tiempo las necesidades crecieron y las interfaces incorporaron funciones cada vez más dinámicas, evidenciando la necesidad de herramientas que facilitaran el desarrollo web sin incrementar excesivamente la complejidad. Facebook creó React para organizar mejor su interfaz mediante componentes reutilizables y mejorar rendimiento y experiencia visual.

Aunque oficialmente React sigue siendo una biblioteca de JavaScript, en la práctica muchos lo consideran un framework, ya que junto con su ecosistema permite construir aplicaciones completas bajo una estructura organizada y buenas prácticas.

Dentro del sistema de la óptica, React se encarga de toda la capa de presentación. Cada módulo funcional —inicio de sesión, panel de administración, gestión de usuarios, clientes, inventario, recetas, ventas, órdenes de trabajo y reportes— se implementa como un conjunto de componentes independientes y reutilizables. El módulo de ventas, por ejemplo, comprende el listado de transacciones, el formulario de registro, el carrito de productos y la generación del comprobante PDF. Esta arquitectura por componentes permite desarrollar, probar y mantener cada pieza de forma aislada, reduciendo el riesgo de que un cambio afecte a otro módulo.

### Vite

> "Vite es una herramienta moderna de desarrollo frontend. Su función no es reemplazar a React, sino crear y ejecutar un entorno adecuado para desarrollar aplicaciones modernas. La documentación oficial de React recomienda usar una herramienta de construcción como Vite."

React no suele utilizarse simplemente agregando un archivo JavaScript al final de un documento HTML; eso queda para proyectos sencillos. El desarrollo profesional requiere un entorno que facilite organizar el código en módulos, trabajar con JSX, gestionar dependencias, ejecutar un servidor local y generar una versión optimizada para producción.

Vite destaca por la rapidez con que refleja los cambios del código, sin recompilar toda la aplicación, lo que agiliza el desarrollo. Su configuración inicial es sencilla y fácil de adaptar. Durante el desarrollo actualiza la aplicación automáticamente ante cada cambio, conservando siempre que es posible el estado de la misma, algo apreciable en proyectos grandes donde reiniciar constantemente afecta el ritmo de trabajo. Y mantiene buen rendimiento aun con muchos módulos, sirviendo tanto a proyectos pequeños como complejos.

En este proyecto Vite cumple dos tareas fundamentales: en desarrollo, provee el servidor con actualización en tiempo real, proxy inverso hacia la API del backend y soporte nativo para TypeScript y CSS; en producción, genera la versión optimizada del frontend con archivos estáticos comprimidos, hash de *cache-busting* y división automática de código.

### Tailwind CSS

> "Tailwind CSS ha transformado la manera en que muchos desarrolladores construyen sus interfaces. En lugar de crear archivos CSS personalizados o sobrescribir estilos ya listos, propone un enfoque en el que todo se hace a través de clases utilitarias reutilizables."

Entre sus ventajas está aplicar estilos directamente desde el marcado HTML, sin alternar constantemente entre archivos. Facilita mantener un diseño uniforme en toda la aplicación y ofrece alta personalización mediante su archivo de configuración: paleta de colores, temas visuales y puntos de interrupción para diseño adaptable. Incluye utilidades responsivas predefinidas y es compatible con frameworks como React, Vue, Angular y Next.js. Gracias a su compilación *Just-In-Time* (JIT), solo las clases realmente utilizadas llegan a la versión final, reduciendo el tamaño de los archivos generados.

> "A diferencia de frameworks como Bootstrap, que imponen componentes predefinidos, Tailwind adopta un enfoque utility-first que permite construir diseños complejos directamente desde el marcado HTML o JSX, eliminando la necesidad de escribir CSS personalizado en la mayoría de los casos."

Para la interfaz del sistema, Tailwind estiliza todos los módulos: el sidebar de navegación fijo a la izquierda, los formularios modales de registro y edición, las tablas con paginación y búsqueda, las tarjetas de estadísticas del dashboard, los formularios de recetas con campos para ambos ojos (OD/OS), los carritos de venta y los paneles de reportes. La consistencia visual se logra con una paleta de colores predefinida y clases reutilizables repetidas a lo largo de toda la aplicación.

### Axios

> "Axios es una librería escrita en JavaScript que nos permite realizar peticiones HTTP de manera sencilla, rápida y eficiente, tanto en el navegador como en aplicaciones de Node.js. Su principal característica es que está basada en promesas (Promises)."

Axios establece la comunicación entre una aplicación y servicios web o APIs REST: envía y recibe información entre cliente y servidor trabajando con formatos como JSON, XML o texto plano. Soporta solicitudes GET, POST, PUT y DELETE, facilita procesar respuestas y ordena el manejo de errores y estados de la solicitud. Por su sintaxis simple y fácil integración con React, es una de las bibliotecas más usadas para consumir servicios web.

> "Para desarrollar aplicaciones web, el intercambio de datos entre el cliente y el servidor es una tarea fundamental. Para simplificar este proceso, existen numerosas herramientas y librerías que nos facilitan nuestra labor, entre ellas, Axios."

En el sistema de la óptica, Axios se configuró con dos interceptores. El primero, de petición, lee el token JWT almacenado en el navegador y lo agrega automáticamente al encabezado `Authorization` de cada solicitud hacia el backend; los componentes no necesitan incluir el token manualmente, pues la lógica de autenticación queda centralizada. El segundo, de respuesta, vigila las respuestas del servidor y, al detectar un estado 401 (No Autorizado), limpia el token almacenado y redirige al login. Este patrón gestiona de forma centralizada la expiración de sesiones sin verificar el token en cada componente.

### PostgreSQL

> "Los sistemas de mantenimiento de Bases de Datos relacionales tradicionales (DBMS) soportan un modelo de datos que consisten en una colección de relaciones con nombre, que contienen atributos de un tipo específico."

Los DBMS relacionales tradicionales trabajan con tablas organizadas mediante atributos de tipos específicos: enteros, decimales, cadenas, montos monetarios y fechas. El modelo lleva décadas usándose por su simplicidad, pero las aplicaciones modernas plantearon necesidades que no siempre cubría de forma eficiente.

PostgreSQL extiende el modelo relacional con funcionalidades adicionales que permiten soluciones más completas y flexibles, manteniendo la consistencia e integridad de la información.

> "Es un sistema de gestión de bases de datos relacional (RDBMS) avanzado y de código abierto, reconocido por su estabilidad, su extensibilidad y su cumplimiento de los estándares SQL."

La base de datos `optica_db` implementa 10 tablas relacionales. La tabla `roles` define los tipos de usuario (Administrador y Vendedor). `usuarios` almacena credenciales y datos de cada usuario con clave foránea hacia roles. `clientes` registra los datos personales —cédula de identidad, nombre, teléfono, correo—. `recetas` guarda las prescripciones ópticas con mediciones por ojo: esfera, cilindro, eje, adición (ADD) y distancia pupilar (DP), tanto para ojo derecho (OD) como izquierdo (OS). Las tablas `categorias` y `productos` gestionan el inventario vinculando cada producto con su categoría. `ventas` registra cada transacción comercial y `detalle_venta` desglosa los productos incluidos con cantidad y precio unitario. `orden_trabajo` administra los pedidos de elaboración de lentes y `recibos` genera los comprobantes asociados a cada venta.

## 2.2. Arquitectura de Software

> "La arquitectura de software de un programa o sistema de cómputo es la estructura o estructuras del sistema que comprenden elementos de software, las propiedades visibles externamente de esos elementos y las relaciones entre ellos."

Como el término *estructura* también se usa en diseño de software con otro matiz, conviene aclarar la diferencia. En ese contexto, estructura equivale a vista: una representación de un conjunto de elementos arquitectónicos y sus relaciones, es decir, un documento que describe parte de la arquitectura. En cambio, en arquitectura de software, estructura designa el conjunto real de elementos y relaciones del sistema, en código o en ejecución. La distinción parece sutil pero importa: la estructura es cómo está organizado realmente el sistema; la vista, la documentación que lo describe. Por eso la arquitectura se entiende como el conjunto de estructuras del sistema, y dicho conjunto no siempre coincide exactamente con la documentación elaborada.

Arquitectura tampoco equivale a diseño. El diseño se concentra en construir y organizar los componentes en detalle; la arquitectura aborda una visión más amplia del sistema y de cómo interactúan sus partes.

Antes de analizar la relación entre arquitectura y entorno conviene introducir el concepto de *interesado*: cualquier persona u organización con participación, responsabilidad o interés en el sistema —programadores, administradores, personal de pruebas, usuarios finales, propietarios, organizaciones externas relacionadas e incluso financiadores—. Identificar correctamente a los interesados es fundamental, porque sus necesidades y expectativas condicionan los requerimientos y decisiones de diseño. Esa identificación forma parte de las actividades iniciales de la ingeniería de requerimientos, y analistas y arquitectos deben interactuar con ellos para validar distintos aspectos del sistema. Omitir a un interesado relevante en las primeras etapas puede generar problemas graves más adelante.

### Abstracción de la solución

Para este proyecto se seleccionó una arquitectura basada en capas combinada con el patrón cliente-servidor. La decisión se fundamenta en la necesidad de separar responsabilidades con claridad, independizar los componentes y facilitar el mantenimiento en el tiempo.

> "La arquitectura en capas es una de las más utilizadas, no solo por su simplicidad, sino porque también es utilizada por defecto cuando no estamos seguros qué arquitectura debemos utilizar para nuestra aplicación."

La arquitectura en capas organiza la aplicación en niveles, cada uno con una función específica, comunicados únicamente con la capa inmediatamente inferior. Las solicitudes y respuestas siguen un flujo ordenado: cuando la capa de presentación necesita datos, envía la solicitud a la capa de negocio; esta procesa la petición y la transmite a la persistencia, encargada de dialogar con la base de datos; la respuesta regresa por el mismo camino hasta presentarse al usuario.

Cada capa funciona de manera independiente: pueden desarrollarse, actualizarse o desplegarse por separado. En aplicaciones grandes es común que las capas corran incluso en servidores diferentes, manteniendo la comunicación sin afectar el sistema.

La finalidad de esta organización es el principio de separación de responsabilidades. La presentación atiende la interfaz y la interacción sin conocer el procesamiento interno; el negocio implementa reglas, validaciones y procesos propios de la aplicación; la persistencia administra el acceso a los datos ejecutando operaciones de consulta, registro, actualización o eliminación. Cada componente queda con una responsabilidad bien definida, facilitando mantenimiento, reutilización y crecimiento.

Conviene respetar la comunicación entre capas y evitar accesos directos que omitan niveles. Técnicamente es posible hacerlo, pero rompe la organización arquitectónica y complica el mantenimiento: con el tiempo surge el llamado *código espagueti*, con dependencias enredadas y modificaciones cada vez más complejas y propensas a errores.

La abstracción de la solución contempla tres capas principales:

1. **Capa de Presentación (Frontend):** construida con React y TypeScript; renderiza las interfaces, gestiona el estado de la aplicación y se comunica con el backend mediante peticiones HTTP.
2. **Capa de Lógica de Negocio (Backend):** desarrollada con NestJS y TypeScript; procesa solicitudes, aplica reglas de negocio, valida información y orquesta las operaciones sobre los datos.
3. **Capa de Persistencia (Base de datos):** implementada con TypeORM y PostgreSQL; almacena, recupera y mantiene la integridad de la información.

Esta separación permite desarrollar, mantener y actualizar cada componente de forma independiente, reduciendo complejidad y facilitando futuras ampliaciones.

### Arquitectura cliente-servidor

> "Este modelo es uno de los principales usados en muchísimos servicios y protocolos de Internet, por lo que para todos aquellos que quieren aprender más sobre la web y cómo funciona, entender el concepto de modelo cliente servidor se vuelve algo indispensable."

El modelo cliente-servidor se basa en la interacción entre dos elementos: el cliente, que solicita un servicio o información, y el servidor, que procesa la solicitud y devuelve la respuesta. Generalmente el servidor dispone de mayores recursos, pues administra la información, ejecuta la lógica de la aplicación y gestiona el acceso a la base de datos.

El modelo se emplea en gran variedad de sistemas porque organiza la comunicación entre dispositivos mediante protocolos que garantizan el intercambio correcto de la información y su almacenamiento seguro. Internet es el ejemplo representativo: al visitar una página, el dispositivo actúa como cliente, envía una solicitud, y el servidor procesa la petición, obtiene los datos y los devuelve al navegador en cuestión de segundos, de forma transparente para el usuario.

Su gran ventaja es que un mismo servidor atiende solicitudes de múltiples clientes simultáneamente, permitiendo el uso concurrente de la aplicación sin degradaciones significativas.

Adoptar esta arquitectura responde a la necesidad de separar la interfaz de usuario de la lógica de negocio. Cada componente se desarrolla, mantiene y actualiza por separado: si mañana se rediseña por completo la interfaz, los cambios ocurren en el frontend sin tocar la lógica del servidor.

Otro aspecto clave es la centralización de la información. Una óptica maneja datos de clientes, productos, inventarios y ventas que deben permanecer consistentes y actualizados; el modelo cliente-servidor los almacena en un repositorio único, evitando duplicidades y garantizando que todos trabajen con la misma información en tiempo real.

## 2.3. Estándares de seguridad

### Seguridad informática

> "La seguridad informática implica la creación y aplicación de políticas y normativas internas que regulan el uso responsable de la información y los recursos tecnológicos, todo esto adaptándose a los cambios constantes del entorno digital."

El crecimiento de los ciberataques convirtió la seguridad informática en un aspecto fundamental para cualquier organización que gestione información digital. Un incidente puede provocar pérdidas económicas, interrupción de operaciones, daño reputacional y exposición de información confidencial.

Entre las amenazas más relevantes están los ataques de *ransomware*, donde los ciberdelincuentes bloquean el acceso a los datos y exigen un pago para restituirlos; frecuentemente amenazan además con divulgar la información si no se cumplen sus exigencias, ampliando el impacto del incidente.

Por estos riesgos, las organizaciones han incrementado su inversión en seguridad para proteger sistemas y reducir la probabilidad de ataques que comprometan la disponibilidad, integridad y confidencialidad de la información. Las medidas preventivas son hoy indispensables para garantizar la continuidad operativa y resguardar los datos de usuarios y empresas.

### Principios fundamentales de seguridad

> "Los pilares de la información se fundamentan en la necesidad que los datos sean confiables, íntegros y estén disponibles para obtener el máximo rendimiento con un mínimo de riesgo."

La información es uno de los recursos más valiosos de una organización, base de sus decisiones. Si llega a manos no autorizadas pierde valor estratégico y puede afectar operaciones, reputación y privacidad de las personas.

Por eso la gestión de seguridad debe considerar principios que protejan la información frente a diversas amenazas: la **confidencialidad**, que limita el acceso a usuarios autorizados; la **integridad**, que garantiza datos correctos y no alterados indebidamente; y la **disponibilidad**, que asegura que información y servicios puedan utilizarse cuando se requieran.

#### Confidencialidad

Principio que garantiza que la información solo sea accedida, consultada o utilizada por personas, procesos o sistemas autorizados. Protege datos sensibles frente a accesos indebidos que comprometan la privacidad de los usuarios o información estratégica.

Preservarla exige mecanismos como autenticación, control de accesos, cifrado y gestión adecuada de permisos. En el sistema de la óptica, la confidencialidad se garantiza mediante credenciales de acceso, roles de usuario (Administrador y Vendedor) y restricciones de permisos que limitan el acceso según las funciones asignadas.

#### Integridad

Capacidad de mantener exactitud, consistencia y confiabilidad de la información a lo largo de su ciclo de vida, asegurando que los datos no sean alterados accidental o intencionalmente por personas no autorizadas. Su pérdida provoca errores operativos, inconsistencias y decisiones basadas en datos incorrectos.

Las medidas incluyen validaciones de datos, restricciones de base de datos, registros de auditoría y controles de acceso. En el proyecto, la integridad se protege con validaciones tanto en frontend como backend, además de restricciones relacionales definidas en PostgreSQL y gestionadas mediante TypeORM.

#### Disponibilidad

Principio que garantiza que sistemas, servicios y datos estén accesibles cuando los usuarios autorizados los requieran. Un sistema puede tener sólidos mecanismos de confidencialidad e integridad, pero si la información no está disponible cuando se necesita, su utilidad cae considerablemente.

Se refuerza con respaldos de información, redundancia de recursos, monitoreo de servicios y mecanismos de recuperación ante fallos. En este proyecto, la disponibilidad se fortalece con el almacenamiento centralizado en PostgreSQL y procedimientos de respaldo para recuperar datos ante incidentes.

### Autenticación y Autorización

#### Autenticación de Usuarios

Proceso mediante el cual el sistema verifica la identidad de una persona antes de concederle acceso a recursos protegidos. Constituye la primera línea de defensa: distingue usuarios autorizados de accesos ilegítimos.

Su objetivo es que únicamente personas debidamente identificadas utilicen el sistema, típicamente verificando credenciales compuestas por usuario y contraseña. En el sistema de la óptica, la autenticación se gestiona en la API REST desarrollada con NestJS: las credenciales se verifican antes de habilitar cualquier funcionalidad, y las contraseñas se almacenan con técnicas de *hashing* (bcrypt) para que nunca queden expuestas en texto plano dentro de la base de datos.

#### Autorización y Control de Acceso

Mientras la autenticación responde "¿quién es el usuario?", la autorización determina qué puede hacer una vez autenticado. Uno de los enfoques habituales es el Control de Acceso Basado en Roles (*Role-Based Access Control*, RBAC), que asigna permisos específicos a cada tipo de usuario. El proyecto implementa dos roles:

- **Rol Administrador:** acceso total a todas las funcionalidades —gestión de usuarios, clientes, inventarios, ventas, recetas y reportes—.
- **Rol Vendedor:** acceso limitado a atención al cliente, registro de ventas, consulta de inventario y registro de recetas, sin gestión de usuarios ni reportes administrativos.

Cada usuario accede únicamente a lo necesario para sus tareas, aplicando el principio de mínimo privilegio y fortaleciendo la seguridad general del sistema.

### Consideraciones Éticas y Legales

El manejo de información personal exige cumplir normativas y principios éticos que protejan la privacidad. Para este proyecto se consideraron las siguientes disposiciones:

**Protección de Datos Personales.** El sistema almacena datos personales de clientes —cédula de identidad, nombre completo, teléfono, correo electrónico—. Estos deben tratarse con confidencialidad y usarse exclusivamente para los fines de su recopilación: la prestación de servicios ópticos.

**Principio de Minimización.** Se recopilan y almacenan únicamente los datos estrictamente necesarios para el funcionamiento de cada módulo; nada que no sea relevante para la gestión de clientes, ventas, inventarios o recetas.

**Acceso Restringido.** La información personal de clientes solo es accesible por personal autorizado que la requiera para sus funciones. El control por roles garantiza que cada usuario consulte y modifique únicamente lo correspondiente a sus responsabilidades.

**Principio de Consentimiento.** El manejo de datos se realiza bajo el supuesto de que los clientes proporcionan su información voluntariamente para recibir el servicio, siendo la óptica responsable de usarla de manera ética y conforme a la normativa vigente.
