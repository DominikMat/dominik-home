import React, { useRef, useEffect, useCallback, useState } from 'react';
import './DitheringEffect.css'; // Używamy tych samych styli dla pozycjonowania

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  speed: number;
  opacity: number;
  maxDistance: number;
  initialSize: number;
}

interface DitheringEffect {
  maxParticles: number;     // Maksymalna liczba symulowanych pikseli
  spawnRate: number;        // Liczba nowych cząstek na klatkę (np. 1-5)
  maxInitialSpeed: number;  // Maksymalna początkowa prędkość w px/klatkę
  sizeRange: [number, number]; // [min, max] rozmiar piksela
  width: number;            // Maksymalna szerokość "pasa" w px
  color: string;            // Kolor pikseli
}

const DitheringEffect: React.FC<DitheringEffect> = ({ 
  maxParticles, 
  spawnRate, 
  maxInitialSpeed, 
  sizeRange, 
  width, 
  color 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  // Stan przechowujący wszystkie cząstki
  const [particles, setParticles] = useState<Particle[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);

  // Aktualizacja rozmiaru Canvas przy zmianie rozmiaru okna (jak poprzednio)
  useEffect(() => {
    const handleResize = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Funkcja Aktualizacji Cząstek ---
  const updateParticles = useCallback(() => {
    setParticles(prevParticles => {
      const H = canvasHeight;
      let newParticles = prevParticles;

      // 1. Sprawdzenie, czy generować nowe cząstki
      if (newParticles.length < maxParticles) {
        for (let i = 0; i < spawnRate; i++) {
          
          // Generowanie nowego, "zdrowego" piksela na lewej krawędzi
          const newParticle: Particle = {
            id: Date.now() + Math.random(), // Unikalne ID
            x: -50,
            y: Math.random() * H, // Losowa pozycja Y na całej wysokości
            size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
            initialSize: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
            rotation: Math.random() * 2 * Math.PI,
            speed: 0.5 + Math.random() * (maxInitialSpeed - 0.5), // Prędkość w prawo
            opacity: .5, // Pełne krycie na starcie
            maxDistance: width, // Maksymalny dystans do przejechania
          };
          newParticles = [...newParticles, newParticle];
        }
      }

      // 2. Aktualizacja i filtrowanie istniejących cząstek
      const updatedParticles = newParticles.map(p => {
        const distanceRatio = p.x / p.maxDistance;
        
        if (p.x > p.maxDistance) {
          return { ...p, opacity: -1 }; 
        }

        const newX = p.x + p.speed;
        const newSize = p.initialSize * (1 - distanceRatio);
        const newOpacity = (1 - distanceRatio)*.35;
        const newRotation = p.rotation + 0.005 * (1 - distanceRatio); // Spowalnianie obrotu
        
        return {
          ...p,
          x: newX,
          size: newSize,
          opacity: newOpacity,
          rotation: newRotation,
        };
      }).filter(p => p.opacity > 0); // Usuwanie cząstek, które przekroczyły limit lub zniknęły
      
      return updatedParticles;
    });
  }, [canvasHeight, maxParticles, spawnRate, maxInitialSpeed, sizeRange, width]);


  // --- Funkcja Rysowania na Canvas ---
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, currentParticles: Particle[]) => {
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    currentParticles.forEach(p => {
      // Jeśli rozmiar lub krycie jest zbyt małe, pomijamy rysowanie
      if (p.size < 0.5 || p.opacity < 0.05) return;
      
      // Ustawienia stylu
      ctx.fillStyle = color;
      ctx.globalAlpha = p.opacity;

      // Zapisujemy stan Canvas przed transformacją
      ctx.save(); 
      
      // Przesunięcie do środka piksela dla obrotu
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      // Rysowanie kwadratu od jego środka (-size/2)
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      
      // Przywrócenie stanu Canvas
      ctx.restore(); 
    });
    
    ctx.globalAlpha = 1; // Resetujemy globalną przezroczystość

  }, [canvasWidth, canvasHeight, color]);


  // --- Pętla Animacji (Ruch i Rysowanie) ---
  const animate = useCallback(() => {
    updateParticles(); // 1. Zaktualizuj pozycje i stan cząstek
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawParticles(ctx, particles); // 2. Narysuj nowy stan
      }
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawParticles, updateParticles, particles]);


  // --- Uruchomienie i Cleanup ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasWidth || !canvasHeight) return;
    
    // Ustawienie rozmiarów Canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, canvasWidth, canvasHeight]);

  
  // --- Renderowanie ---
  return (
    <canvas 
      ref={canvasRef}
      className="dithering-canvas" // Używamy tego samego CSS (position: fixed)
    />
  );
};

export default DitheringEffect;