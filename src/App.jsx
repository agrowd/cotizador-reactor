import React, { useState, useMemo } from 'react';
import { CONFIG } from './config';
import { useReactorCalculations } from './hooks/useReactorCalculations';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import Reactor3D from './components/Reactor3D';

function App() {
  // Estados principales
  const [volumen, setVolumen] = useState(CONFIG.DEFAULTS.VOLUMEN);
  const [factorComercial, setFactorComercial] = useState(CONFIG.DEFAULTS.FACTOR_COMERCIAL);
  const [dolarExchangeRate, setDolarExchangeRate] = useState(CONFIG.DEFAULTS.DOLAR_EXCHANGE_RATE);
  const [altoPatas, setAltoPatas] = useState(CONFIG.DEFAULTS.ALTO_PATAS);
  const [totalHorasManoObraInput, setTotalHorasManoObraInput] = useState(CONFIG.DEFAULTS.HORAS_MANO_OBRA);

  // Opciones de geometría
  const [conCamisa, setConCamisa] = useState(true);
  const [conValvula, setConValvula] = useState(true);
  const [conVisor, setConVisor] = useState(false);
  const [conPatas, setConPatas] = useState(true);
  const [bottomType, setBottomType] = useState(CONFIG.BOTTOM_TYPES.CONICAL);
  const [conTapaCurva, setConTapaCurva] = useState(false);

  // Precios base editables
  const [densidadAceroInoxidable, setDensidadAceroInoxidable] = useState(CONFIG.DEFAULTS.DENSIDAD_ACERO);
  const [precioKgAceroUSD, setPrecioKgAceroUSD] = useState(CONFIG.DEFAULTS.PRECIO_KG_ACERO_USD);
  const [valorHoraManoObra, setValorHoraManoObra] = useState(CONFIG.DEFAULTS.VALOR_HORA_MANO_OBRA);
  const [costoConsumiblesARS, setCostoConsumiblesARS] = useState(CONFIG.DEFAULTS.COSTO_CONSUMIBLES);
  const [costoPorMetroDiametroCamisaARS, setCostoPorMetroDiametroCamisaARS] = useState(CONFIG.DEFAULTS.COSTO_METRO_DIAMETRO_CAMISA);
  const [costoVisorEditableARS, setCostoVisorEditableARS] = useState(CONFIG.DEFAULTS.COSTO_VISOR);
  const [costoConformadoTapaCurvaARS, setCostoConformadoTapaCurvaARS] = useState(CONFIG.DEFAULTS.COSTO_CONFORMADO_TAPA_CURVA);
  const [costoValvulaUSD, setCostoValvulaUSD] = useState(CONFIG.DEFAULTS.COSTO_VALVULA_USD);
  const [costoBasePataUSD, setCostoBasePataUSD] = useState(CONFIG.DEFAULTS.COSTO_BASE_PATA_USD);
  const [costoAdicionalPorMetroPataUSD, setCostoAdicionalPorMetroPataUSD] = useState(CONFIG.DEFAULTS.COSTO_ADICIONAL_PATA_USD);
  const [costoFondoPlanoARS, setCostoFondoPlanoARS] = useState(CONFIG.DEFAULTS.COSTO_FONDO_PLANO);
  const [costoFondoConicoARS, setCostoFondoConicoARS] = useState(CONFIG.DEFAULTS.COSTO_FONDO_CONICO);
  const [costoFondoToriesfericoARS, setCostoFondoToriesfericoARS] = useState(CONFIG.DEFAULTS.COSTO_FONDO_TORIESFERICO);
  const [costoFondoSemiEsfericoARS, setCostoFondoSemiEsfericoARS] = useState(CONFIG.DEFAULTS.COSTO_FONDO_SEMIESFERICO);

  // Determinar espesor de chapa basado en volumen
  const espesorChapa = useMemo(() => {
    const espesor = CONFIG.ESPESORES.find(e => volumen <= e.maxVolumen);
    return espesor ? espesor.espesor : 5;
  }, [volumen]);

  // Usar el hook personalizado para los cálculos
  const { dimensions, areas, totalVolume, costs } = useReactorCalculations({
    volumen,
    bottomType,
    conCamisa,
    conTapaCurva,
    espesorChapa,
    densidadAceroInoxidable,
    precioKgAceroUSD,
    dolarExchangeRate,
    totalHorasManoObraInput,
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
    conValvula,
    conVisor,
    conPatas,
    altoPatas,
    factorComercial
  });

  const [modoPrueba3D, setModoPrueba3D] = useState(false);

  // Resultados
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
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="modoPrueba3D"
            checked={modoPrueba3D}
            onChange={e => setModoPrueba3D(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="modoPrueba3D" className="text-lg text-gray-700 font-semibold">
            Activar modo prueba 3D (visualización interactiva)
          </label>
        </div>
        {modoPrueba3D && (
          <div className="mb-8">
            <Reactor3D
              diametro={dimensions.calculatedD}
              alturaCilindro={dimensions.calculatedH}
              alturaFondo={dimensions.bottomHeightContribution}
              alturaTotal={dimensions.calculatedH + dimensions.bottomHeightContribution}
              altoPatas={altoPatas}
              bottomType={bottomType}
              conCamisa={conCamisa}
              conValvula={conValvula}
              conVisor={conVisor}
              conPatas={conPatas}
              conTapaCurva={conTapaCurva}
              espesorChapa={espesorChapa / 1000}
              modoPrueba={modoPrueba3D}
            />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <InputSection
            volumen={volumen}
            setVolumen={setVolumen}
            factorComercial={factorComercial}
            setFactorComercial={setFactorComercial}
            dolarExchangeRate={dolarExchangeRate}
            setDolarExchangeRate={setDolarExchangeRate}
            altoPatas={altoPatas}
            setAltoPatas={setAltoPatas}
            totalHorasManoObraInput={totalHorasManoObraInput}
            setTotalHorasManoObraInput={setTotalHorasManoObraInput}
            conCamisa={conCamisa}
            setConCamisa={setConCamisa}
            conValvula={conValvula}
            setConValvula={setConValvula}
            conVisor={conVisor}
            setConVisor={setConVisor}
            conPatas={conPatas}
            setConPatas={setConPatas}
            bottomType={bottomType}
            setBottomType={setBottomType}
            conTapaCurva={conTapaCurva}
            setConTapaCurva={setConTapaCurva}
            densidadAceroInoxidable={densidadAceroInoxidable}
            setDensidadAceroInoxidable={setDensidadAceroInoxidable}
            precioKgAceroUSD={precioKgAceroUSD}
            setPrecioKgAceroUSD={setPrecioKgAceroUSD}
            valorHoraManoObra={valorHoraManoObra}
            setValorHoraManoObra={setValorHoraManoObra}
            costoConsumiblesARS={costoConsumiblesARS}
            setCostoConsumiblesARS={setCostoConsumiblesARS}
            costoPorMetroDiametroCamisaARS={costoPorMetroDiametroCamisaARS}
            setCostoPorMetroDiametroCamisaARS={setCostoPorMetroDiametroCamisaARS}
            costoVisorEditableARS={costoVisorEditableARS}
            setCostoVisorEditableARS={setCostoVisorEditableARS}
            costoConformadoTapaCurvaARS={costoConformadoTapaCurvaARS}
            setCostoConformadoTapaCurvaARS={setCostoConformadoTapaCurvaARS}
            costoValvulaUSD={costoValvulaUSD}
            setCostoValvulaUSD={setCostoValvulaUSD}
            costoBasePataUSD={costoBasePataUSD}
            setCostoBasePataUSD={setCostoBasePataUSD}
            costoAdicionalPorMetroPataUSD={costoAdicionalPorMetroPataUSD}
            setCostoAdicionalPorMetroPataUSD={setCostoAdicionalPorMetroPataUSD}
            costoFondoPlanoARS={costoFondoPlanoARS}
            setCostoFondoPlanoARS={setCostoFondoPlanoARS}
            costoFondoConicoARS={costoFondoConicoARS}
            setCostoFondoConicoARS={setCostoFondoConicoARS}
            costoFondoToriesfericoARS={costoFondoToriesfericoARS}
            setCostoFondoToriesfericoARS={setCostoFondoToriesfericoARS}
            costoFondoSemiEsfericoARS={costoFondoSemiEsfericoARS}
            setCostoFondoSemiEsfericoARS={setCostoFondoSemiEsfericoARS}
          />

          <ResultsSection
            dimensions={dimensions}
            areas={areas}
            totalVolume={totalVolume}
            costs={costs}
            factorComercial={factorComercial}
            conCamisa={conCamisa}
            conValvula={conValvula}
            conPatas={conPatas}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
