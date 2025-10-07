import { useState, useEffect } from 'react';

interface Option {
  id: number;
  name: string;
}

export const useDynamicOptions = () => {
  const [cities, setCities] = useState<Option[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<Option[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      try {
        // Simulate API calls - replace with actual endpoints
        const [citiesRes, idTypesRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/identification-types')
        ]);
        
        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(citiesData);
        }
        
        if (idTypesRes.ok) {
          const idTypesData = await idTypesRes.json();
          setIdentificationTypes(idTypesData);
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
        // Fallback to hardcoded options if API fails
        setCities([
          { id: 1, name: "Bogotá" },
          { id: 2, name: "Medellín" },
          { id: 3, name: "Cali" },
          { id: 4, name: "Barranquilla" }
        ]);
        setIdentificationTypes([
          { id: 1, name: "Cédula de Ciudadanía (CC)" },
          { id: 2, name: "Cédula de Extranjería (CE)" },
          { id: 3, name: "Tarjeta de Identidad (TI)" },
          { id: 4, name: "Pasaporte" }
        ]);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  return { cities, identificationTypes, isLoadingOptions };
};