import React, { useState, useEffect } from 'react';

function App() {
  // --- 1. Declaración de Estados (useState) ---
  // Estos estados manejan los datos de entrada del usuario, las opciones seleccionadas
  // y los resultados calculados que se mostrarán en la interfaz.

  // Entradas del Usuario (Parámetros Principales)
  const [volumen, setVolumen] = useState(1000); // Volumen del reactor en Litros
  const [factorComercial, setFactorComercial] = useState(3); // Factor multiplicador para el precio final
  const [dolarExchangeRate, setDolarExchangeRate] = useState(1120); // Tasa de cambio ARS/USD
  const [altoPatas, setAltoPatas] = useState(0.5); // Altura de las patas en Metros
  const [totalHorasManoObraInput, setTotalHorasManoObraInput] = useState(80); // Horas de mano de obra (entrada directa)

  // Opciones de Accesorios/Geometría (Checkboxes)
  // Estos booleanos controlan la inclusión de diferentes componentes en el cálculo.
  const [conCamisa, setConCamisa] = useState(true); // ¿Incluye camisa térmica?
  const [conValvula, setConValvula] = useState(true); // ¿Incluye válvula?
  const [conVisor, setConVisor] = useState(false); // ¿Incluye visor?
  const [conPatas, setConPatas] = useState(true); // ¿Incluye patas?
  const [conFondoConico, setConFondoConico] = useState(true); // ¿Tiene fondo cónico?
  const [conTapaCurva, setConTapaCurva] = useState(false); // ¿Tiene tapa curva?

  // Precios Base Editables (Materiales y Componentes)
  // Estos estados permiten al usuario ajustar los costos unitarios y base.
  const [densidadAceroInoxidable, setDensidadAceroInoxidable] = useState(8800); // Densidad del acero en kg/m³
  const [precioKgAceroUSD, setPrecioKgAceroUSD] = useState(6.36); // Precio del acero por kg en USD
  const [valorHoraManoObra, setValorHoraManoObra] = useState(6250); // Valor de la hora de mano de obra en ARS
  const [costoConsumiblesARS, setCostoConsumiblesARS] = useState(150000); // Costo fijo de consumibles en ARS
  const [costoPorMetroDiametroCamisaARS, setCostoPorMetroDiametroCamisaARS] = useState(5000); // Costo por metro de diámetro para la camisa en ARS/m
  const [costoVisorEditableARS, setCostoVisorEditableARS] = useState(40000); // Costo del visor en ARS
  const [costoFondoConicoEditableARS, setCostoFondoConicoEditableARS] = useState(350000); // Costo del fondo cónico en ARS
  const [costoConformadoTapaCurvaARS, setCostoConformadoTapaCurvaARS] = useState(250000); // Costo de conformado de tapa curva en ARS
  const [costoValvulaUSD, setCostoValvulaUSD] = useState(60.02); // Costo de la válvula en USD
  const [costoBasePataUSD, setCostoBasePataUSD] = useState(20.09); // Costo base de una pata en USD
  const [costoAdicionalPorMetroPataUSD, setCostoAdicionalPorMetroPataUSD] = useState(10); // Costo adicional por metro de pata en USD/m

  // Resultados Calculados (Inicializar en 0)
  // Estos estados almacenan los valores que se calculan en base a las entradas y opciones.
  const [diametro, setDiametro] = useState(0); // Diámetro del reactor en metros
  const [alturaCilindro, setAlturaCilindro] = useState(0); // Altura de la parte cilíndrica en metros
  const [alturaTotalReactor, setAlturaTotalReactor] = useState(0); // Altura total del reactor en metros
  const [areaChapaCuerpo, setAreaChapaCuerpo] = useState(0); // Área de chapa del cuerpo cilíndrico en m²
  const [areaChapaTapaSuperior, setAreaChapaTapaSuperior] = useState(0); // Área de chapa de la tapa superior en m²
  const [areaChapaFondoInferior, setAreaChapaFondoInferior] = useState(0); // Área de chapa del fondo inferior en m²
  const [areaChapaTotal, setAreaChapaTotal] = useState(0); // Área total de chapa requerida en m²
  const [kgChapa, setKgChapa] = useState(0); // Peso total de la chapa en kg
  const [costoChapaARS, setCostoChapaARS] = useState(0); // Costo total de la chapa en ARS
  const [costoManoObraCalculadoARS, setCostoManoObraCalculadoARS] = useState(0); // Costo total de mano de obra en ARS
  const [costoAccesoriosARS, setCostoAccesoriosARS] = useState(0); // Costo total de accesorios en ARS
  const [subtotal, setSubtotal] = useState(0); // Subtotal de costos (chapa + mano de obra + accesorios) en ARS
  const [precioFinal, setPrecioFinal] = useState(0); // Precio final del reactor en ARS (subtotal * factor comercial)

  // Nuevos estados para espesorChapa calculado y costo unitario de camisa calculado
  const [calculatedEspesorChapa, setCalculatedEspesorChapa] = useState(0); // Espesor de chapa calculado en mm
  const [calculatedCostoUnitarioCamisaTermicaARS_m2, setCalculatedCostoUnitarioCamisaTermicaARS_m2] = useState(0); // Costo unitario de la camisa térmica en ARS/m²
  const [areaChapaCamisaTermica, setAreaChapaCamisaTermica] = useState(0); // Área de chapa de la camisa térmica en m²

  // --- 2. Constantes Geométricas ---
  // Ratios predefinidos para cálculos de dimensiones y áreas.
  const H_CONE_RATIO_TO_R = 25 / 47.5; // Relación Altura Cono / Radio mayor del cono
  const R_CONE_BOTTOM_RATIO_TO_R = 7.5 / 47.5; // Relación Radio menor del cono / Radio mayor del cono
  const JACKET_DIAMETER_INCREASE_FACTOR = 1.05; // Factor de aumento del diámetro para la camisa (5% más grande)

  // --- 3. Lógica de Cálculos (useEffect) ---
  // El hook useEffect se ejecuta cada vez que alguna de sus dependencias cambia,
  // recalculando todos los valores derivados.
  useEffect(() => {
    // Determinar espesorChapa en base al volumen (Lógica simplificada para demostración)
    // Esta es una regla de negocio para asignar un espesor de chapa según el volumen.
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
    const volumen_m3 = volumen / 1000; // Convertir volumen de Litros a m³
    const espesor_m = currentEspesorChapa / 1000; // Convertir espesor de mm a metros

    // B. Cálculo de Dimensiones (Diámetro y Altura)
    // Coeficiente para la parte cilíndrica del volumen (basado en D^3)
    const C_volumen_cilindro_parte_D3 = 0.3 * Math.PI;
    let C_volumen_fondo_conico_parte_D3 = 0;
    // Si el fondo es cónico, calcular su contribución al coeficiente de volumen.
    if (conFondoConico) {
      C_volumen_fondo_conico_parte_D3 =
        (1 / 3) *
        Math.PI *
        H_CONE_RATIO_TO_R *
        (1 + Math.pow(R_CONE_BOTTOM_RATIO_TO_R, 2) + R_CONE_BOTTOM_RATIO_TO_R) /
        8;
    }

    // Coeficiente total de volumen para despejar el diámetro (D)
    const total_volume_coefficient_D3 = C_volumen_cilindro_parte_D3 + C_volumen_fondo_conico_parte_D3;
    // Calcular el diámetro (D) a partir del volumen y el coeficiente
    const calculatedD = Math.pow(volumen_m3 / total_volume_coefficient_D3, 1 / 3);
    const calculatedR = calculatedD / 2; // Radio
    const calculatedH = 1.2 * calculatedD; // Altura del cilindro (1.2 veces el diámetro)

    setDiametro(calculatedD);
    setAlturaCilindro(calculatedH);

    // Calcular la altura total del reactor, incluyendo el cono si aplica.
    let currentAlturaTotalReactor = calculatedH;
    if (conFondoConico) {
      currentAlturaTotalReactor += calculatedR * H_CONE_RATIO_TO_R;
    }
    setAlturaTotalReactor(currentAlturaTotalReactor);

    // C. Cálculo de Áreas de Chapa
    // Diámetro de la camisa (5% más grande que el diámetro del cuerpo del reactor)
    const jacketDiameter = calculatedD * JACKET_DIAMETER_INCREASE_FACTOR;

    // Área del cuerpo (siempre el área del cuerpo interno)
    const currentAreaChapaCuerpo = Math.PI * calculatedD * calculatedH;
    setAreaChapaCuerpo(currentAreaChapaCuerpo);

    // Área de la camisa térmica (solo si está seleccionada)
    let currentAreaChapaCamisaTermica = 0;
    if (conCamisa) {
      currentAreaChapaCamisaTermica = Math.PI * jacketDiameter * calculatedH;
    }
    setAreaChapaCamisaTermica(currentAreaChapaCamisaTermica);

    // Área de la tapa superior (plana o curva)
    let currentAreaTapaSuperior;
    if (conTapaCurva) {
      currentAreaTapaSuperior = 1.12 * Math.PI * Math.pow(calculatedR, 2); // Factor para tapa curva
    } else {
      currentAreaTapaSuperior = Math.PI * Math.pow(calculatedR, 2); // Área de un círculo para tapa plana
    }
    setAreaChapaTapaSuperior(currentAreaTapaSuperior);

    // Área del fondo inferior (cónico o plano)
    let currentAreaFondoInferior;
    if (conFondoConico) {
      // Área lateral de un cono truncado
      const R1 = calculatedR; // Radio mayor de la base del cono
      const R2 = calculatedR * R_CONE_BOTTOM_RATIO_TO_R; // Radio menor de la parte superior del cono
      const hCone = calculatedR * H_CONE_RATIO_TO_R; // Altura del cono
      const slantHeight = Math.sqrt(Math.pow(hCone, 2) + Math.pow(R1 - R2, 2)); // Altura inclinada
      currentAreaFondoInferior = Math.PI * (R1 + R2) * slantHeight;
    } else {
      currentAreaFondoInferior = Math.PI * Math.pow(calculatedR, 2); // Área de un círculo para fondo plano
    }
    setAreaChapaFondoInferior(currentAreaFondoInferior);

    // El área total de chapa incluye el área de la camisa si está presente
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
    // Costo Unitario Camisa Térmica (ARS/m²) = Costo por m de diámetro × Diámetro del cuerpo × 2.05
    // El factor 2.05 es una constante de ajuste para este cálculo específico.
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
      // El costo de las patas incluye un costo base y un adicional por cada metro por encima de 0.5m.
      const costoTotalPatasUSD = costoBasePataUSD + Math.max(0, altoPatas - 0.5) * costoAdicionalPorMetroPataUSD;
      currentCostoAccesoriosARS += 4 * costoTotalPatasUSD * dolarExchangeRate; // Asumiendo 4 patas
    }
    if (conFondoConico) {
      currentCostoAccesoriosARS += costoFondoConicoEditableARS;
    }
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

  }, [
    // Dependencias del useEffect: cualquier cambio en estos estados disparará un recálculo.
    volumen, // espesorChapa depende del volumen
    factorComercial,
    dolarExchangeRate,
    altoPatas,
    totalHorasManoObraInput,
    conCamisa, // Dependencia para el cálculo de la camisa
    conValvula,
    conVisor,
    conPatas,
    conFondoConico,
    conTapaCurva,
    densidadAceroInoxidable,
    precioKgAceroUSD,
    valorHoraManoObra,
    costoConsumiblesARS,
    costoPorMetroDiametroCamisaARS, // Nueva dependencia
    costoVisorEditableARS,
    costoFondoConicoEditableARS,
    costoConformadoTapaCurvaARS,
    costoValvulaUSD,
    costoBasePataUSD,
    costoAdicionalPorMetroPataUSD,
  ]);

  // --- 4. Función de Formato de Moneda ---
  // Formatea un valor numérico a una cadena de moneda en ARS, sin decimales.
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
              {/* Nuevo input editable para el costo por metro de diámetro de camisa */}
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
              {/* Se volvió a añadir costoUnitarioCamisaTermicaARS_m2 calculado como solo lectura */}
              <div className="flex flex-col">
                <label htmlFor="calculatedCostoUnitarioCamisaTermicaARS_m2" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Unitario Camisa Térmica (ARS/m²)
                </label>
                <input
                  type="number"
                  id="calculatedCostoUnitarioCamisaTermicaARS_m2"
                  value={calculatedCostoUnitarioCamisaTermicaARS_m2.toFixed(2)} // Mostrar valor calculado con 2 decimales
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
                <label htmlFor="costoFondoConicoEditableARS" className="text-sm font-medium text-gray-600 mb-1">
                  Costo Fondo Cónico (ARS)
                </label>
                <input
                  type="number"
                  id="costoFondoConicoEditableARS"
                  value={costoFondoConicoEditableARS}
                  onChange={(e) => setCostoFondoConicoEditableARS(Number(e.target.value))}
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
            </div>

            {/* Checkboxes */}
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
                  id="conFondoConico"
                  checked={conFondoConico}
                  onChange={(e) => setConFondoConico(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded-md"
                />
                <label htmlFor="conFondoConico" className="ml-2 text-gray-700">
                  Con Fondo Cónico
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
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Área Chapa Fondo Inferior ({conFondoConico ? 'Cónico' : 'Plano'}):</span>{' '}
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
                    {conFondoConico && (
                      <li>
                        Fondo Cónico: {formatCurrency(costoFondoConicoEditableARS)}
                      </li>
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