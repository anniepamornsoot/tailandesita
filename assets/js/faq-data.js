// FAQ dataset for Tailandesita Travel Co., Ltd.
// Each item: id, categoria, pregunta, respuesta (HTML), respuestaWhatsApp (texto plano para copiar)
window.TAILANDESITA_FAQ = [
  // ------------- RESERVA Y PAGO -------------
  {
    id: "visado",
    categoria: "reserva",
    pregunta: "¿Necesito visado para viajar a Tailandia?",
    respuesta:
      "<p>Depende de tu nacionalidad. Los ciudadanos de <strong>España, México, Argentina, Colombia, Chile, Perú y la mayoría de países latinoamericanos</strong> pueden entrar sin visado como turistas por hasta 60 días (desde julio 2024). Solo necesitas:</p>" +
      "<ul><li>Pasaporte con al menos 6 meses de validez</li><li>Billete de salida del país</li><li>Justificante de alojamiento (nosotros te enviamos una carta de invitación con tu reserva)</li></ul>" +
      "<p>Si viajas desde otro país o por más de 60 días, escríbeme y te lo confirmo caso por caso.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Te paso la info sobre el visado para Tailandia:\n\n" +
      "Si tienes pasaporte de España, México, Argentina, Colombia, Chile, Perú o la mayoría de países latinoamericanos, NO necesitas visado para estancias turísticas de hasta 60 días (exención en vigor desde julio 2024).\n\n" +
      "Lo único que necesitas:\n" +
      "• Pasaporte con mínimo 6 meses de validez\n" +
      "• Billete de salida del país\n" +
      "• Justificante de alojamiento (te envío una carta de invitación con tu reserva)\n\n" +
      "Si es otro pasaporte o viajas más de 60 días, dime y lo confirmo contigo.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "que-incluye",
    categoria: "reserva",
    pregunta: "¿Qué incluye el precio del tour?",
    respuesta:
      "<p>Todos nuestros tours incluyen, salvo que se indique lo contrario:</p>" +
      "<ul><li>Alojamiento en hoteles de 3–4★ seleccionados personalmente</li><li>Traslados privados entre destinos y desde el aeropuerto</li><li>Guía en español para todas las actividades</li><li>Entradas a templos, parques y actividades del programa</li><li>Desayunos + una comida típica por destino</li><li>Soporte 24/7 por WhatsApp durante todo el viaje</li></ul>" +
      "<p><strong>No incluye:</strong> vuelos internacionales, comidas no especificadas, seguro de viaje y propinas.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Estos son los servicios que incluyen todos mis tours:\n\n" +
      "✅ INCLUIDO:\n" +
      "• Alojamiento 3–4★ seleccionado personalmente\n" +
      "• Traslados privados entre destinos y aeropuerto\n" +
      "• Guía en español en todas las actividades\n" +
      "• Entradas a templos, parques y actividades\n" +
      "• Desayunos + una comida típica por destino\n" +
      "• Soporte 24/7 por WhatsApp durante tu viaje\n\n" +
      "❌ NO incluido:\n" +
      "• Vuelos internacionales\n" +
      "• Comidas no especificadas\n" +
      "• Seguro de viaje\n" +
      "• Propinas\n\n" +
      "¿Quieres que te prepare una propuesta? Un abrazo, Esmeranda 🌞"
  },
  {
    id: "cancelacion",
    categoria: "reserva",
    pregunta: "¿Cuál es la política de cancelación?",
    respuesta:
      "<p>Queremos que reserves con tranquilidad. Nuestra política es:</p>" +
      "<ul><li><strong>Más de 45 días antes:</strong> reembolso del 90% (retenemos solo gestión bancaria).</li><li><strong>Entre 45 y 21 días:</strong> reembolso del 50%.</li><li><strong>Menos de 21 días:</strong> sin reembolso, pero la reserva puede aplazarse 12 meses.</li></ul>" +
      "<p>Si cancelas por motivos médicos justificados, hacemos todo lo posible para aplazarte sin coste.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Te paso mi política de cancelación para que reserves con tranquilidad:\n\n" +
      "• Más de 45 días antes del viaje → reembolso del 90%\n" +
      "• Entre 45 y 21 días → reembolso del 50%\n" +
      "• Menos de 21 días → sin reembolso, pero aplazable 12 meses\n\n" +
      "Si tienes una emergencia médica con justificante, intento aplazarte sin coste. Somos flexibles cuando hace falta.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "pago",
    categoria: "reserva",
    pregunta: "¿Cómo y cuándo se paga el tour?",
    respuesta:
      "<p>Reservamos tu viaje con un <strong>30% de señal</strong> al confirmar y el <strong>70% restante 30 días antes de viajar</strong>. Aceptamos:</p>" +
      "<ul><li>Transferencia bancaria (Europa / Latinoamérica)</li><li>Tarjeta de crédito o débito (+3% por comisión)</li><li>PayPal o Wise</li></ul>" +
      "<p>Para grupos o viajes de más de 10 días podemos acordar hasta 3 cuotas.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 El pago del tour funciona así:\n\n" +
      "• 30% de señal al confirmar la reserva\n" +
      "• 70% restante 30 días antes del viaje\n\n" +
      "Métodos aceptados:\n" +
      "• Transferencia bancaria (Europa / Latam)\n" +
      "• Tarjeta (+3% comisión)\n" +
      "• PayPal o Wise\n\n" +
      "Para grupos o viajes largos puedo dividirlo hasta en 3 cuotas. Dime qué te va mejor.\n\nUn abrazo, Esmeranda 🌞"
  },

  // ------------- DURANTE EL VIAJE -------------
  {
    id: "mejor-epoca",
    categoria: "viaje",
    pregunta: "¿Cuál es la mejor época para viajar a Tailandia?",
    respuesta:
      "<p>La temporada más cómoda es <strong>de noviembre a febrero</strong>: temperaturas suaves (25–30°C), poca lluvia y cielos despejados. Es también la más turística.</p>" +
      "<p><strong>Marzo a mayo:</strong> mucho calor (35°C+), pero precios más bajos y menos gente.<br/>" +
      "<strong>Junio a octubre:</strong> temporada de monzón. Llueve fuerte pero corto, y el país se ve más verde que nunca. Perfecto para viajeros flexibles.</p>" +
      "<p>Yo disfruto Tailandia todo el año — solo hay que adaptar el itinerario a la estación.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre la mejor época para Tailandia:\n\n" +
      "🌤️ NOV–FEB: la más cómoda (25–30°C, poca lluvia, cielos despejados). Es la más turística.\n\n" +
      "🔥 MAR–MAY: mucho calor (35°C+), menos gente y precios más bajos.\n\n" +
      "🌧️ JUN–OCT: monzón, llueve fuerte pero corto. Todo está verde y precioso, ideal para viajeros flexibles.\n\n" +
      "Cualquier época puede ser perfecta — solo hay que adaptar el itinerario. Dime tus fechas y te digo qué esperar.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "que-llevar",
    categoria: "viaje",
    pregunta: "¿Qué ropa debo llevar?",
    respuesta:
      "<p>Ropa ligera, transpirable y de colores claros. Recomiendo:</p>" +
      "<ul><li>Camisetas de algodón o lino (3–5)</li><li>Un pantalón largo ligero + shorts</li><li>Un pareo o foulard para cubrirte en templos</li><li>Sandalias cómodas + zapatillas para andar</li><li>Bañador, gafas de sol y sombrero</li><li>Chubasquero fino (en temporada de lluvias)</li><li>Un jersey ligero (para el aire acondicionado — es brutal)</li></ul>" +
      "<p>Para templos: hombros y rodillas cubiertos. Es obligatorio.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Qué meter en la maleta para Tailandia:\n\n" +
      "Ropa ligera, transpirable, colores claros.\n\n" +
      "• 3–5 camisetas de algodón o lino\n" +
      "• 1 pantalón largo ligero + shorts\n" +
      "• Pareo o foulard (para cubrirte en templos)\n" +
      "• Sandalias cómodas + zapatillas\n" +
      "• Bañador, gafas de sol, sombrero\n" +
      "• Chubasquero fino si viajas en temporada de lluvias\n" +
      "• Un jersey ligero (¡el aire acondicionado es polar!)\n\n" +
      "⚠️ Importante: para templos necesitas hombros y rodillas cubiertos.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "seguridad",
    categoria: "viaje",
    pregunta: "¿Es seguro viajar a Tailandia?",
    respuesta:
      "<p>Sí, Tailandia es uno de los destinos más seguros del sudeste asiático. Llevo más de 10 años viviendo aquí y me muevo sola sin problema.</p>" +
      "<p>Precauciones normales de cualquier país:</p>" +
      "<ul><li>Cuidado con el bolso en zonas muy turísticas de Bangkok</li><li>Evita los taxis sin taxímetro — siempre pide el “meter”</li><li>No aceptes ofertas de desconocidos para llevarte a templos/tiendas</li><li>En playas, cuidado con las corrientes en temporada de monzón</li></ul>" +
      "<p>Todos nuestros tours tienen soporte 24/7 por WhatsApp. Si pasa algo, me tienes a un mensaje.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre seguridad en Tailandia:\n\n" +
      "Sí, es uno de los países más seguros del sudeste asiático. Llevo más de 10 años viviendo aquí y me muevo sola sin problema.\n\n" +
      "Precauciones normales:\n" +
      "• Cuidado con el bolso en zonas turísticas de Bangkok\n" +
      "• Siempre taxis con taxímetro (“meter, please”)\n" +
      "• No aceptes ofertas de desconocidos para llevarte a tiendas/templos\n" +
      "• En playas, ojo con las corrientes en monzón\n\n" +
      "Durante el tour tienes mi WhatsApp 24/7. Cualquier cosa, estoy contigo.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "transporte",
    categoria: "viaje",
    pregunta: "¿Cómo me muevo entre destinos?",
    respuesta:
      "<p>Dentro de cada programa nos ocupamos de todo el transporte: traslados privados en vehículo con aire acondicionado, vuelos internos cuando conviene (Bangkok–Chiang Mai, Bangkok–Phuket) y trenes nocturnos si te apetece la experiencia.</p>" +
      "<p>Todos los conductores son de confianza, hablan inglés básico y reciben instrucciones en español por mi parte.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre cómo te mueves en Tailandia:\n\n" +
      "Me ocupo de todo el transporte dentro del programa:\n" +
      "• Traslados privados con aire acondicionado entre destinos\n" +
      "• Vuelos internos cuando conviene (ej. Bangkok–Chiang Mai, Bangkok–Phuket)\n" +
      "• Tren nocturno si te apetece la experiencia\n\n" +
      "Todos los conductores son de confianza y reciben instrucciones mías en español.\n\nUn abrazo, Esmeranda 🌞"
  },

  // ------------- SALUD Y COMIDA -------------
  {
    id: "vacunas",
    categoria: "salud",
    pregunta: "¿Necesito vacunas para entrar a Tailandia?",
    respuesta:
      "<p>No se exige ninguna vacuna obligatoria para entrar desde Europa o Latinoamérica. Los centros de vacunación internacional suelen recomendar:</p>" +
      "<ul><li>Hepatitis A y tifoidea (si vas a comer street food)</li><li>Tétanos al día</li><li>Rabia o encefalitis japonesa solo para estancias largas o rurales</li></ul>" +
      "<p>Consúltalo con tu centro de sanidad internacional 4–6 semanas antes del viaje. Siempre es un <em>consejo</em>, nunca una obligación para turistas normales.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre vacunas para Tailandia:\n\n" +
      "NO hay vacunas obligatorias desde Europa o Latinoamérica.\n\n" +
      "Recomendadas (consulta en tu centro de sanidad internacional):\n" +
      "• Hepatitis A y tifoidea (si vas a comer street food)\n" +
      "• Tétanos al día\n" +
      "• Rabia o encefalitis japonesa solo para estancias largas o rurales\n\n" +
      "Mejor hacerlo 4–6 semanas antes del viaje. Para turismo estándar, ninguna es obligatoria.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "agua",
    categoria: "salud",
    pregunta: "¿Puedo beber el agua del grifo?",
    respuesta:
      "<p>No. El agua del grifo no es potable, pero tranquilidad: el agua embotellada es baratísima (50 céntimos el litro y medio) y se vende en cada esquina. En todos los hoteles de nuestros tours encontrarás agua mineral gratuita cada día.</p>" +
      "<p>Puedes usar agua del grifo para cepillarte los dientes sin problema.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Agua en Tailandia:\n\n" +
      "🚫 No bebas agua del grifo.\n" +
      "✅ Agua embotellada en cada esquina (unos 50 céntimos el litro y medio).\n" +
      "✅ En los hoteles del tour tienes agua gratis cada día.\n" +
      "✅ Para cepillarte los dientes, el agua del grifo sí vale.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "comida",
    categoria: "salud",
    pregunta: "¿La comida es muy picante? ¿Hay opciones vegetarianas?",
    respuesta:
      "<p>La cocina tailandesa puede ser picante, pero siempre puedes pedirlo <strong>“mai phet”</strong> (sin picante) o <strong>“phet nit noi”</strong> (poco picante).</p>" +
      "<p>Hay muchísimas opciones <strong>vegetarianas y veganas</strong>: pad thai de verduras, curris sin carne, arroz con mango, rollitos frescos… Avísanos antes del tour y adaptamos cada comida.</p>" +
      "<p>¿Alergias? Las gestionamos con los restaurantes antes de llegar.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre la comida tailandesa:\n\n" +
      "🌶️ Puede ser picante, pero SIEMPRE puedes pedirlo suave:\n" +
      "• “mai phet” = sin picante\n" +
      "• “phet nit noi” = poco picante\n\n" +
      "🌱 Opciones vegetarianas/veganas hay muchísimas: pad thai de verduras, curris sin carne, rollitos frescos, arroz con mango…\n\n" +
      "Si tienes restricción o alergia, avísame antes del tour y lo gestiono con cada restaurante.\n\nUn abrazo, Esmeranda 🌞"
  },

  // ------------- DINERO Y CONECTIVIDAD -------------
  {
    id: "dinero",
    categoria: "dinero",
    pregunta: "¿Cuánto dinero debo llevar?",
    respuesta:
      "<p>Con el tour ya casi todo está pagado. Te recomiendo llevar <strong>entre 25 y 40 USD por día</strong> por persona para:</p>" +
      "<ul><li>Comidas fuera del programa</li><li>Bebidas, snacks, masajes (un masaje tailandés de 1h cuesta 6–10 USD)</li><li>Souvenirs y mercados</li><li>Propinas</li></ul>" +
      "<p>Hay cajeros en todos los destinos y el cambio se hace fácilmente a baht. Las tarjetas funcionan en hoteles y tiendas grandes, pero lleva efectivo para mercados y street food.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Sobre el dinero en Tailandia:\n\n" +
      "Con el tour ya casi todo está pagado. Te recomiendo llevar entre 25–40 USD/día por persona para:\n" +
      "• Comidas fuera del programa\n" +
      "• Bebidas, snacks, masajes (1h = 6–10 USD 💆)\n" +
      "• Souvenirs y mercados\n" +
      "• Propinas\n\n" +
      "Hay cajeros en todos los destinos y cambiar euros/dólares es muy fácil. Las tarjetas funcionan en hoteles y tiendas grandes, pero lleva efectivo para mercados y street food.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "internet",
    categoria: "dinero",
    pregunta: "¿Cómo tengo internet durante el viaje?",
    respuesta:
      "<p>Tres opciones, de la más cómoda a la más barata:</p>" +
      "<ul><li><strong>eSIM</strong> (mi favorita): la compras online antes de viajar y la activas al aterrizar. Unos 10–15 USD por una semana.</li><li><strong>SIM física en el aeropuerto:</strong> stands de AIS o DTAC nada más llegar, muy fácil, 15–20 USD por una semana.</li><li><strong>Wi-Fi del hotel:</strong> incluido en todos los alojamientos del tour.</li></ul>" +
      "<p>Yo te ayudo a activarla si lo necesitas.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Para tener internet en Tailandia:\n\n" +
      "📱 eSIM (mi favorita): la compras online antes de viajar y se activa al aterrizar. ~10–15 USD por una semana.\n\n" +
      "📶 SIM física: stands de AIS o DTAC en el aeropuerto nada más llegar. 15–20 USD por una semana.\n\n" +
      "📡 Wi-Fi: incluido en todos los hoteles del tour.\n\n" +
      "Te ayudo a activarla si lo necesitas.\n\nUn abrazo, Esmeranda 🌞"
  },

  // ------------- CULTURA -------------
  {
    id: "templos",
    categoria: "cultura",
    pregunta: "¿Cómo debo vestirme para visitar templos?",
    respuesta:
      "<p>Los templos son lugares sagrados. La regla básica:</p>" +
      "<ul><li><strong>Hombros cubiertos</strong> (nada de tirantes ni camisetas de tirantes)</li><li><strong>Rodillas cubiertas</strong> (nada de shorts ni faldas cortas)</li><li><strong>Zapatos fuera</strong> al entrar al templo principal</li></ul>" +
      "<p>Si te pilla desprevenida, en los templos grandes alquilan pareos por 50 baht. Yo siempre llevo un foulard en la mochila: soluciona todo.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Para visitar templos en Tailandia:\n\n" +
      "✅ Hombros cubiertos (nada de tirantes)\n" +
      "✅ Rodillas cubiertas (nada de shorts ni faldas cortas)\n" +
      "✅ Zapatos fuera al entrar al templo\n\n" +
      "Tip: lleva siempre un foulard o pareo en la mochila, te salva en cualquier templo.\n\nUn abrazo, Esmeranda 🌞"
  },
  {
    id: "propinas",
    categoria: "cultura",
    pregunta: "¿Se dan propinas en Tailandia?",
    respuesta:
      "<p>No son obligatorias, pero se aprecian mucho. Referencia:</p>" +
      "<ul><li><strong>Restaurantes:</strong> 20–50 baht (0,50–1,50 USD) o redondear la cuenta</li><li><strong>Masajes:</strong> 50–100 baht</li><li><strong>Guías:</strong> 300–500 baht por día, por grupo</li><li><strong>Conductores:</strong> 100–200 baht por día</li></ul>" +
      "<p>Siempre en efectivo y con las manos, nunca sobre la mesa. Es un gesto que en Tailandia significa cariño.</p>",
    respuestaWhatsApp:
      "¡Hola! 🧡 Propinas en Tailandia (no obligatorias pero sí bienvenidas):\n\n" +
      "🍜 Restaurantes: 20–50 baht o redondear la cuenta\n" +
      "💆 Masajes: 50–100 baht\n" +
      "🗺️ Guías: 300–500 baht por día (por grupo)\n" +
      "🚗 Conductores: 100–200 baht por día\n\n" +
      "Siempre en efectivo y entregado con las manos, nunca dejado sobre la mesa.\n\nUn abrazo, Esmeranda 🌞"
  }
];
