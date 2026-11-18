# Respuestas a las consignas "para pensar"

Práctica de endpoints. Las respuestas están en texto, ordenadas por práctica y
listas para pasar al cuestionario del campus.

---

## Práctica 1 — La lista y el detalle

**Pregunta:** ¿Por qué la API no manda todos los datos de todos los usuarios en
la lista y se ahorra el segundo pedido? ¿Qué pasaría con 10.000 usuarios?

**Respuesta:** La lista funciona como un índice: solo necesita lo mínimo para
dibujar la tabla y saber a quién pedirle el detalle. El resto de los datos se pide
recién cuando el usuario hace clic en una fila.

Ese diseño tiene varias ventajas. Se transfiere menos información, porque el
detalle pesa bastante más que el id y el nombre, y multiplicado por cada fila la
diferencia es grande. La respuesta llega y se procesa más rápido, y no se envían
datos que nadie va a mirar: de diez usuarios normalmente se abre uno o dos. Además
se expone menos información sensible en un pedido masivo y la lista queda menos
atada a los cambios del detalle.

El costo es un segundo pedido por cada clic, pero se paga solo cuando hace falta,
en lugar de pagarlo siempre para todos.

Con 10.000 usuarios el problema deja de ser teórico. Mandar todos los campos
sería varios megabytes, con esperas largas en conexiones móviles y un JSON que hay
que procesar entero antes de mostrar la primera fila. A eso se suma que el
navegador tendría que crear 10.000 filas de tabla, lo que vuelve lenta la
interfaz. A esa escala lo correcto es paginar en el servidor (por ejemplo, de a 50
usuarios) y seguir pidiendo el detalle por separado.

---

## Práctica 7 — El botón "Borrar" sin permiso

**Pregunta:** ¿Les parece bien que el botón aparezca igual?

**Respuesta:** No del todo, aunque no es un problema de seguridad. El botón puede
aparecer y la API igual frena el borrado con un error 403, porque la autorización
real la hace el backend. El frontend no puede reemplazar ese control.

El problema es de experiencia: mostrar una acción que el usuario no puede
completar hace que haga clic, confirme y recién ahí descubra que no tenía permiso.
Eso parece un error de la aplicación y no una restricción.

Lo mejor es ocultar o deshabilitar el botón según el rol, que ya se conoce por el
detalle del usuario. Con dos recaudos: esconderlo es solo cosmético, así que el
manejo del 403 debe seguir existiendo como red de seguridad; y los nombres de los
roles son parte del contrato de la API, por lo que un cambio en ellos obliga a
actualizar el frontend.

En resumen: el botón visible con el mensaje de error es aceptable como ejercicio
porque el backend manda, pero una interfaz mejor lo esconde.

---

## Práctica 9 — Contar y pensar el costo del cambio

**Pregunta:** ¿Cuántas veces se repiten las mismas instrucciones? Si el backend
cambia el header del token, ¿cuántos archivos habría que tocar? ¿Y si se olvida
uno?

**Respuesta:** En la versión final de la aplicación los conteos son estos:

| Qué se contó | Veces |
| --- | --- |
| La variable de entorno con la URL de la API | 9 (8 pedidos y 1 declaración de tipos) |
| El header de autorización con el token | 7 |
| La comprobación de que la respuesta sea correcta | 7 |
| Los pares de estado para "cargando" y "error" | 4 pares (8 estados) |
| La comprobación de sesión vencida (401) | 7 |

La misma decisión está escrita muchas veces. Si el backend cambia el header del
token, habría que tocar 4 archivos y 7 lugares. La URL base aparece en 8 pedidos y
la comprobación de 401, en 7 lugares.

Si se olvida uno, no falla al compilar: falla en ejecución, y de las peores formas.
Un pedido sin el header nuevo recibe un 401 y, desde la práctica 8, la aplicación
cierra la sesión y muestra "Tu sesión venció" sin motivo visible: el usuario es
expulsado de una pantalla y cuesta encontrar la causa. Si se olvida la comprobación
de la respuesta, un error se toma como éxito; por ejemplo, un borrado rechazado con
403 y el usuario desaparece de la lista aunque en la base siga existiendo. Si se
olvida la comprobación de 401, esa vista no cierra la sesión y quedan errores
sueltos. Y si se olvida la URL en un solo lugar, ese pedido va a otra dirección y
falla por red o por CORS únicamente en esa parte de la aplicación.

El problema de fondo es la duplicación. La solución es centralizar los pedidos en
un único módulo: una función que arme la dirección, agregue el header del token,
revise si la respuesta es correcta y maneje el 401 en un solo lugar. Así, cambiar
el header pasa a ser un cambio de una línea, y ya no es posible olvidarse de una
comprobación porque está escrita una sola vez.
