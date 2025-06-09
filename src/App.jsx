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
              diametro={dimensions.diametro}
              alturaCilindro={dimensions.alturaCilindro}
              alturaFondo={dimensions.alturaFondo}
              alturaTotal={dimensions.alturaCilindro + dimensions.alturaFondo + (conTapaCurva ? dimensions.alturaCilindro * 0.22 : dimensions.alturaCilindro * 0.12) + altoPatas}
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