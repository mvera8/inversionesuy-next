export interface FAQ {
    pregunta: string;
    respuesta: string;
}

export interface Tool {
    value: string;
    label: string;
    description?: string;
    color: string;
    riesgo: string;
    faqs?: FAQ[];
}

const tools: Tool[] = [
    {
        "value": "plazo_fijo",
        "label": "Plazo Fijo",
        "description": "Instrumento de renta fija que ofrece una tasa de interés predeterminada por un período fijo. Ideal para inversores conservadores que buscan estabilidad y previsibilidad.",
        "color": "blue",
        "riesgo": "Bajo",
        "faqs": [
            {
                "pregunta": "¿Qué significa TNA (Tasa Nominal Anual)?",
                "respuesta": "Es la tasa de interés anual que se aplica sobre un capital sin considerar la capitalización de intereses ni el efecto de la inflación. En Uruguay se utiliza habitualmente para plazos fijos y productos bancarios tradicionales en pesos y dólares."
            },
            {
                "pregunta": "¿Qué significa TEA (Tasa Efectiva Anual)?",
                "respuesta": "Es la tasa que refleja el rendimiento real anual de una inversión considerando la capitalización de los intereses. Siempre es mayor que la TNA cuando los intereses se reinvierten durante el año."
            },
            {
                "pregunta": "¿Qué significa IPC (Índice de Precios al Consumo)?",
                "respuesta": "Es el indicador oficial que mide la inflación en Uruguay. Representa la variación promedio de los precios de una canasta de bienes y servicios y es publicado mensualmente por el Banco Central del Uruguay."
            },
            {
                "pregunta": "¿Qué significa UI (Unidades Indexadas)?",
                "respuesta": "Las Unidades Indexadas son una unidad de cuenta que se ajusta diariamente según la inflación. Las inversiones en UI ofrecen una tasa real, lo que permite proteger el poder de compra frente al aumento de precios."
            },
            {
                "pregunta": "¿Cómo funciona esta calculadora de rendimientos?",
                "respuesta": "La calculadora compara distintas opciones de inversión disponibles en Uruguay, como plazos fijos, cuentas remuneradas y alternativas indexadas. Utiliza tasas públicas y promedios históricos para estimar rendimientos con interés simple o compuesto según el período seleccionado."
            },
            {
                "pregunta": "¿Los rendimientos mostrados están garantizados?",
                "respuesta": "No. Los valores mostrados son estimaciones basadas en tasas actuales o históricas. Las tasas pueden cambiar y el rendimiento final puede ser diferente al estimado, incluso pudiendo existir pérdida de poder adquisitivo o de capital."
            },
            {
                "pregunta": "Disclaimer",
                "respuesta": "Los rendimientos mostrados son solo con fines informativos y educativos. No constituyen asesoramiento financiero ni una recomendación de inversión. Antes de tomar decisiones financieras, se recomienda consultar con un asesor profesional."
            }
        ]
    },
    {
        "value": "ahorro_sueldo",
        "label": "Ahorro en Sueldo",
        "riesgo": "Bajo",
        "color": "indigo"
    },
    {
        "value": "letra",
        "label": "Letra",
        "riesgo": "Medio",
        "color": "pink"
    },
    {
        "value": "crypto",
        "label": "Crypto",
        "riesgo": "Medio",
        "color": "cyan"
    },
    {
        "value": "acciones",
        "label": "Acciones",
        "riesgo": "Medio",
        "color": "yellow"
    },
    {
        "value": "bonos",
        "label": "Bonos",
        "riesgo": "Medio",
        "color": "teal"
    },
    {
        "value": "other",
        "label": "Otro",
        "riesgo": "-",
        "color": "orange"
    }
];

export default tools;
