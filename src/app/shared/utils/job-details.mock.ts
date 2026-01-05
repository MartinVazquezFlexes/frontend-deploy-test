export const JOB_DETAILS: Record<number, {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  company: {
    name: string;
    description: string;
    web: string;
  };
}> = {
  1: {
    description: "En TECHFORB continuamos ampliando nuestro Equipo de Desarrolladores PHP. En esta ocasión nos encontramos en la búsqueda de un especialista en desarrollo.",
    responsibilities: [
      "Comprensión de los requerimientos definidos por los analistas funcionales",
      "Consensuar con el líder de desarrollo las mejores alternativas de la arquitectura del SW a desarrollar",
      "Reutilizar componentes existentes integrados con código propio",
      "Revisar el código para resolver defectos o mejorarlo",
      "Documentar los programas de acuerdo con los estándares",
      "Mantener las aplicaciones productivas, corregir errores e implementar nuevas funcionalidades",
      "Cumplir con las entregas según las estimaciones de tiempo realizadas",
      "Otras competencias: Trabajo en equipos, proactividad, propuestas de mejora"
    ],
    requirements: [
      "Experiencia comprobable con el modelo MVC",
      "Lenguajes: PHP OO, Laravel (excluyente), Javascript, Bootstrap, Liveware",
      "Conocimientos en SQL",
      "Conocimientos en Linux",
      "Manejo de versionado de código",
      "Manejo de APIs, web services",
      "Deseables: Java, Python, Android, PostgreSQL",
      "Experiencia comprobable (5 años)"
    ],
    benefits: [
      "Modalidad Hibrida: dos días remotos y 3 presenciales",
      "Jornada laboral de 8 horas (incluido almuerzo)",
      "Remuneración bruta aproximada $2.504.268, más 3% de presentismo"
    ],
    company: {
      name: "Techforb",
      description: "Somos una empresa de Recursos Humanos con foco en Tecnología. Acompañamos la gestión de recursos, brindando soluciones de capital humano: Búsqueda y Selección, Head Hunting y Staffing IT. Focalizados en la mejora continua de los procesos favoreciendo el crecimiento, eficiencia y rentabilidad de nuestros clientes.",
      web: "https://techforb.com/es"
    }
  },
  2: {
    description: "Buscamos Diseñador UX/UI para proyectos innovadores en Creativa Studio.",
    responsibilities: [
      "Diseñar interfaces atractivas y funcionales",
      "Colaborar con equipos de desarrollo y marketing",
      "Realizar pruebas de usabilidad y ajustar diseños según feedback"
    ],
    requirements: [
      "Experiencia en Figma, Adobe XD o Sketch",
      "Portafolio comprobable",
      "Conocimientos de HTML y CSS"
    ],
    benefits: [
      "Ambiente creativo y flexible",
      "Capacitación continua",
      "Oportunidad de crecimiento"
    ],
    company: {
      name: "Creativa Studio",
      description: "Agencia líder en diseño digital y branding, especializada en experiencias de usuario innovadoras y personalizadas.",
      web: "https://creativastudio.com"
    }
  },
  3: {
    description: "Únete a DataCorp como Ingeniero de Datos y sé parte de proyectos de Big Data internacionales.",
    responsibilities: [
      "Diseñar y mantener pipelines de datos escalables",
      "Colaborar con equipos de ciencia de datos y desarrollo",
      "Optimizar consultas y procesos ETL"
    ],
    requirements: [
      "Experiencia en Python y SQL",
      "Conocimientos de plataformas cloud (AWS, GCP o Azure)",
      "Experiencia previa en proyectos de Big Data"
    ],
    benefits: [
      "Trabajo remoto",
      "Salario competitivo",
      "Plan de carrera y capacitaciones en tecnologías de datos"
    ],
    company: {
      name: "DataCorp",
      description: "Empresa internacional líder en soluciones de Big Data y analítica avanzada.",
      web: "https://datacorp.com"
    }
  }
}; 