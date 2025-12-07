import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  content?: string | null;
  order_index: number;
}

interface StudyPlan {
  id: string;
  module_id: string;
}

interface ModuleFurnitureProps {
  modules: CourseModule[];
  studyPlans: StudyPlan[];
  onSelectModule: (module: CourseModule | null) => void;
  selectedModule: CourseModule | null;
}

// Furniture positions in the room
const furniturePositions = [
  { position: [0, 0.4, -3] as [number, number, number], type: 'bed' },
  { position: [-3.5, 0.4, 0] as [number, number, number], type: 'desk' },
  { position: [3.5, 0.4, 0] as [number, number, number], type: 'wardrobe' },
  { position: [-2, 0.3, 2.5] as [number, number, number], type: 'shelf' },
  { position: [2, 0.3, 2.5] as [number, number, number], type: 'nightstand' },
  { position: [-3.5, 0.3, -2] as [number, number, number], type: 'chair' },
];

const furnitureColors: Record<string, string> = {
  bed: '#8b6f47',
  desk: '#5c4033',
  wardrobe: '#6b4423',
  shelf: '#8b7355',
  nightstand: '#a0826d',
  chair: '#4a3728',
};

interface FurnitureItemProps {
  module: CourseModule;
  position: [number, number, number];
  type: string;
  isSelected: boolean;
  hasPlan: boolean;
  onClick: () => void;
}

function FurnitureItem({ module, position, type, isSelected, hasPlan, onClick }: FurnitureItemProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      } else {
        meshRef.current.position.y = position[1];
      }
    }
  });

  const baseColor = furnitureColors[type] || '#8b6f47';
  const color = isSelected ? '#7a9e8c' : hovered ? '#9ab89e' : baseColor;

  const renderFurniture = () => {
    switch (type) {
      case 'bed':
        return (
          <group>
            {/* Bed frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[2, 0.3, 1.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[1.8, 0.15, 1]} />
              <meshStandardMaterial color="#f0e6d2" />
            </mesh>
            {/* Headboard */}
            <mesh position={[-0.9, 0.4, 0]} castShadow>
              <boxGeometry args={[0.1, 0.5, 1.2]} />
              <meshStandardMaterial color={color} />
            </mesh>
          </group>
        );
      case 'desk':
        return (
          <group>
            {/* Desktop */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.5, 0.08, 0.8]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[[-0.65, 0, -0.3], [0.65, 0, -0.3], [-0.65, 0, 0.3], [0.65, 0, 0.3]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow>
                <boxGeometry args={[0.08, 0.7, 0.08]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      case 'wardrobe':
        return (
          <group>
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[1.2, 1.8, 0.6]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Doors line */}
            <mesh position={[0, 0.9, 0.31]} castShadow>
              <boxGeometry args={[0.02, 1.6, 0.02]} />
              <meshStandardMaterial color="#2a1f14" />
            </mesh>
          </group>
        );
      case 'shelf':
        return (
          <group>
            {[0, 0.4, 0.8].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} castShadow>
                <boxGeometry args={[1, 0.05, 0.3]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
            {/* Side panels */}
            {[-0.5, 0.5].map((x, i) => (
              <mesh key={i} position={[x, 0.4, 0]} castShadow>
                <boxGeometry args={[0.05, 0.85, 0.3]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      case 'nightstand':
        return (
          <group>
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.4]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Drawer */}
            <mesh position={[0, 0.25, 0.21]} castShadow>
              <boxGeometry args={[0.4, 0.15, 0.02]} />
              <meshStandardMaterial color="#2a1f14" />
            </mesh>
          </group>
        );
      case 'chair':
        return (
          <group>
            {/* Seat */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.5, 0.05, 0.5]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Back */}
            <mesh position={[0, 0.5, -0.22]} castShadow>
              <boxGeometry args={[0.5, 0.5, 0.05]} />
              <meshStandardMaterial color={color} />
            </mesh>
            {/* Legs */}
            {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                <meshStandardMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
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
      {renderFurniture()}
      
      {/* Label */}
      {(hovered || isSelected) && (
        <mesh position={[0, 1.5, 0]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      )}

      {/* Plan indicator glow */}
      {hasPlan && (
        <pointLight 
          position={[0, 0.5, 0]} 
          color="#7a9e8c" 
          intensity={isSelected ? 2 : 0.5} 
          distance={2} 
        />
      )}
    </group>
  );
}

export function ModuleFurniture({ modules, studyPlans, onSelectModule, selectedModule }: ModuleFurnitureProps) {
  return (
    <group>
      {modules.slice(0, furniturePositions.length).map((module, index) => {
        const furniture = furniturePositions[index];
        const hasPlan = studyPlans.some(p => p.module_id === module.id);
        
        return (
          <FurnitureItem
            key={module.id}
            module={module}
            position={furniture.position}
            type={furniture.type}
            isSelected={selectedModule?.id === module.id}
            hasPlan={hasPlan}
            onClick={() => onSelectModule(selectedModule?.id === module.id ? null : module)}
          />
        );
      })}
      
      {/* Click to deselect */}
      <mesh 
        position={[0, 0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onSelectModule(null)}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
