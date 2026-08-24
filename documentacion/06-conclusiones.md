# VI. CONCLUSIONES Y RECOMENDACIONES

## Conclusiones

El proyecto se propuso diseñar e implementar un sistema de información web para la gestión integral de una óptica de Oruro, y el prototipo entregado responde a ese objetivo con los cuatro objetivos específicos verificados sobre el sistema desplegado.

El diagnóstico inicial (OE1) confirmó que la gestión manual —fichas en papel, Excel disperso, cuadernos de deudas— era la raíz de los problemas: pérdida de información, errores de transcripción y decisiones sin datos. Traducir ese diagnóstico en siete épicas priorizadas resultó clave para no construir de más.

La base de datos (OE2) demostró que un buen modelado es la inversión más rentable del proyecto. Las diez tablas con restricciones CHECK soportaron todos los módulos sin rediseños; decisiones como congelar el precio unitario en cada venta o admitir pagos parciales con saldo, tomadas al dibujar el modelo, evolucionaron sin fricción cuando los requerimientos se afinaron durante las iteraciones.

El desarrollo por iteraciones (OE3), guiado por el ciclo Construir–Medir–Aprender de Lean Startup, cumplió lo prometido: cada módulo llegó funcionando y validado antes de pasar al siguiente. La autenticación JWT con roles desde la primera iteración evitó el clásico parcheo de seguridad a mitad de camino. El stack elegido —React, NestJS, PostgreSQL, TypeScript transversal— mostró madurez y buena documentación; la curva se administró bien y ningún componente obligó a retroceder.

Las pruebas (OE4) cerraron el ciclo: la suite unitaria sobre la lógica crítica de ventas y autenticación, más los casos funcionales y smoke tests, dieron confianza para declarar el MVP operativo. La validación en cuatro niveles (base de datos, backend, frontend e inputs) hizo que los datos malos no llegaran ni al primer commit del flujo.

En síntesis, la tecnología elegida fue correcta y el enfoque ágil aportó valor real: el establecimiento pasó de registrar información a consultarla —y decidir con ella— en cuestión de segundos.

## Recomendaciones

Para la evolución del sistema se sugiere, en orden de valor esperado:

1. **Migrar el pipeline a integración continua** (GitHub Actions): build de imágenes y smoke tests automáticos ante cada cambio; el proyecto ya está preparado, solo hay que trasladar los comandos existentes.
2. **Cifrado en tránsito con HTTPS** en producción, mediante proxy inverso con certificado (Nginx + Let's Encrypt): es el siguiente escalón natural de la estrategia de seguridad descrita en 4.5.
3. **Respaldo programado de la base de datos** (`pg_dump` diario con retención) para consolidar la disponibilidad planteada en el marco teórico.
4. **Módulo de proveedores y compras**, complemento natural del inventario: hoy el stock baja con ventas pero no sube con trazabilidad.
5. **Notificaciones de stock bajo** por correo o mensaje, aprovechando la lógica de alertas ya implementada en el dashboard.
6. **Pasarela de pagos QR** para formalizar digitalmente el cobro, hoy registrado manualmente como método "QR".
7. **Aplicación móvil o PWA** para consulta de órdenes de trabajo fuera del mostrador, reutilizando íntegramente la API existente.

Estas líneas corresponden al *future work* definido en el alcance y no comprometen la estabilidad del MVP actual: cada una puede incorporarse como nueva épica dentro del mismo ciclo Construir–Medir–Aprender.
