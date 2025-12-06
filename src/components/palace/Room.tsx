import { useRef } from 'react';
import * as THREE from 'three';

export const Room = () => {
  const floorRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Floor */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          color="#e8dcc8" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.9} />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-6, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f0ebe3" roughness={0.9} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[6, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f0ebe3" roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      
      {/* Window on back wall */}
      <group position={[0, 3.5, -5.95]}>
        <mesh>
          <boxGeometry args={[3, 2.5, 0.1]} />
          <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
        </mesh>
        {/* Window frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[3.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[0, 1.25, 0.05]}>
          <boxGeometry args={[3.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[0, -1.25, 0.05]}>
          <boxGeometry args={[3.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[-1.55, 0, 0.05]}>
          <boxGeometry args={[0.1, 2.5, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[1.55, 0, 0.05]}>
          <boxGeometry args={[0.1, 2.5, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.08, 2.5, 0.1]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      </group>
      
      {/* Baseboard */}
      <mesh position={[0, 0.1, -5.95]}>
        <boxGeometry args={[12, 0.2, 0.1]} />
        <meshStandardMaterial color="#d4c5b0" />
      </mesh>
      <mesh position={[-5.95, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.2, 0.1]} />
        <meshStandardMaterial color="#d4c5b0" />
      </mesh>
      <mesh position={[5.95, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 0.2, 0.1]} />
        <meshStandardMaterial color="#d4c5b0" />
      </mesh>
      
      {/* Rug under the furniture area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial color="#c9b896" roughness={0.95} />
      </mesh>
    </group>
  );
};
