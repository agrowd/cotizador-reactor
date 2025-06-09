import React, { useState, useEffect, useMemo } from 'react';

const BOTTOM_TYPES = {
  CONICAL: 'conico',
  TORISPHERICAL: 'toriesferico',
  HEMISPHERICAL: 'semiEsferico',
  FLAT: 'plano'
};

function App() {
  // Estados principales
  const [volumen, setVolumen] = useState(1000);
  const [factorComercial, setFactorComercial] = useState(3);
  const [dolarExchangeRate, setDolarExchangeRate] = useState(1120);
  const [altoPatas, setAltoPatas] = useState(0.5);
  const [totalHorasManoObraInput, setTotalHorasManoObraInput] = useState(80);

  // Opciones de geometría
  const [conCamisa, setConCamisa] = useState(true);
  const [conValvula, setConValvula] = useState(true);
  const [conVisor, setConVisor] = useState(false);
  const [conPatas, setConPatas] = useState(true);
  const [bottomType, setBottomType] = useState(BOTTOM_TYPES.CONICAL);
  const [conTapaCurva, setConTapaCurva] = useState(false);

  // Precios base editables
  const [densidadAceroInoxidable, setDensidadAceroInoxidable] = useState(8800);
  const [precioKgAceroUSD, setPrecioKgAceroUSD] = useState(6.36);
  const [valorHoraManoObra, setValorHoraManoObra] = useState(6250);
  const [costoConsumiblesARS, setCostoConsumiblesARS] = useState(150000);
  const [costoPorMetroDiametroCamisaARS, setCostoPorMetroDiametroCamisaARS] = useState(5000);
  const [costoVisorEditableARS, setCostoVisorEditableARS] = useState(40000);
  const [costoConformadoTapaCurvaARS, setCostoConformadoTapaCurvaARS] = useState(250000);
  const [costoValvulaUSD, setCostoValvulaUSD] = useState(60.02);
  const [costoBasePataUSD, setCostoBasePataUSD] = useState(20.09);
  const [costoAdicionalPorMetroPataUSD, setCostoAdicionalPorMetroPataUSD] = useState(10);
  const [costoFondoPlanoARS, setCostoFondoPlanoARS] = useState(50000);
  const [costoFondoConicoARS, setCostoFondoConicoARS] = useState(350000);
  const [costoFondoToriesfericoARS, setCostoFondoToriesfericoARS] = useState(450000);
  const [costoFondoSemiEsfericoARS, setCostoFondoSemiEsfericoARS] = useState(600000);

  // Resultados calculados
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
  const [costoCamisaTermicaARS, setCostoCamisaTermicaARS] = useState(0);
  const [costoValvulaARS, setCostoValvulaARS] = useState(0);
  const [costoPatasARS, setCostoPatasARS] = useState(0);
  const [costoFondoARS, setCostoFondoARS] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [calculatedEspesorChapa, setCalculatedEspesorChapa] = useState(0);
  const [calculatedCostoUnitarioCamisaTermicaARS_m2, setCalculatedCostoUnitarioCamisaTermicaARS_m2] = useState(0);
  const [areaChapaCamisaTermica, setAreaChapaCamisaTermica] = useState(0);
  const [totalTankCapacityLiters, setTotalTankCapacityLiters] = useState(0);

  // Constantes geométricas
  const H_CONE_RATIO_TO_R = 25 / 47.5;
  const R_CONE_BOTTOM_RATIO_TO_R = 7.5 / 47.5;
  const JACKET_DIAMETER_INCREASE_FACTOR = 1.05;
  const TORISPHERICAL_HEAD_DEPTH_RATIO = 0.25;
  const TORISPHERICAL_AREA_FACTOR = 1.12;
  const HEMISPHERICAL_HEAD_HEIGHT_RATIO = 0.5;
  const CYLINDER_HEIGHT_RATIO = 1.2;

  // Determinar espesor de chapa basado en volumen
  const espesorChapa = useMemo(() => {
    if (volumen <= 500) return 2;
    if (volumen <= 2000) return 3;
    if (volumen <= 5000) return 4;
    return 5;
  }, [volumen]);

  // Calcular dimensiones geométricas
  const dimensions = useMemo(() => {
    const volumen_m3 = volumen / 1000;
    let calculatedD = 0;
    let calculatedR = 0;
    let bottomHeightContribution = 0;
    
    // Calcular coeficiente de volumen según tipo de fondo
    let C_volumen_fondo_parte_D3 = 0;
    
    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        C_volumen_fondo_parte_D3 = (1 / 3) * Math.PI * H_CONE_RATIO_TO_R * 
          (1 + Math.pow(R_CONE_BOTTOM_RATIO_TO_R, 2) + R_CONE_BOTTOM_RATIO_TO_R) / 8;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        C_volumen_fondo_parte_D3 = Math.PI / 24;
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        C_volumen_fondo_parte_D3 = Math.PI / 12;
        break;
      case BOTTOM_TYPES.FLAT:
      default:
        C_volumen_fondo_parte_D3 = 0;
        break;
    }

    // Calcular diámetro basado en volumen total
    const C_volumen_cilindro_parte_D3 = 0.3 * Math.PI;
    const final_total_volume_coefficient_D3 = C_volumen_cilindro_parte_D3 + C_volumen_fondo_parte_D3;
    calculatedD = Math.pow(volumen_m3 / final_total_volume_coefficient_D3, 1 / 3);
    calculatedR = calculatedD / 2;

    // Calcular altura del cilindro
    const calculatedH = CYLINDER_HEIGHT_RATIO * calculatedD;
    
    // Calcular contribución de altura del fondo
    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        bottomHeightContribution = calculatedR * H_CONE_RATIO_TO_R;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        bottomHeightContribution = calculatedD * TORISPHERICAL_HEAD_DEPTH_RATIO;
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        bottomHeightContribution = calculatedD * HEMISPHERICAL_HEAD_HEIGHT_RATIO;
        break;
      case BOTTOM_TYPES.FLAT:
      default:
        bottomHeightContribution = 0;
        break;
    }

    return {
      calculatedD,
      calculatedR,
      calculatedH,
      bottomHeightContribution
    };
  }, [volumen, bottomType]);

  // Calcular áreas
  const areas = useMemo(() => {
    const { calculatedD, calculatedR, calculatedH } = dimensions;
    const jacketDiameter = calculatedD * JACKET_DIAMETER_INCREASE_FACTOR;
    
    // Área cuerpo cilíndrico
    const currentAreaChapaCuerpo = Math.PI * calculatedD * calculatedH;
    
    // Área camisa térmica
    let currentAreaChapaCamisaTermica = 0;
    if (conCamisa) {
      currentAreaChapaCamisaTermica = Math.PI * jacketDiameter * calculatedH;
    }
    
    // Área tapa superior
    let currentAreaTapaSuperior = conTapaCurva 
      ? TORISPHERICAL_AREA_FACTOR * Math.PI * Math.pow(calculatedR, 2) 
      : Math.PI * Math.pow(calculatedR, 2);
    
    // Área fondo inferior
    let currentAreaFondoInferior = 0;
    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        const R1_area_cone = calculatedR;
        const R2_area_cone = calculatedR * R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_area = calculatedR * H_CONE_RATIO_TO_R;
        const slantHeight_area_cone = Math.sqrt(Math.pow(hCone_area, 2) + Math.pow(R1_area_cone - R2_area_cone, 2));
        currentAreaFondoInferior = Math.PI * (R1_area_cone + R2_area_cone) * slantHeight_area_cone;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        currentAreaFondoInferior = TORISPHERICAL_AREA_FACTOR * Math.PI * Math.pow(calculatedR, 2);
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        currentAreaFondoInferior = 2 * Math.PI * Math.pow(calculatedR, 2);
        break;
      case BOTTOM_TYPES.FLAT:
      default:
        currentAreaFondoInferior = Math.PI * Math.pow(calculatedR, 2);
        break;
    }
    
    // Área total
    const currentAreaChapaTotal = currentAreaChapaCuerpo + 
      currentAreaTapaSuperior + 
      currentAreaFondoInferior + 
      currentAreaChapaCamisaTermica;
    
    return {
      currentAreaChapaCuerpo,
      currentAreaChapaCamisaTermica,
      currentAreaTapaSuperior,
      currentAreaFondoInferior,
      currentAreaChapaTotal
    };
  }, [dimensions, conCamisa, conTapaCurva, bottomType]);

  // Calcular volumen total del tanque
  const totalVolume = useMemo(() => {
    const { calculatedR, calculatedH, calculatedD } = dimensions;
    const finalCylinderVolume_m3 = Math.PI * Math.pow(calculatedR, 2) * calculatedH;
    let finalBottomVolume_m3 = 0;

    switch (bottomType) {
      case BOTTOM_TYPES.CONICAL:
        const R1_final_cone = calculatedR;
        const R2_final_cone = calculatedR * R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_final = calculatedR * H_CONE_RATIO_TO_R;
        finalBottomVolume_m3 = (1 / 3) * Math.PI * hCone_final * 
          (Math.pow(R1_final_cone, 2) + (R1_final_cone * R2_final_cone) + Math.pow(R2_final_cone, 2));
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        finalBottomVolume_m3 = (Math.PI / 24) * Math.pow(calculatedD, 3);
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        finalBottomVolume_m3 = (2 / 3) * Math.PI * Math.pow(calculatedR, 3);
        break;
      case BOTTOM_TYPES.FLAT:
        finalBottomVolume_m3 = 0;
        break;
      default:
        finalBottomVolume_m3 = 0;
        break;
    }
    
    return (finalCylinderVolume_m3 + finalBottomVolume_m3) * 1000;
  }, [dimensions, bottomType]);

  // Efecto principal para cálculos
  useEffect(() => {
    const espesor_m = espesorChapa / 1000;

    setDiametro(dimensions.calculatedD);
    setAlturaCilindro(dimensions.calculatedH);
    setAlturaTotalReactor(dimensions.calculatedH + dimensions.bottomHeightContribution);

    setAreaChapaCuerpo(areas.currentAreaChapaCuerpo);
    setAreaChapaCamisaTermica(areas.currentAreaChapaCamisaTermica);
    setAreaChapaTapaSuperior(areas.currentAreaTapaSuperior);
    setAreaChapaFondoInferior(areas.currentAreaFondoInferior);
    setAreaChapaTotal(areas.currentAreaChapaTotal);

    // Calcular peso y costo de chapa
    const calculatedKgChapa = areas.currentAreaChapaTotal * espesor_m * densidadAceroInoxidable;
    const calculatedCostoChapaARS = calculatedKgChapa * precioKgAceroUSD * dolarExchangeRate;
    setKgChapa(calculatedKgChapa);
    setCostoChapaARS(calculatedCostoChapaARS);

    // Calcular mano de obra
    const calculatedManoObraARS = totalHorasManoObraInput * valorHoraManoObra;
    setCostoManoObraCalculadoARS(calculatedManoObraARS);

    // Calcular costo de accesorios
    let currentCostoAccesoriosARS = 0;
    let costoCamisaTemp = 0;
    let costoValvulaTemp = 0;
    let costoPatasTemp = 0;
    let costoFondoTemp = 0;

    // Costo camisa térmica
    const currentCostoUnitarioCamisaTermicaARS_m2 = costoPorMetroDiametroCamisaARS * dimensions.calculatedD * 2.05;
    setCalculatedCostoUnitarioCamisaTermicaARS_m2(currentCostoUnitarioCamisaTermicaARS_m2);

    if (conCamisa) {
      costoCamisaTemp = areas.currentAreaChapaCamisaTermica * currentCostoUnitarioCamisaTermicaARS_m2;
      currentCostoAccesoriosARS += costoCamisaTemp;
    }
    
    // Costo válvula
    if (conValvula) {
      costoValvulaTemp = costoValvulaUSD * dolarExchangeRate;
      currentCostoAccesoriosARS += costoValvulaTemp;
    }
    
    // Costo visor
    if (conVisor) {
      currentCostoAccesoriosARS += costoVisorEditableARS;
    }
    
    // Costo patas
    if (conPatas) {
      const costoTotalPatasUSD = costoBasePataUSD + Math.max(0, altoPatas - 0.5) * costoAdicionalPorMetroPataUSD;
      costoPatasTemp = 4 * costoTotalPatasUSD * dolarExchangeRate;
      currentCostoAccesoriosARS += costoPatasTemp;
    }
    
    // Costo fondo
    switch (bottomType) {
      case BOTTOM_TYPES.FLAT:
        costoFondoTemp = costoFondoPlanoARS;
        break;
      case BOTTOM_TYPES.CONICAL:
        costoFondoTemp = costoFondoConicoARS;
        break;
      case BOTTOM_TYPES.TORISPHERICAL:
        costoFondoTemp = costoFondoToriesfericoARS;
        break;
      case BOTTOM_TYPES.HEMISPHERICAL:
        costoFondoTemp = costoFondoSemiEsfericoARS;
        break;
      default:
        costoFondoTemp = 0;
    }
    currentCostoAccesoriosARS += costoFondoTemp;
    
    // Costo tapa curva
    if (conTapaCurva) {
      currentCostoAccesoriosARS += costoConformadoTapaCurvaARS;
    }
    
    // Costo consumibles
    currentCostoAccesoriosARS += costoConsumiblesARS;
    
    // Actualizar estados de desglose
    setCostoCamisaTermicaARS(costoCamisaTemp);
    setCostoValvulaARS(costoValvulaTemp);
    setCostoPatasARS(costoPatasTemp);
    setCostoFondoARS(costoFondoTemp);
    setCostoAccesoriosARS(currentCostoAccesoriosARS);

    // Calcular precios finales
    const calculatedSubtotal = calculatedCostoChapaARS + calculatedManoObraARS + currentCostoAccesoriosARS;
    const calculatedPrecioFinal = calculatedSubtotal * factorComercial;
    setSubtotal(calculatedSubtotal);
    setPrecioFinal(calculatedPrecioFinal);

    // Calcular capacidad total del tanque
    setTotalTankCapacityLiters(totalVolume);
    setCalculatedEspesorChapa(espesorChapa);

  }, [
    dimensions,
    areas,
    totalVolume,
    espesorChapa,
    factorComercial,
    dolarExchangeRate,
    altoPatas,
    totalHorasManoObraInput,
    conCamisa,
    conValvula,
    conVisor,
    conPatas,
    conTapaCurva,
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
    costoFondoSemiEsfericoARS
  ]);

  // Función de formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Renderizado
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 font-sans flex justify-center items-start">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-7xl w-full my-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Cotizador Paramétrico de Reactor
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Sección de parámetros de entrada */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b-2 border-blue-300 pb-2">
              Parámetros de Entrada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volumen (litros)
                </label>
                <input
                  type="number"
                  value={volumen}
                  onChange={(e) => setVolumen(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Factor Comercial
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={factorComercial}
                  onChange={(e) => setFactorComercial(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cambio (USD a ARS)
                </label>
                <input
                  type="number"
                  value={dolarExchangeRate}
                  onChange={(e) => setDolarExchangeRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alto de Patas (m)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={altoPatas}
                  onChange={(e) => setAltoPatas(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horas de Mano de Obra
                </label>
                <input
                  type="number"
                  value={totalHorasManoObraInput}
                  onChange={(e) => setTotalHorasManoObraInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b border-gray-300 pb-2">
              Precios Base Editables
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Densidad Acero Inox. (kg/m³)
                </label>
                <input
                  type="number"
                  value={densidadAceroInoxidable}
                  onChange={(e) => setDensidadAceroInoxidable(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Kg Acero (USD/kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={precioKgAceroUSD}
                  onChange={(e) => setPrecioKgAceroUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Hora Mano Obra (ARS/h)
                </label>
                <input
                  type="number"
                  value={valorHoraManoObra}
                  onChange={(e) => setValorHoraManoObra(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Consumibles (ARS)
                </label>
                <input
                  type="number"
                  value={costoConsumiblesARS}
                  onChange={(e) => setCostoConsumiblesARS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo por Metro Diámetro Camisa (ARS/m)
                </label>
                <input
                  type="number"
                  value={costoPorMetroDiametroCamisaARS}
                  onChange={(e) => setCostoPorMetroDiametroCamisaARS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Visor (ARS)
                </label>
                <input
                  type="number"
                  value={costoVisorEditableARS}
                  onChange={(e) => setCostoVisorEditableARS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Fondo Cónico (ARS)
                </label>
                <input
                  type="number"
                  value={costoFondoConicoARS}
                  onChange={(e) => setCostoFondoConicoARS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Conformado Tapa Curva (ARS)
                </label>
                <input
                  type="number"
                  value={costoConformadoTapaCurvaARS}
                  onChange={(e) => setCostoConformadoTapaCurvaARS(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Válvula (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={costoValvulaUSD}
                  onChange={(e) => setCostoValvulaUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Base Pata (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={costoBasePataUSD}
                  onChange={(e) => setCostoBasePataUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Adicional/Metro Pata (USD/m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={costoAdicionalPorMetroPataUSD}
                  onChange={(e) => setCostoAdicionalPorMetroPataUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

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
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conCamisa" className="ml-2 block text-sm text-gray-700">
                  Con Camisa Térmica
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conValvula"
                  checked={conValvula}
                  onChange={(e) => setConValvula(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conValvula" className="ml-2 block text-sm text-gray-700">
                  Con Válvula
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conVisor"
                  checked={conVisor}
                  onChange={(e) => setConVisor(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conVisor" className="ml-2 block text-sm text-gray-700">
                  Con Visor
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conPatas"
                  checked={conPatas}
                  onChange={(e) => setConPatas(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conPatas" className="ml-2 block text-sm text-gray-700">
                  Con Patas
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="conTapaCurva"
                  checked={conTapaCurva}
                  onChange={(e) => setConTapaCurva(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="conTapaCurva" className="ml-2 block text-sm text-gray-700">
                  Tapa Superior Curva
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Fondo
                </label>
                <select
                  value={bottomType}
                  onChange={(e) => setBottomType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={BOTTOM_TYPES.CONICAL}>Cónico</option>
                  <option value={BOTTOM_TYPES.TORISPHERICAL}>Torisférico</option>
                  <option value={BOTTOM_TYPES.HEMISPHERICAL}>Semiesférico</option>
                  <option value={BOTTOM_TYPES.FLAT}>Plano</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección de resultados */}
          <div className="bg-blue-50 p-6 rounded-xl shadow-inner">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b-2 border-blue-400 pb-2">
              Resultados Calculados
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Dimensiones Geométricas</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Diámetro:</span> {diametro.toFixed(3)} m
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Altura Cilindro:</span> {alturaCilindro.toFixed(3)} m
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Altura Total Reactor:</span> {alturaTotalReactor.toFixed(3)} m
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Espesor Chapa:</span> {calculatedEspesorChapa.toFixed(1)} mm
              </p>
              <p className="text-gray-800 font-bold text-lg mt-2">
                <span className="font-medium">Capacidad Total Tanque:</span> {totalTankCapacityLiters.toFixed(0)} Litros
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Áreas Calculadas (m²)</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Cuerpo:</span> {areaChapaCuerpo.toFixed(2)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Tapa Superior:</span> {areaChapaTapaSuperior.toFixed(2)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Fondo Inferior:</span> {areaChapaFondoInferior.toFixed(2)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Camisa Térmica:</span> {areaChapaCamisaTermica.toFixed(2)}
              </p>
              <p className="text-gray-800 font-bold">
                <span className="font-medium">Área Total:</span> {areaChapaTotal.toFixed(2)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Peso y Costo de Chapa</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Kg Chapa:</span> {kgChapa.toFixed(2)} kg
              </p>
              <p className="text-gray-800 font-bold">
                <span className="font-medium">Costo Chapa:</span> {formatCurrency(costoChapaARS)}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Desglose de Costos</h3>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Costo Chapa:</span> {formatCurrency(costoChapaARS)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Costo Mano de Obra:</span> {formatCurrency(costoManoObraCalculadoARS)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Costo Consumibles:</span> {formatCurrency(costoConsumiblesARS)}
              </p>
              <p className="text-gray-800 mb-1">
                <span className="font-medium">Accesorios:</span> {formatCurrency(costoAccesoriosARS)}
              </p>
              
              <div className="ml-4 mt-2 space-y-1">
                {conCamisa && (
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Camisa Térmica:</span> {formatCurrency(costoCamisaTermicaARS)}
                    <span className="text-xs text-gray-500 ml-1">(${calculatedCostoUnitarioCamisaTermicaARS_m2.toFixed(2)}/m²)</span>
                  </p>
                )}
                {conValvula && (
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Válvula:</span> {formatCurrency(costoValvulaARS)}
                  </p>
                )}
                {conPatas && (
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Patas:</span> {formatCurrency(costoPatasARS)}
                  </p>
                )}
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Fondo:</span> {formatCurrency(costoFondoARS)}
                </p>
              </div>
              
              <p className="text-gray-800 font-bold text-lg mt-2">
                <span className="font-medium">Subtotal:</span> {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">Precio Final</h3>
              <p className="text-3xl font-extrabold text-white text-center">
                {formatCurrency(precioFinal)}
              </p>
              <p className="text-white text-sm text-center mt-1">
                (Incluye factor comercial de {factorComercial}x)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;