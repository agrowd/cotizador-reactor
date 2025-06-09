import { useMemo } from 'react';
import { CONFIG } from '../config';

export const useReactorCalculations = ({
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
}) => {
  // Calcular dimensiones geométricas
  const dimensions = useMemo(() => {
    const volumen_m3 = volumen / 1000;
    let calculatedD = 0;
    let calculatedR = 0;
    let bottomHeightContribution = 0;
    
    // Calcular coeficiente de volumen según tipo de fondo
    let C_volumen_fondo_parte_D3 = 0;
    
    switch (bottomType) {
      case CONFIG.BOTTOM_TYPES.CONICAL:
        C_volumen_fondo_parte_D3 = (1 / 3) * Math.PI * CONFIG.GEOMETRY_RATIOS.H_CONE_RATIO_TO_R * 
          (1 + Math.pow(CONFIG.GEOMETRY_RATIOS.R_CONE_BOTTOM_RATIO_TO_R, 2) + CONFIG.GEOMETRY_RATIOS.R_CONE_BOTTOM_RATIO_TO_R) / 8;
        break;
      case CONFIG.BOTTOM_TYPES.TORISPHERICAL:
        C_volumen_fondo_parte_D3 = Math.PI / 24;
        break;
      case CONFIG.BOTTOM_TYPES.HEMISPHERICAL:
        C_volumen_fondo_parte_D3 = Math.PI / 12;
        break;
      case CONFIG.BOTTOM_TYPES.FLAT:
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
    const calculatedH = CONFIG.GEOMETRY_RATIOS.CYLINDER_HEIGHT_RATIO * calculatedD;
    
    // Calcular contribución de altura del fondo
    switch (bottomType) {
      case CONFIG.BOTTOM_TYPES.CONICAL:
        bottomHeightContribution = calculatedR * CONFIG.GEOMETRY_RATIOS.H_CONE_RATIO_TO_R;
        break;
      case CONFIG.BOTTOM_TYPES.TORISPHERICAL:
        bottomHeightContribution = calculatedD * CONFIG.GEOMETRY_RATIOS.TORISPHERICAL_HEAD_DEPTH_RATIO;
        break;
      case CONFIG.BOTTOM_TYPES.HEMISPHERICAL:
        bottomHeightContribution = calculatedD * CONFIG.GEOMETRY_RATIOS.HEMISPHERICAL_HEAD_HEIGHT_RATIO;
        break;
      case CONFIG.BOTTOM_TYPES.FLAT:
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
    const jacketDiameter = calculatedD * CONFIG.GEOMETRY_RATIOS.JACKET_DIAMETER_INCREASE_FACTOR;
    
    // Área cuerpo cilíndrico
    const currentAreaChapaCuerpo = Math.PI * calculatedD * calculatedH;
    
    // Área camisa térmica
    let currentAreaChapaCamisaTermica = 0;
    if (conCamisa) {
      currentAreaChapaCamisaTermica = Math.PI * jacketDiameter * calculatedH;
    }
    
    // Área tapa superior
    let currentAreaTapaSuperior = conTapaCurva 
      ? CONFIG.GEOMETRY_RATIOS.TORISPHERICAL_AREA_FACTOR * Math.PI * Math.pow(calculatedR, 2) 
      : Math.PI * Math.pow(calculatedR, 2);
    
    // Área fondo inferior
    let currentAreaFondoInferior = 0;
    switch (bottomType) {
      case CONFIG.BOTTOM_TYPES.CONICAL:
        const R1_area_cone = calculatedR;
        const R2_area_cone = calculatedR * CONFIG.GEOMETRY_RATIOS.R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_area = calculatedR * CONFIG.GEOMETRY_RATIOS.H_CONE_RATIO_TO_R;
        const slantHeight_area_cone = Math.sqrt(Math.pow(hCone_area, 2) + Math.pow(R1_area_cone - R2_area_cone, 2));
        currentAreaFondoInferior = Math.PI * (R1_area_cone + R2_area_cone) * slantHeight_area_cone;
        break;
      case CONFIG.BOTTOM_TYPES.TORISPHERICAL:
        currentAreaFondoInferior = CONFIG.GEOMETRY_RATIOS.TORISPHERICAL_AREA_FACTOR * Math.PI * Math.pow(calculatedR, 2);
        break;
      case CONFIG.BOTTOM_TYPES.HEMISPHERICAL:
        currentAreaFondoInferior = 2 * Math.PI * Math.pow(calculatedR, 2);
        break;
      case CONFIG.BOTTOM_TYPES.FLAT:
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
      case CONFIG.BOTTOM_TYPES.CONICAL:
        const R1_final_cone = calculatedR;
        const R2_final_cone = calculatedR * CONFIG.GEOMETRY_RATIOS.R_CONE_BOTTOM_RATIO_TO_R;
        const hCone_final = calculatedR * CONFIG.GEOMETRY_RATIOS.H_CONE_RATIO_TO_R;
        finalBottomVolume_m3 = (1 / 3) * Math.PI * hCone_final * 
          (Math.pow(R1_final_cone, 2) + (R1_final_cone * R2_final_cone) + Math.pow(R2_final_cone, 2));
        break;
      case CONFIG.BOTTOM_TYPES.TORISPHERICAL:
        finalBottomVolume_m3 = (Math.PI / 24) * Math.pow(calculatedD, 3);
        break;
      case CONFIG.BOTTOM_TYPES.HEMISPHERICAL:
        finalBottomVolume_m3 = (2 / 3) * Math.PI * Math.pow(calculatedR, 3);
        break;
      case CONFIG.BOTTOM_TYPES.FLAT:
        finalBottomVolume_m3 = 0;
        break;
      default:
        finalBottomVolume_m3 = 0;
        break;
    }
    
    return (finalCylinderVolume_m3 + finalBottomVolume_m3) * 1000;
  }, [dimensions, bottomType]);

  // Calcular costos
  const costs = useMemo(() => {
    const espesor_m = espesorChapa / 1000;
    
    // Calcular peso y costo de chapa
    const calculatedKgChapa = areas.currentAreaChapaTotal * espesor_m * densidadAceroInoxidable;
    const calculatedCostoChapaARS = calculatedKgChapa * precioKgAceroUSD * dolarExchangeRate;

    // Calcular mano de obra
    const calculatedManoObraARS = totalHorasManoObraInput * valorHoraManoObra;

    // Calcular costo de accesorios
    let currentCostoAccesoriosARS = 0;
    let costoCamisaTemp = 0;
    let costoValvulaTemp = 0;
    let costoPatasTemp = 0;
    let costoFondoTemp = 0;

    // Costo camisa térmica
    const currentCostoUnitarioCamisaTermicaARS_m2 = costoPorMetroDiametroCamisaARS * dimensions.calculatedD * 2.05;

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
      case CONFIG.BOTTOM_TYPES.FLAT:
        costoFondoTemp = costoFondoPlanoARS;
        break;
      case CONFIG.BOTTOM_TYPES.CONICAL:
        costoFondoTemp = costoFondoConicoARS;
        break;
      case CONFIG.BOTTOM_TYPES.TORISPHERICAL:
        costoFondoTemp = costoFondoToriesfericoARS;
        break;
      case CONFIG.BOTTOM_TYPES.HEMISPHERICAL:
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
    
    // Calcular precios finales
    const calculatedSubtotal = calculatedCostoChapaARS + calculatedManoObraARS + currentCostoAccesoriosARS;
    const calculatedPrecioFinal = calculatedSubtotal * factorComercial;

    return {
      kgChapa: calculatedKgChapa,
      costoChapaARS: calculatedCostoChapaARS,
      costoManoObraARS: calculatedManoObraARS,
      costoAccesoriosARS: currentCostoAccesoriosARS,
      costoCamisaTermicaARS: costoCamisaTemp,
      costoValvulaARS: costoValvulaTemp,
      costoPatasARS: costoPatasTemp,
      costoFondoARS: costoFondoTemp,
      costoUnitarioCamisaTermicaARS_m2: currentCostoUnitarioCamisaTermicaARS_m2,
      subtotal: calculatedSubtotal,
      precioFinal: calculatedPrecioFinal
    };
  }, [
    areas,
    dimensions,
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
    conCamisa,
    conValvula,
    conVisor,
    conPatas,
    conTapaCurva,
    bottomType,
    altoPatas,
    factorComercial
  ]);

  return {
    dimensions,
    areas,
    totalVolume,
    costs
  };
}; 