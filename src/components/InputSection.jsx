import React from 'react';
import { CONFIG } from '../config';

const InputSection = ({
  volumen,
  setVolumen,
  factorComercial,
  setFactorComercial,
  dolarExchangeRate,
  setDolarExchangeRate,
  altoPatas,
  setAltoPatas,
  totalHorasManoObraInput,
  setTotalHorasManoObraInput,
  conCamisa,
  setConCamisa,
  conValvula,
  setConValvula,
  conVisor,
  setConVisor,
  conPatas,
  setConPatas,
  bottomType,
  setBottomType,
  conTapaCurva,
  setConTapaCurva,
  densidadAceroInoxidable,
  setDensidadAceroInoxidable,
  precioKgAceroUSD,
  setPrecioKgAceroUSD,
  valorHoraManoObra,
  setValorHoraManoObra,
  costoConsumiblesARS,
  setCostoConsumiblesARS,
  costoPorMetroDiametroCamisaARS,
  setCostoPorMetroDiametroCamisaARS,
  costoVisorEditableARS,
  setCostoVisorEditableARS,
  costoConformadoTapaCurvaARS,
  setCostoConformadoTapaCurvaARS,
  costoValvulaUSD,
  setCostoValvulaUSD,
  costoBasePataUSD,
  setCostoBasePataUSD,
  costoAdicionalPorMetroPataUSD,
  setCostoAdicionalPorMetroPataUSD,
  costoFondoPlanoARS,
  setCostoFondoPlanoARS,
  costoFondoConicoARS,
  setCostoFondoConicoARS,
  costoFondoToriesfericoARS,
  setCostoFondoToriesfericoARS,
  costoFondoSemiEsfericoARS,
  setCostoFondoSemiEsfericoARS
}) => {
  return (
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
            <option value={CONFIG.BOTTOM_TYPES.CONICAL}>Cónico</option>
            <option value={CONFIG.BOTTOM_TYPES.TORISPHERICAL}>Torisférico</option>
            <option value={CONFIG.BOTTOM_TYPES.HEMISPHERICAL}>Semiesférico</option>
            <option value={CONFIG.BOTTOM_TYPES.FLAT}>Plano</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default InputSection; 