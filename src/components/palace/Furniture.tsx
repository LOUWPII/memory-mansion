import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePalaceStore, FurnitureType } from '@/store/palaceStore';
import * as THREE from 'three';

interface FurnitureProps {
  type: FurnitureType;
  position: [number, number, number];
  children: React.ReactNode;
}

const FurnitureWrapper = ({ type, position, children }: FurnitureProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedFurniture, setSelectedFurniture } = usePalaceStore();
  
  const isSelected = selectedFurniture === type;
  
  useFrame((state) => {
    if (groupRef.current) {
      if (isSelected) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        groupRef.current.position.y = position[1];
      }
    }
  });
  
  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedFurniture(isSelected ? null : type);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group scale={hovered || isSelected ? 1.02 : 1}>
        {children}
      </group>
      {(hovered || isSelected) && (
        <pointLight 
          position={[0, 2, 0]} 
          intensity={isSelected ? 2 : 1} 
          color="#a8d5ba" 
          distance={4}
        />
      )}
    </group>
  );
};

export const Bed = () => (
  <FurnitureWrapper type="bed" position={[-3.5, 0, -3]}>
    {/* Bed frame */}
    <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.3, 3]} />
      <meshStandardMaterial color="#8B7355" roughness={0.7} />
    </mesh>
    {/* Mattress */}
    <mesh position={[0, 0.55, 0]} castShadow>
      <boxGeometry args={[2, 0.2, 2.8]} />
      <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
    </mesh>
    {/* Pillow */}
    <mesh position={[0, 0.75, -1.1]} castShadow>
      <boxGeometry args={[1.4, 0.15, 0.5]} />
      <meshStandardMaterial color="#e8e8e8" roughness={0.95} />
    </mesh>
    {/* Blanket */}
    <mesh position={[0, 0.7, 0.4]} castShadow>
      <boxGeometry args={[1.9, 0.1, 1.8]} />
      <meshStandardMaterial color="#7a9e8c" roughness={0.85} />
    </mesh>
    {/* Headboard */}
    <mesh position={[0, 1.2, -1.45]} castShadow>
      <boxGeometry args={[2.2, 1.2, 0.1]} />
      <meshStandardMaterial color="#6B5344" roughness={0.6} />
    </mesh>
    {/* Bed legs */}
    {[[-0.95, 0.15, -1.35], [0.95, 0.15, -1.35], [-0.95, 0.15, 1.35], [0.95, 0.15, 1.35]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#5a4435" roughness={0.6} />
      </mesh>
    ))}
  </FurnitureWrapper>
);

export const Desk = () => (
  <FurnitureWrapper type="desk" position={[3, 0, -4]}>
    {/* Desktop */}
    <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.5, 0.08, 1.2]} />
      <meshStandardMaterial color="#8B6914" roughness={0.5} />
    </mesh>
    {/* Legs */}
    {[[-1.1, 0.375, -0.5], [1.1, 0.375, -0.5], [-1.1, 0.375, 0.5], [1.1, 0.375, 0.5]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <boxGeometry args={[0.08, 0.75, 0.08]} />
        <meshStandardMaterial color="#5a4435" roughness={0.6} />
      </mesh>
    ))}
    {/* Drawer unit */}
    <mesh position={[0.8, 0.4, 0]} castShadow>
      <boxGeometry args={[0.6, 0.6, 1]} />
      <meshStandardMaterial color="#7a5c2e" roughness={0.6} />
    </mesh>
    {/* Drawer handles */}
    {[0.5, 0.3, 0.1].map((y, i) => (
      <mesh key={i} position={[0.8, y, 0.51]} castShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
    {/* Lamp on desk */}
    <group position={[-0.8, 0.79, -0.3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#333" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <coneGeometry args={[0.2, 0.25, 16, 1, true]} />
        <meshStandardMaterial color="#f5f0e0" side={THREE.DoubleSide} />
      </mesh>
    </group>
    {/* Book on desk */}
    <mesh position={[0, 0.83, 0.2]} rotation={[0, 0.3, 0]} castShadow>
      <boxGeometry args={[0.3, 0.05, 0.4]} />
      <meshStandardMaterial color="#c45c3b" roughness={0.8} />
    </mesh>
  </FurnitureWrapper>
);

export const Chair = () => (
  <FurnitureWrapper type="chair" position={[3, 0, -2.5]}>
    {/* Seat */}
    <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.05, 0.5]} />
      <meshStandardMaterial color="#4a3728" roughness={0.6} />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.85, -0.22]} castShadow>
      <boxGeometry args={[0.5, 0.75, 0.05]} />
      <meshStandardMaterial color="#4a3728" roughness={0.6} />
    </mesh>
    {/* Legs */}
    {[[-0.2, 0.225, -0.2], [0.2, 0.225, -0.2], [-0.2, 0.225, 0.2], [0.2, 0.225, 0.2]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.5} />
      </mesh>
    ))}
    {/* Cushion */}
    <mesh position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[0.45, 0.06, 0.45]} />
      <meshStandardMaterial color="#7a9e8c" roughness={0.9} />
    </mesh>
  </FurnitureWrapper>
);

