import { MentalPalace } from '@/components/MentalPalace';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Palacio Mental 3D - Aprende con ubicación espacial</title>
        <meta 
          name="description" 
          content="Transforma tu aprendizaje con un Palacio Mental 3D interactivo. Organiza y retiene información usando técnicas de memoria espacial." 
        />
      </Helmet>
      <MentalPalace />
    </>
  );
};

export default Index;
