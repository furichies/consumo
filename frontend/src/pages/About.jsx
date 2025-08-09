import React from 'react'

export default function About() {
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      {/* Hero Section */}
      <div className='text-center py-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl text-white'>
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
          ¿Por qué unirse a un grupo de consumo local?
        </h1>
        <p className='text-xl md:text-2xl opacity-90 max-w-3xl mx-auto'>
          7 beneficios que transforman tu despensa y tu comunidad
        </p>
      </div>

      {/* Introduction */}
      <div className='bg-white rounded-xl shadow-lg p-8'>
        <div className='prose prose-lg max-w-none'>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Un grupo de consumo local es una <strong>red de vecinas y vecinos</strong> que, de forma voluntaria, 
            compran alimentos y productos básicos directamente a pequeños productores de la zona. Aunque nació 
            como una alternativa de acceso a productos frescos y de temporada, su impacto va mucho más allá de 
            la nevera: <em>revitaliza la economía cercana, cuida el planeta y devuelve el poder de decisión a 
            quienes consumen</em>.
          </p>
          <p className='text-lg text-gray-700 leading-relaxed'>
            Estos son sus principales beneficios:
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className='grid md:grid-cols-2 gap-6'>
        <BenefitCard
          number="1"
          icon="🍅"
          title="Alimentos más frescos y nutritivos"
          description="Al recortar intermediarios, la fruta se cosecha a punto de maduración, las verduras llegan en 24-48 h y los panes salen del horno la misma mañana. La diferencia en sabor y valor nutricional es inmediata: más vitaminas, menos conservantes y cero almacenamiento prolongado."
          color="from-green-500 to-green-600"
        />

        <BenefitCard
          number="2"
          icon="💰"
          title="Precio justo para ambas partes"
          description="El grupo compra al por mayor y reparte después entre las familias. Esto reduce el precio final entre un 15-30% respecto a la tienda tradicional, mientras que el agricultor recibe hasta un 40% más de lo que le pagaría la gran distribución."
          color="from-blue-500 to-blue-600"
        />

        <BenefitCard
          number="3"
          icon="🏘️"
          title="Apoyo directo a la economía local"
          description="Cada euro gastado en el grupo se queda en la comarca: financia huertos familiares, obradores artesanos o fábricas de quesos de pueblo. A diferencia de las cadenas multinacionales, aquí el dinero genera empleo cercano y evita la despoblación rural."
          color="from-orange-500 to-orange-600"
        />

        <BenefitCard
          number="4"
          icon="🌍"
          title="Huella de carbono mínima"
          description="Se eliminan largas cadenas de transporte, envases desechables y almacenes refrigerados. El kilometraje medio de los alimentos pasa de 1.500 km a menos de 50 km, lo que reduce las emisiones de CO₂ y la generación de residuos plásticos."
          color="from-emerald-500 to-emerald-600"
        />

        <BenefitCard
          number="5"
          icon="🔍"
          title="Transparencia total y trazabilidad"
          description="Preguntar al productor cómo cultiva, qué semillas usa o si sus gallinas son de corral deja de ser un acto de fe. Muchos grupos organizan visitas a las fincas o charlas mensuales donde se comparten métodos de cultivo y criterios de calidad."
          color="from-purple-500 to-purple-600"
        />

        <BenefitCard
          number="6"
          icon="🤝"
          title="Comunidad y aprendizaje compartido"
          description="El grupo se convierte en un espacio donde cambiar recetas, organizar talleres de conservas o crear un huerto urbano colectivo. Las familias conocen a sus vecinos y surgen redes de cuidado mutuo: trueques de excedentes, comidas comunitarias o apoyo en momentos difíciles."
          color="from-pink-500 to-pink-600"
        />
        
        <BenefitCard
          number="7"
          icon="🛡️"
          title="Soberanía alimentaria y resiliencia"
          description="En crisis como temporales, pandemias o conflictos internacionales, los grupos locales siguen abasteciendo a su red. Al depender menos de cadenas globales, la comunidad gana autonomía y capacidad de respuesta ante emergencias."
          color="from-red-500 to-red-600"
          wide={true}
        />
      </div>

      {/* How to Start */}
      <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8'>
        <h2 className='text-2xl font-bold text-green-800 mb-4 text-center'>
          🚀 Cómo empezar
        </h2>
        <div className='prose prose-lg max-w-none text-green-800'>
          <p>
            Busca o crea un grupo en tu barrio o pueblo (plataformas como Consomet, Teixint xarxes o 
            sencillos grupos de WhatsApp funcionan). Acordad frecuencia de pedidos, criterios de calidad 
            y sistema de reparto. Comenzar puede ser tan sencillo como <strong>10 familias que se 
            comprometen a comprar juntas la cesta semanal de verduras</strong>.
          </p>
        </div>
      </div>

      {/* Final Message */}
      <div className='bg-white rounded-xl shadow-lg p-8 text-center'>
        <div className='text-4xl mb-4'>🌱</div>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          Más que cambiar de proveedor
        </h2>
        <p className='text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed'>
          Unirse a un grupo de consumo local no es solo cambiar de proveedor: es <strong>votar tres 
          veces al día</strong> por un territorio más vivo, una alimentación más ética y una ciudadanía 
          más conectada.
        </p>
      </div>
    </div>
  )
}

function BenefitCard({ number, icon, title, description, color, wide = false }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${wide ? 'md:col-span-2' : ''}`}>
      <div className={`bg-gradient-to-r ${color} p-4 text-white`}>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold'>
            {number}
          </div>
          <div className='text-3xl'>{icon}</div>
          <h3 className='text-xl font-bold flex-1'>{title}</h3>
        </div>
      </div>
      <div className='p-6'>
        <p className='text-gray-700 leading-relaxed'>{description}</p>
      </div>
    </div>
  )
}
