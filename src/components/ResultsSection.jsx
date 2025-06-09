import React from 'react';
import { CONFIG } from '../config';

const ResultsSection = ({
  dimensions,
  areas,
  totalVolume,
  costs,
  factorComercial,
  conCamisa,
  conValvula,
  conPatas
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat(
      CONFIG.UI.CURRENCY_FORMAT.locale,
      CONFIG.UI.CURRENCY_FORMAT
    ).format(value);
  };

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-inner">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b-2 border-blue-400 pb-2">
        Resultados Calculados
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Dimensiones Geométricas</h3>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Diámetro:</span> {dimensions.calculatedD.toFixed(CONFIG.UI.DECIMAL_PLACES.DIMENSIONS)} m
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Altura Cilindro:</span> {dimensions.calculatedH.toFixed(CONFIG.UI.DECIMAL_PLACES.DIMENSIONS)} m
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Altura Total Reactor:</span> {(dimensions.calculatedH + dimensions.bottomHeightContribution).toFixed(CONFIG.UI.DECIMAL_PLACES.DIMENSIONS)} m
        </p>
        <p className="text-gray-800 font-bold text-lg mt-2">
          <span className="font-medium">Capacidad Total Tanque:</span> {totalVolume.toFixed(0)} Litros
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Áreas Calculadas (m²)</h3>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Cuerpo:</span> {areas.currentAreaChapaCuerpo.toFixed(CONFIG.UI.DECIMAL_PLACES.AREAS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Tapa Superior:</span> {areas.currentAreaTapaSuperior.toFixed(CONFIG.UI.DECIMAL_PLACES.AREAS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Fondo Inferior:</span> {areas.currentAreaFondoInferior.toFixed(CONFIG.UI.DECIMAL_PLACES.AREAS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Camisa Térmica:</span> {areas.currentAreaChapaCamisaTermica.toFixed(CONFIG.UI.DECIMAL_PLACES.AREAS)}
        </p>
        <p className="text-gray-800 font-bold">
          <span className="font-medium">Área Total:</span> {areas.currentAreaChapaTotal.toFixed(CONFIG.UI.DECIMAL_PLACES.AREAS)}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Peso y Costo de Chapa</h3>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Kg Chapa:</span> {costs.kgChapa.toFixed(2)} kg
        </p>
        <p className="text-gray-800 font-bold">
          <span className="font-medium">Costo Chapa:</span> {formatCurrency(costs.costoChapaARS)}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-blue-600 mb-3">Desglose de Costos</h3>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Costo Chapa:</span> {formatCurrency(costs.costoChapaARS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Costo Mano de Obra:</span> {formatCurrency(costs.costoManoObraARS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Costo Consumibles:</span> {formatCurrency(costs.costoConsumiblesARS)}
        </p>
        <p className="text-gray-800 mb-1">
          <span className="font-medium">Accesorios:</span> {formatCurrency(costs.costoAccesoriosARS)}
        </p>
        
        <div className="ml-4 mt-2 space-y-1">
          {conCamisa && (
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Camisa Térmica:</span> {formatCurrency(costs.costoCamisaTermicaARS)}
              <span className="text-xs text-gray-500 ml-1">(${costs.costoUnitarioCamisaTermicaARS_m2.toFixed(2)}/m²)</span>
            </p>
          )}
          {conValvula && (
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Válvula:</span> {formatCurrency(costs.costoValvulaARS)}
            </p>
          )}
          {conPatas && (
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Patas:</span> {formatCurrency(costs.costoPatasARS)}
            </p>
          )}
          <p className="text-gray-700 text-sm">
            <span className="font-medium">Fondo:</span> {formatCurrency(costs.costoFondoARS)}
          </p>
        </div>
        
        <p className="text-gray-800 font-bold text-lg mt-2">
          <span className="font-medium">Subtotal:</span> {formatCurrency(costs.subtotal)}
        </p>
      </div>

      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-2">Precio Final</h3>
        <p className="text-3xl font-extrabold text-white text-center">
          {formatCurrency(costs.precioFinal)}
        </p>
        <p className="text-white text-sm text-center mt-1">
          (Incluye factor comercial de {factorComercial}x)
        </p>
      </div>
    </div>
  );
};

export default ResultsSection; 