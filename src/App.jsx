import React, { useState, useEffect } from 'react';

// Enum para los tipos de fondo del reactor, mejora la legibilidad
const BOTTOM_TYPES = {
  CONICAL: 'conico',
  TORISPHERICAL: 'toriesferico',
  HEMISPHERICAL: 'semiEsferico',
  FLAT: 'plano',
};

function App() {
  // --- 1. Declaración de Estados (useState) ---
  // Entradas del Usuario (Parámetros Principales)
  const [volumen, setVolumen] = useState(1000); // Volumen deseado del reactor en Litros
  const [factorComercial, setFactorComercial] = useState(3); // Factor multiplicador para el precio final
  const [dolarExchangeRate, setDolarExchangeRate] = useState(1120); // Tasa de cambio ARS/USD
  const [altoPatas, setAltoPatas] = useState(0.5); // Altura de las patas en Metros
  const [totalHorasManoObraInput, setTotalHorasManoObraInput] = useState(80); // Horas de mano de obra (entrada directa)

  // Opciones de Accesorios/Geometría (Checkboxes y Select)
  const [conCamisa, setConCamisa] = useState(true); // ¿Incluye camisa térmica?
  const [conValvula, setConValvula] = useState(true); // ¿Incluye válvula?
  const [conVisor, setConVisor] = useState(false); // ¿Incluye visor?
  const [conPatas, setConPatas] = useState(true); // ¿Incluye patas?
  // NUEVO: Estado para el tipo de fondo seleccionado
  const [bottomType, setBottomType] = useState(BOTTOM_TYPES.CONICAL);
  // Mantener conTapaCurva si es independiente del fondo inferior
  const [conTapaCurva, setConTapaCurva] = useState(false); // ¿Tiene tapa curva?

  // Precios Base Editables (Materiales y Componentes)
  const [densidadAceroInoxidable, setDensidadAceroInoxidable] = useState(8800); // kg/m³
  const [precioKgAceroUSD, setPrecioKgAceroUSD] = useState(6.36); // USD/kg
  const [valorHoraManoObra, setValorHoraManoObra] = useState(6250); // ARS/hora
  const [costoConsumiblesARS, setCostoConsumiblesARS] = useState(150000); // ARS
  const [costoPorMetroDiametroCamisaARS, setCostoPorMetroDiametroCamisaARS] = useState(5000); // ARS/m - Nuevo input editable
  const [costoVisorEditableARS, setCostoVisorEditableARS] = useState(40000); // ARS
  const [costoConformadoTapaCurvaARS, setCostoConformadoTapaCurvaARS] = useState(250000); // ARS
  const [costoValvulaUSD, setCostoValvulaUSD] = useState(60.02); // USD
  const [costoBasePataUSD, setCostoBasePataUSD] = useState(20.09); // USD
  const [costoAdicionalPorMetroPataUSD, setCostoAdicionalPorMetroPataUSD] = useState(10); // USD/m

  // NUEVOS: Costos editables para cada tipo de fondo
  const [costoFondoPlanoARS, setCostoFondoPlanoARS] = useState(50000);
  const [costoFondoConicoARS, setCostoFondoConicoARS] = useState(350000);
  const [costoFondoToriesfericoARS, setCostoFondoToriesfericoARS] = useState(450000);
  const [costoFondoSemiEsfericoARS, setCostoFondoSemiEsfericoARS] = useState(600000);

  // Resultados Calculados (Inicializar en 0)
  const [diametro, setDiametro] = useState(0);
  const [alturaCilindro, setAlturaCilindro] = useState(0);
  const [alturaTotalReactor, setAlturaTotalReactor] = useState(0);
  const [areaChapaCuerpo, setAreaChapaCuerpo] = useState(0);
  const [areaChapaTapaSuperior, setAreaChapaTapaSuperior] = useState(0);
  const [areaChapaFondoInferior, setAreaChapaFondoInferior] = useState(0);
  const [areaChapaTotal, setAreaChapaTotal] = useState(0);
  const [kgChapa, setKgChapa] = useState(0);
  const [costoChapaARS, setCostoChapaARS] = useState(0);
  const [costoManoObraCalculadoARS, setCostoManoObraCalculadoARS] = useState(0);
  const [costoAccesoriosARS, setCostoAccesoriosARS] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [precioFinal, setPrecioFinal] = useState(0);

  // Nuevos estados para espesorChapa calculado y costo unitario de camisa calculado
  const [calculatedEspesorChapa, setCalculatedEspesorChapa] = useState(0);
  const [calculatedCostoUnitarioCamisaTermicaARS_m2, setCalculatedCostoUnitarioCamisaTermicaARS_m2] = useState(0);
  const [areaChapaCamisaTermica, setAreaChapaCamisaTermica] = useState(0); // Nuevo estado para el área de la camisa

  // NUEVO: Estado para la capacidad total real calculada del tanque
  const [totalTankCapacityLiters, setTotalTankCapacityLiters] = useState(0);

  // --- 2. Constantes Geométricas ---
  const H_CONE_RATIO_TO_R = 25 / 47.5; // Altura Cono / R_mayor_cono
  const R_CONE_BOTTOM_RATIO_TO_R = 7.5 / 47.5; // R_menor_cono / R_mayor_cono
  const JACKET_DIAMETER_INCREASE_FACTOR = 1.05; // 5% de aumento para el diámetro de la camisa
  // NUEVAS CONSTANTES para fondos
  const TORISPHERICAL_HEAD_DEPTH_RATIO = 0.25; // Profundidad aprox. de cabeza toriesférica (D/4)
  const TORISPHERICAL_AREA_FACTOR = 1.12; // Factor de área aproximado para fondos abombados/toriesféricos
  const HEMISPHERICAL_HEAD_HEIGHT_RATIO = 0.5; // Altura de hemisferio es el radio (D/2)

  // --- 3. Lógica de Cálculos (useEffect) ---
  useEffect(() => {
    // Determinar espesorChapa en base al volumen (Lógica simplificada para demostración)
    let currentEspesorChapa;
    if (volumen <= 500) {
      currentEspesorChapa = 2; // mm
    } else if (volumen <= 2000) {
      currentEspesorChapa = 3; // mm
    } else if (volumen <= 5000) {
      currentEspesorChapa = 4; // mm
    } else {
      currentEspesorChapa = 5; // mm para volúmenes muy grandes
    }
    setCalculatedEspesorChapa(currentEspesorChapa);

    // A. Conversiones Iniciales
    const volumen_m3 = volumen / 1000;
    const espesor_m = currentEspesorChapa / 1000; // Usar el espesor calculado

    // B. Cálculo de Dimensiones (D y H)
    // Coeficiente del volumen de la parte cilíndrica en función de D^3 (V_cilindro = 0.3 * pi * D^3)
    const C_volumen_cilindro_parte_D3 = 0.3 * Math.PI;

    let C_volumen_fondo_parte_D3 = 0; // Coeficiente del volumen del fondo en función de D^3
    let bottomHeightContribution = 0; // Contribución del fondo a la altura total del reactor
    let currentCostoFondoARS = 0; // Costo del fondo actual

    // Lógica para el cálculo de volumen, área y altura del fondo según el tipo seleccionado
    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        C_volumen_fondo_parte_D3 = (1 / 3) * Math.PI * H_CONE_RATIO_TO_R * (1 + Math.pow(R_CONE_BOTTOM_RATIO_TO_R, 2) + R_CONE_BOTTOM_RATIO_TO_R) / 8;
        bottomHeightContribution = (calculatedD / 2) * H_CONE_RATIO_TO_R; // R * H_CONE_RATIO_TO_R
        currentCostoFondoARS = costoFondoConicoARS;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        // Volumen aproximado para cabeza toriesférica (aprox. D/4 de profundidad)
        C_volumen_fondo_parte_D3 = Math.PI / 24; // (1/6) * pi * (D/2)^3 * 2 (aprox. para profundidad D/4)
        bottomHeightContribution = calculatedD * TORISPHERICAL_HEAD_DEPTH_RATIO;
        currentCostoFondoARS = costoFondoToriesfericoARS;
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        // Volumen de un hemisferio: (2/3) * pi * R^3 = (pi/12) * D^3
        C_volumen_fondo_parte_D3 = Math.PI / 12;
        bottomHeightContribution = calculatedD / 2; // La altura de un hemisferio es su radio (D/2)
        currentCostoFondoARS = costoFondoSemiEsfericoARS;
        break;
      case BOTTOM_TYPES.FLAT:
      default: // Fondo plano no añade volumen extra a la altura del cilindro para el cálculo de D
        C_volumen_fondo_parte_D3 = 0;
        bottomHeightContribution = 0; // Fondo plano no contribuye a la altura total más allá del cilindro
        currentCostoFondoARS = costoFondoPlanoARS;
        break;
    }

    // Coeficiente total de volumen para despejar el diámetro (D)
    // El volumen total deseado (volumen_m3) es igual a este coeficiente * D^3
    const total_volume_coefficient_D3 = C_volumen_cilindro_parte_D3 + C_volumen_fondo_parte_D3;

    // Calcular el diámetro (D) y radio (R)
    const calculatedD = Math.pow(volumen_m3 / total_volume_coefficient_D3, 1 / 3);
    const calculatedR = calculatedD / 2;
    // La altura del cilindro sigue siendo 1.2 veces el diámetro, para mantener la proporción de la parte cilíndrica
    const calculatedH = 1.2 * calculatedD;

    setDiametro(calculatedD);
    setAlturaCilindro(calculatedH);

    // Calcular la altura total del reactor (altura del cilindro + contribución del fondo)
    let currentAlturaTotalReactor = calculatedH + bottomHeightContribution;
    setAlturaTotalReactor(currentAlturaTotalReactor);

    // C. Cálculo de Áreas de Chapa
    const jacketDiameter = calculatedD * JACKET_DIAMETER_INCREASE_FACTOR;
    const currentAreaChapaCuerpo = Math.PI * calculatedD * calculatedH;
    setAreaChapaCuerpo(currentAreaChapaCuerpo);

    let currentAreaChapaCamisaTermica = 0;
    if (conCamisa) {
      currentAreaChapaCamisaTermica = Math.PI * jacketDiameter * calculatedH;
    }
    setAreaChapaCamisaTermica(currentAreaChapaCamisaTermica);

    let currentAreaTapaSuperior;
    if (conTapaCurva) {
      currentAreaTapaSuperior = 1.12 * Math.PI * Math.pow(calculatedR, 2);
    } else {
      currentAreaTapaSuperior = Math.PI * Math.pow(calculatedR, 2);
    }
    setAreaChapaTapaSuperior(currentAreaTapaSuperior);

    let currentAreaFondoInferior = 0;
    // Lógica para el área de la chapa del fondo según el tipo seleccionado
    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        // Área lateral de un cono truncado
        const R1_area_cone = calculatedR;
        const R2_area_cone = calculatedR * R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_area = calculatedR * H_CONE_RATIO_TO_R;
        const slantHeight_area_cone = Math.sqrt(Math.pow(hCone_area, 2) + Math.pow(R1_area_cone - R2_area_cone, 2));
        currentAreaFondoInferior = Math.PI * (R1_area_cone + R2_area_cone) * slantHeight_area_cone;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        // Área aproximada para cabeza toriesférica (similar a dished head)
        currentAreaFondoInferior = TORISPHERICAL_AREA_FACTOR * Math.PI * Math.pow(calculatedR, 2);
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        // Área de un hemisferio
        currentAreaFondoInferior = 2 * Math.PI * Math.pow(calculatedR, 2);
        break;
      case BOTTOM_TYPES.FLAT:
      default:
        currentAreaFondoInferior = Math.PI * Math.pow(calculatedR, 2); // Área de un círculo para fondo plano
        break;
    }
    setAreaChapaFondoInferior(currentAreaFondoInferior);

    // El área total de chapa incluye todas las partes
    const currentAreaChapaTotal = currentAreaChapaCuerpo + currentAreaTapaSuperior + currentAreaFondoInferior + currentAreaChapaCamisaTermica;
    setAreaChapaTotal(currentAreaChapaTotal);

    // D. Cálculo de Peso y Costo de Chapa
    const calculatedKgChapa = currentAreaChapaTotal * espesor_m * densidadAceroInoxidable;
    const calculatedCostoChapaARS = calculatedKgChapa * precioKgAceroUSD * dolarExchangeRate;
    setKgChapa(calculatedKgChapa);
    setCostoChapaARS(calculatedCostoChapaARS);

    // E. Cálculo de Mano de Obra
    const calculatedManoObraARS = totalHorasManoObraInput * valorHoraManoObra;
    setCostoManoObraCalculadoARS(calculatedManoObraARS);

    // F. Cálculo de Costo de Accesorios
    let currentCostoAccesoriosARS = 0;

    // Calcular costoUnitarioCamisaTermicaARS_m2 dinámicamente
    const currentCostoUnitarioCamisaTermicaARS_m2 = costoPorMetroDiametroCamisaARS * calculatedD * 2.05;
    setCalculatedCostoUnitarioCamisaTermicaARS_m2(currentCostoUnitarioCamisaTermicaARS_m2);

    if (conCamisa) {
      currentCostoAccesoriosARS += currentAreaChapaCamisaTermica * currentCostoUnitarioCamisaTermicaARS_m2;
    }
    if (conValvula) {
      currentCostoAccesoriosARS += costoValvulaUSD * dolarExchangeRate;
    }
    if (conVisor) {
      currentCostoAccesoriosARS += costoVisorEditableARS;
    }
    if (conPatas) {
      const costoTotalPatasUSD = costoBasePataUSD + Math.max(0, altoPatas - 0.5) * costoAdicionalPorMetroPataUSD;
      currentCostoAccesoriosARS += 4 * costoTotalPatasUSD * dolarExchangeRate; // Asumiendo 4 patas
    }
    // AÑADIDO: Costo del fondo seleccionado
    currentCostoAccesoriosARS += currentCostoFondoARS;
    if (conTapaCurva) {
      currentCostoAccesoriosARS += costoConformadoTapaCurvaARS;
    }
    currentCostoAccesoriosARS += costoConsumiblesARS; // Los consumibles siempre se añaden
    setCostoAccesoriosARS(currentCostoAccesoriosARS);

    // G. Cálculo de Precios Finales
    const calculatedSubtotal = calculatedCostoChapaARS + calculatedManoObraARS + currentCostoAccesoriosARS;
    const calculatedPrecioFinal = calculatedSubtotal * factorComercial;
    setSubtotal(calculatedSubtotal);
    setPrecioFinal(calculatedPrecioFinal);

    // H. Cálculo de la Capacidad Total del Tanque (Volumen Real del Reactor)
    const finalCylinderVolume_m3 = Math.PI * Math.pow(calculatedR, 2) * calculatedH;
    let finalBottomVolume_m3 = 0;

    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        const R1_final_cone = calculatedR;
        const R2_final_cone = calculatedR * R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_final = calculatedR * H_CONE_RATIO_TO_R;
        finalBottomVolume_m3 = (1 / 3) * Math.PI * hCone_final * (Math.pow(R1_final_cone, 2) + (R1_final_cone * R2_final_cone) + Math.pow(R2_final_cone, 2));
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        // Volumen aproximado para cabeza toriesférica (aprox. D/4 de profundidad)
        finalBottomVolume_m3 = (Math.PI / 24) * Math.pow(calculatedD, 3);
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        // Volumen de un hemisferio
        finalBottomVolume_m3 = (2 / 3) * Math.PI * Math.pow(calculatedR, 3);
        break;
      case BOTTOM_TYPES.FLAT:
      default:
        finalBottomVolume_m3 = 0; // El volumen del fondo plano está inherentemente en el volumen del cilindro hasta la base.
        break;
    }
    setTotalTankCapacityLiters((finalCylinderVolume_m3 + finalBottomVolume_m3) * 1000); // Convertir a Litros

  }, [
    volumen,
    factorComercial,
    dolarExchangeRate,
    altoPatas,
    totalHorasManoObraInput,
    conCamisa,
    conValvula,
    conVisor,
    conPatas,
    conTapaCurva,
    // NUEVAS DEPENDENCIAS para los tipos de fondo y sus costos
    bottomType,
    densidadAceroInoxidable,
    precioKgAceroUSD,
    valorHoraManoObra,
    costoConsumiblesARS,
    costoPorMetroDiametroCamisaARS,
    costoVisorEditableARS,
    costoConformadoTapaCurvaARS,
    costoValvulaUSD,
    costoBasePataUSD,
    costoAdicionalPorMetroPataUSD,
    costoFondoPlanoARS,
    costoFondoConicoARS,
    costoFondoToriesfericoARS,
    costoFondoSemiEsfericoARS,
  ]);

  // --- 4. Función de Formato de Moneda ---
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // --- 5. Renderizado de la Interfaz (JSX) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 font-sans flex justify-center items-start">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-7xl w-full my-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Cotizador Paramétrico de Reactor
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Panel de Entradas del Usuario */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-blue-300 pb-2">
              Parámetros de Entrada
            </h2>

            {/* Main Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label htmlFor="volumen" className="text-sm font-medium text-gray-600 mb-1">
                  Volumen (Litros)
                </label>
                <input
                  type="number"
                  id="volumen"
                  value={volumen}
                  onChange={(e) => setVolumen(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="espesorChapa" className="text-sm font-medium text-gray-600 mb-1">
                  Espesor Chapa (mm)
                </label>
                <input
                  type="number"
                  id="espesorChapa"
                  value={calculatedEspesorChapa} // Mostrar valor calculado
                  readOnly // Solo lectura
                  className="p-2 border border-gray-300 bg-gray-200 rounded-lg cursor-not-allowed" // Estilo para solo lectura
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="factorComercial" className="text-sm font-medium text-gray-600 mb-1">
                  Factor Comercial
                </label>
                <input
                  type="number"
                  id="factorComercial"
                  value={factorComercial}
                  onChange={(e) => setFactorComercial(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="dolarExchangeRate" className="text-sm font-medium text-gray-600 mb-1">
                  Tasa de Cambio Dólar (ARS/USD)
                </label>
                <input
                  type="number"
                  id="dolarExchangeRate"
                  value={dolarExchangeRate}
                  onChange={(e) => setDolarExchangeRate(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="altoPatas" className="text-sm font-medium text-gray-600 mb-1">
                  Alto Patas (Metros)
                </label>
                <input
                  type="number"
                  id="altoPatas"
                  value={altoPatas}
                  onChange={(e) => setAltoPatas(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="totalHorasManoObraInput" className="text-sm font-medium text-gray-600 mb-1">
                  Total Horas Mano de Obra (HH)
                </label>
                <input
                  type="number"
                  id="totalHorasManoObraInput"
                  value={totalHorasManoObraInput}
                  onChange={(e) => setTotalHorasManoObraInput(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            {/* Editable Base Prices */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
              Precios Base Editables
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label htmlFor="densidadAceroInoxidable" className="text-sm font-medium text-gray-600 mb-1">
                  Densidad Acero Inoxidable (kg/m³)
                </label>
                <input
                  type="number"
                  id="densidadAceroInoxidable"
                  value={densidadAceroInoxidable}
                  onChange={(e) => setDensidadAceroInoxidable(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="precioKgAceroUSD" className="text-sm font-medium text-gray-600 mb-1">
                  Precio Kg Acero (USD/kg)
                </label>
                <input
                  type="number"
                  id="precioKgAceroUSD"
                  value={precioKgAceroUSD}
                  onChange={(e) => setPrecioKgAceroUSD(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="valorHoraManoObra" className="text-sm font-medium text-gray-600 mb-1">
                  Valor Hora Mano de Obra (ARS/hora)
                </label>
                <input
                  type="number"
                  id="valorHoraManoObra"
                  value={valorHoraManoObra}
                  onChange={(e) => setValorHoraManoObra(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoConsumiblesARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Consumibles (ARS)
                </label>
                <input
                  type="number"
                  id="costoConsumiblesARS"
                  value={costoConsumiblesARS}
                  onChange={(e) => setCostoConsumiblesARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoPorMetroDiametroCamisaARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo por Metro de Diámetro de Camisa (ARS/m)
                </label>
                <input
                  type="number"
                  id="costoPorMetroDiametroCamisaARS"
                  value={costoPorMetroDiametroCamisaARS}
                  onChange={(e) => setCostoPorMetroDiametroCamisaARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="calculatedCostoUnitarioCamisaTermicaARS_m2" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Unitario Camisa Térmica (ARS/m²)
                </label>
                <input
                  type="number"
                  id="calculatedCostoUnitarioCamisaTermicaARS_m2"
                  value={calculatedCostoUnitarioCamisaTermicaARS_m2.toFixed(2)} // Mostrar valor calculado
                  readOnly // Solo lectura
                  className="p-2 border border-gray-300 bg-gray-200 rounded-lg cursor-not-allowed" // Estilo para solo lectura
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoVisorEditableARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Visor (ARS)
                </label>
                <input
                  type="number"
                  id="costoVisorEditableARS"
                  value={costoVisorEditableARS}
                  onChange={(e) => setCostoVisorEditableARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoConformadoTapaCurvaARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Conformado Tapa Curva (ARS)
                </label>
                <input
                  type="number"
                  id="costoConformadoTapaCurvaARS"
                  value={costoConformadoTapaCurvaARS}
                  onChange={(e) => setCostoConformadoTapaCurvaARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoValvulaUSD" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Válvula (USD)
                </label>
                <input
                  type="number"
                  id="costoValvulaUSD"
                  value={costoValvulaUSD}
                  onChange={(e) => setCostoValvulaUSD(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoBasePataUSD" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Base Pata (USD)
                </label>
                <input
                  type="number"
                  id="costoBasePataUSD"
                  value={costoBasePataUSD}
                  onChange={(e) => setCostoBasePataUSD(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoAdicionalPorMetroPataUSD" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Adicional/Metro Pata (USD/m)
                </label>
                <input
                  type="number"
                  id="costoAdicionalPorMetroPataUSD"
                  value={costoAdicionalPorMetroPataUSD}
                  onChange={(e) => setCostoAdicionalPorMetroPataUSD(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>

              {/* NUEVOS: Costos editables para cada tipo de fondo */}
              <div className="flex flex-col">
                <label htmlFor="costoFondoPlanoARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Fondo Plano (ARS)
                </label>
                <input
                  type="number"
                  id="costoFondoPlanoARS"
                  value={costoFondoPlanoARS}
                  onChange={(e) => setCostoFondoPlanoARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoFondoConicoARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Fondo Cónico (ARS)
                </label>
                <input
                  type="number"
                  id="costoFondoConicoARS"
                  value={costoFondoConicoARS}
                  onChange={(e) => setCostoFondoConicoARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoFondoToriesfericoARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Fondo Toriesférico (ARS)
                </label>
                <input
                  type="number"
                  id="costoFondoToriesfericoARS"
                  value={costoFondoToriesfericoARS}
                  onChange={(e) => setCostoFondoToriesfericoARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="costoFondoSemiEsfericoARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Fondo Semi Esférico (ARS)
                </label>
                <input
                  type="number"
                  id="costoFondoSemiEsfericoARS"
                  value={costoFondoSemiEsfericoARS}
                  onChange={(e) => setCostoFondoSemiEsfericoARS(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                />
              </div>
            </div>

            {/* Checkboxes y Select para Opciones */}
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
              Opciones de Accesorios/Geometría
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conCamisa"
                  checked={conCamisa}
                  onChange={(e) => setConCamisa(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conCamisa" className="ml-2 text-gray-700">
                  Con Camisa Térmica
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conValvula"
                  checked={conValvula}
                  onChange={(e) => setConValvula(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conValvula" className="ml-2 text-gray-700">
                  Con Válvula
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conVisor"
                  checked={conVisor}
                  onChange={(e) => setConVisor(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conVisor" className="ml-2 text-gray-700">
                  Con Visor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conPatas"
                  checked={conPatas}
                  onChange={(e) => setConPatas(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conPatas" className="ml-2 text-gray-700">
                  Con Patas
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conTapaCurva"
                  checked={conTapaCurva}
                  onChange={(e) => setConTapaCurva(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conTapaCurva" className="ml-2 text-gray-700">
                  Con Tapa Curva
                </label>
              </div>
              {/* NUEVO: Selector de tipo de fondo */}
              <div className="flex flex-col">
                <label htmlFor="bottomType" className="text-sm font-medium text-gray-600 mb-1">
                  Tipo de Fondo
                </label>
                <select
                  id="bottomType"
                  value={bottomType}
                  onChange={(e) => setBottomType(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                >
                  <option value={BOTTOM_TYPES.FLAT}>Plano</option>
                  <option value={BOTTOM_TYPES.CONICAL}>Cónico</option>
                  <option value={BOTTOM_TYPES.TORISPHERICAL}>Toriesférico</option>
                  <option value={BOTTOM_TYPES.HEMISPHERICAL}>Semi Esférico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Panel de Resultados Calculados */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b-2 border-blue-400 pb-2">
              Resultados Calculados
            </h2>

            {/* Geometric Dimensions */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Dimensiones Geométricas</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Diámetro:</span> {diametro.toFixed(3)} m
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Altura Cilindro:</span> {alturaCilindro.toFixed(3)} m
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Altura Total Reactor:</span> {alturaTotalReactor.toFixed(3)} m
              </p>
              {/* NUEVO: Capacidad Total del Tanque */}
              <p className="text-gray-800 font-bold text-lg mt-2">
                <span className="font-medium">Capacidad Total Tanque:</span> {totalTankCapacityLiters.toFixed(0)} Litros
              </p>
            </div>

            {/* Required Sheet Area */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Área de Chapa Requerida</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Área Chapa Cuerpo:</span> {areaChapaCuerpo.toFixed(3)} m²
              </p>
              {conCamisa && (
                <p className="text-gray-800 mb-1">
                  <span className="font-medium">Área Chapa Camisa Térmica:</span> {areaChapaCamisaTermica.toFixed(3)} m²
                </p>
              )}
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Área Chapa Tapa Superior ({conTapaCurva ? 'Curva' : 'Plana'}):</span>{' '}
                {areaChapaTapaSuperior.toFixed(3)} m²
              </p>
              {/* Etiqueta del fondo ahora dinámica */}
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Área Chapa Fondo Inferior ({
                  bottomType === BOTTOM_TYPES.CONICAL ? 'Cónico' :
                  bottomType === BOTTOM_TYPES.TORISPHERICAL ? 'Toriesférico' :
                  bottomType === BOTTOM_TYPES.HEMISPHERICAL ? 'Semi Esférico' :
                  'Plano'
                }):</span>{' '}
                {areaChapaFondoInferior.toFixed(3)} m²
              </p>
              <p className="text-gray-800 font-bold text-lg">
                <span className="font-medium">Área Chapa Total:</span> {areaChapaTotal.toFixed(3)} m²
              </p>
            </div>

            {/* Weight and Sheet Cost */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Peso y Costo de Chapa</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Kg Chapa:</span> {kgChapa.toFixed(2)} kg
              </p>
              <p className="text-gray-800 font-bold text-lg">
                <span className="font-medium">Costo Chapa:</span> {formatCurrency(costoChapaARS)}
              </p>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Desglose de Costos</h3>
              <ul className="list-disc list-inside text-gray-800">
                <li className="mb-1">
                  <span className="font-medium">Costo Chapa:</span> {formatCurrency(costoChapaARS)}
                </li>
                <li className="mb-1">
                  <span className="font-medium">Costo Mano de Obra:</span> {formatCurrency(costoManoObraCalculadoARS)}{' '}
                  (Total Horas: {totalHorasManoObraInput} HH @ {formatCurrency(valorHoraManoObra)}/HH)
                </li>
                <li className="mb-1">
                  <span className="font-medium">Costo Consumibles:</span> {formatCurrency(costoConsumiblesARS)}
                </li>
                <li>
                  <span className="font-medium">Costo Accesorios:</span> {formatCurrency(costoAccesoriosARS)}
                  <ul className="list-circle list-inside ml-4 text-sm text-gray-700">
                    {conCamisa && (
                      <li>
                        Camisa Térmica: {formatCurrency(areaChapaCamisaTermica * calculatedCostoUnitarioCamisaTermicaARS_m2)}
                        {' '} (Costo Unitario: {formatCurrency(calculatedCostoUnitarioCamisaTermicaARS_m2)}/m²)
                      </li>
                    )}
                    {conValvula && (
                      <li>
                        Válvula: {formatCurrency(costoValvulaUSD * dolarExchangeRate)}
                      </li>
                    )}
                    {conVisor && (
                      <li>
                        Visor: {formatCurrency(costoVisorEditableARS)}
                      </li>
                    )}
                    {conPatas && (
                      <li>
                        Patas: {formatCurrency(4 * (costoBasePataUSD + Math.max(0, altoPatas - 0.5) * costoAdicionalPorMetroPataUSD) * dolarExchangeRate)}
                      </li>
                    )}
                    {/* Visualización del costo del fondo según el tipo seleccionado */}
                    {bottomType === BOTTOM_TYPES.FLAT && (
                      <li>Fondo Plano: {formatCurrency(costoFondoPlanoARS)}</li>
                    )}
                    {bottomType === BOTTOM_TYPES.CONICAL && (
                      <li>Fondo Cónico: {formatCurrency(costoFondoConicoARS)}</li>
                    )}
                    {bottomType === BOTTOM_TYPES.TORISPHERICAL && (
                      <li>Fondo Toriesférico: {formatCurrency(costoFondoToriesfericoARS)}</li>
                    )}
                    {bottomType === BOTTOM_TYPES.HEMISPHERICAL && (
                      <li>Fondo Semi Esférico: {formatCurrency(costoFondoSemiEsfericoARS)}</li>
                    )}
                    {conTapaCurva && (
                      <li>
                        Conformado Tapa Curva: {formatCurrency(costoConformadoTapaCurvaARS)}
                      </li>
                    )}
                  </ul>
                </li>
              </ul>
            </div>

            {/* Price Summary */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Resumen de Precios</h3>
              <p className="text-gray-800 font-bold text-xl mb-2">
                <span className="font-medium">Subtotal:</span> {formatCurrency(subtotal)}
              </p>
              <p className="text-green-700 font-extrabold text-2xl">
                <span className="font-medium">Precio Final:</span> {formatCurrency(precioFinal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
