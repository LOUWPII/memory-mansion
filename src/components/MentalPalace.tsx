import { Scene3D } from './palace/Scene3D';
import { Header } from './ui/Header';
import { ProgressSidebar } from './ui/ProgressSidebar';
import { FurniturePanel } from './ui/FurniturePanel';
import { AssistantPanel } from './ui/AssistantPanel';
import { FurnitureLegend } from './ui/FurnitureLegend';

export const MentalPalace = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <Scene3D />
      
      {/* UI Overlays */}
      <Header />
      <ProgressSidebar />
      <FurniturePanel />
      <AssistantPanel />
      <FurnitureLegend />
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent pointer-events-none z-10" />
    </div>
  );
};
