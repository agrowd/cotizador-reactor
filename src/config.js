export const CONFIG = {
  // Tipos de fondo
  BOTTOM_TYPES: {
    CONICAL: 'conico',
    TORISPHERICAL: 'toriesferico',
    HEMISPHERICAL: 'semiEsferico',
    FLAT: 'plano'
  },

  // Ratios geométricos
  GEOMETRY_RATIOS: {
    H_CONE_RATIO_TO_R: 25 / 47.5,
    R_CONE_BOTTOM_RATIO_TO_R: 7.5 / 47.5,
    JACKET_DIAMETER_INCREASE_FACTOR: 1.05,
    TORISPHERICAL_HEAD_DEPTH_RATIO: 0.25,
    TORISPHERICAL_AREA_FACTOR: 1.12,
    HEMISPHERICAL_HEAD_HEIGHT_RATIO: 0.5,
    CYLINDER_HEIGHT_RATIO: 1.2
  },

  // Valores por defecto
  DEFAULTS: {
    VOLUMEN: 1000,
    FACTOR_COMERCIAL: 3,
    DOLAR_EXCHANGE_RATE: 1120,
    ALTO_PATAS: 0.5,
    HORAS_MANO_OBRA: 80,
    DENSIDAD_ACERO: 8800,
    PRECIO_KG_ACERO_USD: 6.36,
    VALOR_HORA_MANO_OBRA: 6250,
    COSTO_CONSUMIBLES: 150000,
    COSTO_METRO_DIAMETRO_CAMISA: 5000,
    COSTO_VISOR: 40000,
    COSTO_CONFORMADO_TAPA_CURVA: 250000,
    COSTO_VALVULA_USD: 60.02,
    COSTO_BASE_PATA_USD: 20.09,
    COSTO_ADICIONAL_PATA_USD: 10,
    COSTO_FONDO_PLANO: 50000,
    COSTO_FONDO_CONICO: 350000,
    COSTO_FONDO_TORIESFERICO: 450000,
    COSTO_FONDO_SEMIESFERICO: 600000
  },

  // Configuración de espesores según volumen
  ESPESORES: [
    { maxVolumen: 500, espesor: 2 },
    { maxVolumen: 2000, espesor: 3 },
    { maxVolumen: 5000, espesor: 4 },
    { maxVolumen: Infinity, espesor: 5 }
  ],

  // Configuración de la interfaz
  UI: {
    DECIMAL_PLACES: {
      DIMENSIONS: 3,
      AREAS: 2,
      COSTS: 0
    },
    CURRENCY_FORMAT: {
      locale: 'es-AR',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }
  }
}; 