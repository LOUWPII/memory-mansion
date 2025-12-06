import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Room } from './Room';
import { AllFurniture } from './Furniture';
import { Lighting } from './Lighting';
import { usePalaceStore } from '@/store/palaceStore';
import { Suspense } from 'react';

const Scene = () => {
  const { setSelectedFurniture } = usePalaceStore();
  
  return (
    <>
      <Lighting />
      <Room />
      <AllFurniture />
      
      {/* Click on floor/walls to deselect */}
      <mesh 
        position={[0, 0.01, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => setSelectedFurniture(null)}
      >
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
};

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#7a9e8c" />
  </mesh>
);

export const Scene3D = () => {
  return (
    <div className="absolute inset-0">
      <Canvas shadows>
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera 
            makeDefault 
            position={[8, 6, 8]} 
            fov={50}
          />
          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 1.5, 0]}
          />
          <fog attach="fog" args={['#f5f0e8', 10, 25]} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};
