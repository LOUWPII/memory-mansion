export const Lighting = () => {
  return (
    <>
      {/* Main ambient light */}
      <ambientLight intensity={0.4} color="#fff5e6" />
      
      {/* Sun light from window */}
      <directionalLight
        position={[0, 8, -4]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={20}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Warm fill light */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.6}
        color="#ffecd2"
        distance={12}
      />
      
      {/* Window glow */}
      <pointLight
        position={[0, 3.5, -5]}
        intensity={0.8}
        color="#87CEEB"
        distance={6}
      />
      
      {/* Corner accent lights */}
      <pointLight
        position={[-5, 2, -5]}
        intensity={0.3}
        color="#f5d4a8"
        distance={5}
      />
      <pointLight
        position={[5, 2, -5]}
        intensity={0.3}
        color="#f5d4a8"
        distance={5}
      />
      
      {/* Hemisphere light for natural feel */}
      <hemisphereLight
        color="#fff5e6"
        groundColor="#8b7355"
        intensity={0.3}
      />
    </>
  );
};