export const Wardrobe = () => (
  <FurnitureWrapper type="wardrobe" position={[-5, 0, 0]}>
    {/* Main body */}
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 3, 0.8]} />
      <meshStandardMaterial color="#8B6914" roughness={0.6} />
    </mesh>
    {/* Door split line */}
    <mesh position={[0, 1.5, 0.41]}>
      <boxGeometry args={[0.02, 2.8, 0.02]} />
      <meshStandardMaterial color="#5a4415" roughness={0.5} />
    </mesh>
    {/* Handles */}
    <mesh position={[-0.15, 1.5, 0.42]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0.15, 1.5, 0.42]} castShadow>
      <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Top decorative */}
    <mesh position={[0, 3.05, 0]} castShadow>
      <boxGeometry args={[1.6, 0.1, 0.9]} />
      <meshStandardMaterial color="#6a5210" roughness={0.5} />
    </mesh>
    {/* Base */}
    <mesh position={[0, 0.05, 0]} castShadow>
      <boxGeometry args={[1.55, 0.1, 0.85]} />
      <meshStandardMaterial color="#6a5210" roughness={0.5} />
    </mesh>
  </FurnitureWrapper>
);

export const Nightstand = () => (
  <FurnitureWrapper type="nightstand" position={[-1.8, 0, -4]}>
    {/* Main body */}
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.6, 0.5]} />
      <meshStandardMaterial color="#9a7b4f" roughness={0.6} />
    </mesh>
    {/* Drawer */}
    <mesh position={[0, 0.45, 0.26]}>
      <boxGeometry args={[0.5, 0.18, 0.02]} />
      <meshStandardMaterial color="#8a6b3f" roughness={0.6} />
    </mesh>
    {/* Handle */}
    <mesh position={[0, 0.45, 0.28]} castShadow>
      <boxGeometry args={[0.1, 0.03, 0.03]} />
      <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
    </mesh>
    {/* Top surface */}
    <mesh position={[0, 0.71, 0]} castShadow>
      <boxGeometry args={[0.65, 0.02, 0.55]} />
      <meshStandardMaterial color="#7a5c2e" roughness={0.5} />
    </mesh>
    {/* Legs */}
    {[[-0.25, 0.05, -0.2], [0.25, 0.05, -0.2], [-0.25, 0.05, 0.2], [0.25, 0.05, 0.2]].map((pos, i) => (
      <mesh key={i} position={pos as [number, number, number]} castShadow>
        <boxGeometry args={[0.05, 0.1, 0.05]} />
        <meshStandardMaterial color="#5a4415" roughness={0.5} />
      </mesh>
    ))}
    {/* Lamp */}
    <group position={[0, 0.72, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.02, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#f5e6c8" opacity={0.9} transparent />
      </mesh>
      <pointLight position={[0, 0.35, 0]} intensity={0.5} color="#fff5e0" distance={2} />
    </group>
  </FurnitureWrapper>
);

export const Shelf = () => (
  <FurnitureWrapper type="shelf" position={[5, 0, 0]}>
    {/* Main frame */}
    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.3, 3, 1.2]} />
      <meshStandardMaterial color="#6a5210" roughness={0.6} />
    </mesh>
    {/* Shelves */}
    {[0.5, 1.1, 1.7, 2.3, 2.9].map((y, i) => (
      <mesh key={i} position={[0, y, 0]} castShadow>
        <boxGeometry args={[0.28, 0.03, 1.15]} />
        <meshStandardMaterial color="#8B6914" roughness={0.5} />
      </mesh>
    ))}
    {/* Books on shelves */}
    {/* Bottom shelf books */}
    <group position={[0, 0.6, -0.3]}>
      {[0, 0.08, 0.16, 0.24].map((x, i) => (
        <mesh key={i} position={[0, 0, x]} castShadow>
          <boxGeometry args={[0.2, 0.25, 0.06]} />
          <meshStandardMaterial color={['#c45c3b', '#3b6c7c', '#7c5c3b', '#5c7c3b'][i]} roughness={0.8} />
        </mesh>
      ))}
    </group>
    {/* Second shelf books */}
    <group position={[0, 1.2, 0]}>
      {[-0.3, -0.2, -0.1, 0.1, 0.2, 0.3].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} castShadow>
          <boxGeometry args={[0.18, [0.3, 0.25, 0.28, 0.22, 0.3, 0.26][i], 0.06]} />
          <meshStandardMaterial color={['#8b4513', '#2f4f4f', '#8b0000', '#006400', '#4b0082', '#8b8b00'][i]} roughness={0.8} />
        </mesh>
      ))}
    </group>
    {/* Third shelf - decorative items */}
    <mesh position={[0, 1.8, -0.2]} castShadow>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.8, 0.2]} castShadow>
      <boxGeometry args={[0.1, 0.15, 0.1]} />
      <meshStandardMaterial color="#7a9e8c" roughness={0.4} />
    </mesh>
  </FurnitureWrapper>
);

export const AllFurniture = () => (
  <>
    <Bed />
    <Desk />
    <Chair />
    <Wardrobe />
    <Nightstand />
    <Shelf />
  </>
);
