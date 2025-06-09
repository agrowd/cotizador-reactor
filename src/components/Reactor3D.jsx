import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Materiales
const aceroMaterial = {
  color: '#b0c4de',
  metalness: 1,
  roughness: 0.2,
};
const camisaMaterial = {
  color: '#7ecbff',
  metalness: 0.5,
  roughness: 0.1,
  transparent: true,
  opacity: 0.4,
};
const visorMaterial = {
  color: '#4fc3f7',
  metalness: 0.2,
  roughness: 0.1,
  transparent: true,
  opacity: 0.7,
};

// Utilidad para fondo inferior
function Fondo({ bottomType, radio, alturaFondo }) {
  if (bottomType === 'CONICAL') {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -alturaFondo / 2]}>
        <coneGeometry args={[radio, alturaFondo, 64]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  } else if (bottomType === 'PLANO') {
    return (
      <mesh position={[0, 0, -alturaFondo / 2]}>
        <cylinderGeometry args={[radio, radio, alturaFondo, 64]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  } else if (bottomType === 'HEMISPHERICAL') {
    return (
      <mesh position={[0, 0, -alturaFondo / 2]}>
        <sphereGeometry args={[radio, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  } else {
    // Default: cónico
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -alturaFondo / 2]}>
        <coneGeometry args={[radio, alturaFondo, 64]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  }
}

// Tapa superior
function Tapa({ radio, alturaTapa, conTapaCurva }) {
  if (conTapaCurva) {
    return (
      <mesh position={[0, 0, alturaTapa / 2]}>
        <sphereGeometry args={[radio, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  } else {
    return (
      <mesh position={[0, 0, alturaTapa / 2]}>
        <cylinderGeometry args={[radio, radio, alturaTapa, 64]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  }
}

// Camisa térmica
function Camisa({ radio, altura, espesor }) {
  return (
    <mesh position={[0, 0, altura / 2]}>
      <cylinderGeometry args={[radio + espesor + 0.005, radio + espesor + 0.005, altura, 64]} />
      <meshStandardMaterial {...camisaMaterial} />
    </mesh>
  );
}

// Patas
function Patas({ radio, altoPatas, conPatas }) {
  if (!conPatas) return null;
  const patas = [];
  const patasRadio = radio * 0.12;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    patas.push(
      <mesh
        key={i}
        position={[Math.cos(angle) * (radio * 0.8), Math.sin(angle) * (radio * 0.8), -altoPatas / 2]}
      >
        <cylinderGeometry args={[patasRadio, patasRadio, altoPatas, 32]} />
        <meshStandardMaterial {...aceroMaterial} />
      </mesh>
    );
  }
  return <group>{patas}</group>;
}

// Válvula inferior
function Valvula({ radio, alturaFondo, conValvula }) {
  if (!conValvula) return null;
  return (
    <mesh position={[0, 0, -alturaFondo - 0.08]}>
      <cylinderGeometry args={[radio * 0.12, radio * 0.12, 0.16, 32]} />
      <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
    </mesh>
  );
}

// Visor lateral
function Visor({ radio, alturaCilindro, conVisor }) {
  if (!conVisor) return null;
  return (
    <mesh position={[radio * 0.98, 0, alturaCilindro * 0.6]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[radio * 0.18, radio * 0.18, 0.02, 32]} />
      <meshPhysicalMaterial {...visorMaterial} transmission={0.8} />
    </mesh>
  );
}

// Motor superior (opcional, decorativo)
function MotorSuperior({ radio, alturaCilindro, alturaTapa }) {
  return (
    <mesh position={[0, 0, alturaCilindro + alturaTapa + 0.08]}>
      <cylinderGeometry args={[radio * 0.18, radio * 0.18, 0.12, 32]} />
      <meshStandardMaterial color="#1e88e5" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Componente principal
export default function Reactor3D({
  diametro = 1,
  alturaCilindro = 1,
  alturaFondo = 0.3,
  alturaTotal = 1.5,
  altoPatas = 0.3,
  bottomType = 'CONICAL',
  conCamisa = false,
  conValvula = false,
  conVisor = false,
  conPatas = false,
  conTapaCurva = false,
  espesorChapa = 0.005,
  modoPrueba = false,
}) {
  // Cálculo de proporciones
  const radio = diametro / 2;
  const alturaTapa = conTapaCurva ? alturaCilindro * 0.22 : alturaCilindro * 0.12;

  return (
    <div style={{ width: '100%', height: 500, background: '#e3eafc', borderRadius: 16 }}>
      <Canvas shadows camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 4]} intensity={0.7} />
        <group position={[0, 0, altoPatas]}>
          {/* Patas */}
          <Patas radio={radio} altoPatas={altoPatas} conPatas={conPatas} />
          {/* Fondo */}
          <Fondo bottomType={bottomType} radio={radio} alturaFondo={alturaFondo} />
          {/* Cuerpo principal */}
          <mesh position={[0, 0, alturaCilindro / 2]}>
            <cylinderGeometry args={[radio, radio, alturaCilindro, 64]} />
            <meshStandardMaterial {...aceroMaterial} />
          </mesh>
          {/* Camisa térmica */}
          {conCamisa && (
            <Camisa radio={radio} altura={alturaCilindro} espesor={espesorChapa} />
          )}
          {/* Tapa superior */}
          <Tapa radio={radio} alturaTapa={alturaTapa} conTapaCurva={conTapaCurva} />
          {/* Motor superior */}
          <MotorSuperior radio={radio} alturaCilindro={alturaCilindro} alturaTapa={alturaTapa} />
          {/* Válvula */}
          <Valvula radio={radio} alturaFondo={alturaFondo} conValvula={conValvula} />
          {/* Visor */}
          <Visor radio={radio} alturaCilindro={alturaCilindro} conVisor={conVisor} />
        </group>
        <OrbitControls enablePan enableZoom enableRotate />
        <PerspectiveCamera makeDefault position={[2, 2, 2]} fov={50} />
      </Canvas>
    </div>
  );
} 