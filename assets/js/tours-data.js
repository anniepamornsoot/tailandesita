// Tour programs dataset for Tailandesita Travel Co., Ltd.
// Fields:
//   id, nombre, destino (slug), ciudades (array), duracionDias,
//   resumen, precioDesde (USD), incluye, minPersonas, maxPersonas,
//   imagen
window.TAILANDESITA_TOURS = [
  {
    id: "bkk-esencial-3d",
    nombre: "Bangkok Esencial",
    destino: "bangkok",
    ciudades: ["Bangkok"],
    duracionDias: 3,
    resumen: "Gran Palacio, Wat Pho, mercados flotantes y atardecer en el río Chao Phraya. La introducción perfecta a la capital.",
    precioDesde: 320,
    minPersonas: 1,
    maxPersonas: 10,
    imagen: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "bkk-gastro-2d",
    nombre: "Bangkok Gastronómico",
    destino: "bangkok",
    ciudades: ["Bangkok"],
    duracionDias: 2,
    resumen: "Ruta de comida callejera en Chinatown, clase de cocina tailandesa y rooftop con vistas al skyline.",
    precioDesde: 240,
    minPersonas: 1,
    maxPersonas: 8,
    imagen: "https://images.unsplash.com/photo-1572454591674-2739f30d2f2d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "phuket-islas-4d",
    nombre: "Phuket y las islas Phi Phi",
    destino: "phuket",
    ciudades: ["Phuket", "Islas Phi Phi"],
    duracionDias: 4,
    resumen: "Playas de postal, snorkel en Maya Bay y navegación por Phang Nga en long-tail boat privado.",
    precioDesde: 520,
    minPersonas: 2,
    maxPersonas: 12,
    imagen: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "phuket-relax-3d",
    nombre: "Phuket Relax",
    destino: "phuket",
    ciudades: ["Phuket"],
    duracionDias: 3,
    resumen: "Playa, spa tailandés y cena al atardecer en Promthep Cape. Pensado para parejas y escapadas cortas.",
    precioDesde: 390,
    minPersonas: 2,
    maxPersonas: 6,
    imagen: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cnx-cultural-4d",
    nombre: "Chiang Mai Cultural",
    destino: "chiang-mai",
    ciudades: ["Chiang Mai"],
    duracionDias: 4,
    resumen: "Doi Suthep al amanecer, santuario ético de elefantes, clase de cocina del norte y mercado nocturno.",
    precioDesde: 480,
    minPersonas: 1,
    maxPersonas: 10,
    imagen: "https://images.unsplash.com/photo-1598935898639-81586f7d2129?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cnx-trekking-5d",
    nombre: "Chiang Mai Aventura",
    destino: "chiang-mai",
    ciudades: ["Chiang Mai", "Pai"],
    duracionDias: 5,
    resumen: "Trekking suave por tribus del norte, rafting en el río Mae Taeng y escapada a Pai entre cascadas.",
    precioDesde: 620,
    minPersonas: 2,
    maxPersonas: 10,
    imagen: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "ayutthaya-dia",
    nombre: "Ayutthaya en un día",
    destino: "ayutthaya",
    ciudades: ["Ayutthaya"],
    duracionDias: 1,
    resumen: "Excursión desde Bangkok para descubrir la antigua capital: Wat Mahathat, Wat Chaiwatthanaram y paseo en barca.",
    precioDesde: 120,
    minPersonas: 1,
    maxPersonas: 12,
    imagen: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80",
    pagina: "tour-program.html?tour=ayutthaya-1d"
  },
  {
    id: "ayutthaya-historico-2d",
    nombre: "Ayutthaya Histórico",
    destino: "ayutthaya",
    ciudades: ["Ayutthaya", "Bang Pa-In"],
    duracionDias: 2,
    resumen: "Noche entre templos iluminados, Palacio de Verano Bang Pa-In y ruta en bicicleta por el sitio UNESCO.",
    precioDesde: 210,
    minPersonas: 2,
    maxPersonas: 10,
    imagen: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kan-naturaleza-2d",
    nombre: "Kanchanaburi Naturaleza",
    destino: "kanchanaburi",
    ciudades: ["Kanchanaburi"],
    duracionDias: 2,
    resumen: "Cascadas Erawan, puente sobre el río Kwai, tren histórico y noche en balsa flotante sobre el río.",
    precioDesde: 280,
    minPersonas: 2,
    maxPersonas: 10,
    imagen: "https://images.unsplash.com/photo-1563492065-1a3ec2c4f8fc?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kan-selva-3d",
    nombre: "Kanchanaburi Selva y Río",
    destino: "kanchanaburi",
    ciudades: ["Kanchanaburi", "Sai Yok"],
    duracionDias: 3,
    resumen: "Parque Nacional Sai Yok, kayak por el Kwai Noi, visita al museo del ferrocarril y noche en eco-lodge.",
    precioDesde: 410,
    minPersonas: 2,
    maxPersonas: 8,
    imagen: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "gran-ruta-10d",
    nombre: "Gran Ruta Tailandesita",
    destino: "multi",
    ciudades: ["Bangkok", "Ayutthaya", "Chiang Mai", "Phuket"],
    duracionDias: 10,
    resumen: "La ruta estrella de Esmeranda: norte, centro y sur. 10 días viviendo la Tailandia más completa.",
    precioDesde: 1650,
    minPersonas: 2,
    maxPersonas: 12,
    imagen: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "clasica-7d",
    nombre: "Tailandia Clásica",
    destino: "multi",
    ciudades: ["Bangkok", "Ayutthaya", "Kanchanaburi"],
    duracionDias: 7,
    resumen: "Una semana equilibrada entre la capital, las ruinas y la naturaleza. Ideal para una primera vez en Tailandia.",
    precioDesde: 1090,
    minPersonas: 2,
    maxPersonas: 12,
    imagen: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80"
  }
];
