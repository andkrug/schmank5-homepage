import * as React from 'react';
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, ContactShadows, Environment, MeshDistortMaterial, Html, useTexture } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Music, Mail, Phone, Instagram, ChevronDown } from 'lucide-react';
import * as THREE from 'three';

// --- Background Components ---

// --- Background & Logo Components ---

// --- Background & Logo Components ---

const SonicCrest = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();
  
  // Load the logo texture
  const texture = useTexture('braun.png');

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();

    // Scroll Transition Logic:
    // Logo starts clean, then distorts and dissolves into the background fluid
    
    // Scale: Maintain size or slightly grow
    const scale = THREE.MathUtils.lerp(1.5, 3, Math.min(scroll * 2, 1));
    
    // Position: Move up slightly
    const yPos = THREE.MathUtils.lerp(0, 1, Math.min(scroll * 2, 1));
    
    // Distort: Increase distortion with scroll
    const distort = THREE.MathUtils.lerp(0.2, 0.8, Math.min(scroll * 3, 1));
    
    meshRef.current.scale.setScalar(scale);
    meshRef.current.position.y = yPos;
    
    // Gentle floating rotation
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.05;

    const material = meshRef.current.material as any;
    if (material) {
      material.distort = distort + Math.sin(time * 0.5) * 0.1;
      // Fade out opacity on scroll to blend with background
      material.opacity = THREE.MathUtils.lerp(1, 0, Math.max(0, (scroll - 0.2) * 2));
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <planeGeometry args={[3, 3, 64, 64]} />
        <MeshDistortMaterial
          map={texture}
          transparent
          speed={2}
          distort={0.2}
          radius={1}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};





const ParticleField = () => {
  const count = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#DAA520"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
};

// --- Section Components ---

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);
  const blur = useTransform(scrollYProgress, [0, 0.1], ["blur(0px)", "blur(20px)"]);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center p-6 overflow-hidden uppercase font-inter">
      <motion.div 
        style={{ opacity, scale, filter: blur }} 
        className="text-center z-10 pointer-events-none flex flex-col items-center mt-[15vh]"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-[10vh]"
        >
          <div className="h-px w-24 bg-honey-gold/50 mb-6 mx-auto" />
          <p className="text-sm md:text-xl font-inter tracking-[0.8em] text-honey-gold/80 italic">
            Ein musikalischer Leckerbissen
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-stone-500"
      >
        <span className="text-[10px] uppercase tracking-widest">Scrollen zum Genießen</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
};




const Ingredients = () => {
  const items = [
    { name: "Bass", flavor: "Geräucherte Eiche & Tiefe Erde", color: "#2d0a0a" },
    { name: "Klarinette", flavor: "Samtseide & Dunkler Honig", color: "#4A0E0E" },
    { name: "Schlagzeug", flavor: "Knackiger Pfeffer & Dynamik", color: "#1A0F0F" },
    { name: "Klavier", flavor: "Kristallzucker & Mitternachtsregen", color: "#DAA520" },
    { name: "Saxophon", flavor: "Gebranntes Kupfer & Goldglanz", color: "#9d7312" },
  ];

  return (
    <section className="min-h-screen py-32 px-6 md:px-24">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col mb-20">
          <h2 className="text-5xl md:text-8xl font-playfair italic text-white mb-4">Die Zutaten</h2>
          <div className="h-1 w-32 bg-honey-gold" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div 
                className="w-48 h-48 rounded-full mb-8 flex items-center justify-center relative overflow-hidden transition-transform duration-500 group-hover:scale-110"
                style={{ background: `radial-gradient(circle, ${item.color} 0%, #000 100%)` }}
              >
                <div className="absolute inset-0 border border-white/10 rounded-full" />
                <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse" />
                <Music className="text-white/20" size={40} />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-white mb-2">{item.name}</h3>
              <p className="text-sm font-inter text-stone-500 text-center uppercase tracking-widest">{item.flavor}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const Menu = () => {
  const courses = [
    {
      type: "Der Auftakt",
      title: "Tradition & Heimat",
      content: "Herzhafte Märsche und schwungvolle Polkas, serviert mit bodenständiger Präzision."
    },
    {
      type: "Der Hauptgang",
      title: "Moderne Fusion",
      content: "Ein Crossover aus Swing, Pop und Modernen Klängen – würzig arrangiert für den anspruchsvollen Gaumen."
    },
    {
      type: "Der Abgang",
      title: "Feine Weisen",
      content: "Gefühlvolle Melodien und sanfte Klänge, die wie ein edler Tropfen lange nachhallen."
    }
  ];

  return (
    <section className="min-h-screen py-32 bg-stone-900/10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <p className="text-honey-gold uppercase tracking-[0.3em] text-sm mb-4 italic">Unser Repertoire</p>
          <h2 className="text-6xl md:text-8xl font-playfair font-bold text-white uppercase tracking-tighter">Das Menü</h2>
        </div>

        <div className="space-y-24">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative border-b border-stone-800 pb-12"
            >
              <span className="text-xs font-inter text-honey-gold/60 uppercase tracking-widest mb-4 inline-block">{course.type}</span>
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <h3 className="text-3xl md:text-5xl font-playfair italic text-white">{course.title}</h3>
                <div className="flex-1 border-t border-dashed border-stone-800 mx-4 hidden md:block" />
                <p className="text-stone-400 font-inter max-w-sm md:text-right">
                  {course.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      <div className="glass-panel p-12 md:p-24 rounded-[4rem] text-center max-w-4xl w-full border-honey-gold/20 relative z-10">
        <h2 className="text-5xl md:text-8xl font-playfair font-bold text-white mb-8 tracking-tighter italic">
          Kontakt & Buchung
        </h2>
        <p className="text-xl md:text-2xl text-stone-400 mb-12 font-inter">
          Buchen Sie Ihre private Verkostung und erleben Sie echte musikalische Schmankerl.
        </p>

        <div className="flex flex-col items-center gap-6">
          <motion.a
            href="mailto:kontakt@schmank5.at"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-honey-gold text-warm-black px-12 py-6 rounded-full font-inter font-bold text-xl transition-colors hover:bg-white"
          >
            <Mail size={24} />
            Anfrage Senden
          </motion.a>
          
          <div className="flex gap-8 mt-8 text-stone-500 items-center">
            <a href="tel:+436644007354" className="hover:text-honey-gold transition-colors flex items-center gap-2">
              <Phone size={18} />
              <span>+43 664 4007354</span>
            </a>
            <div className="w-1 h-1 bg-stone-700 rounded-full" />
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-honey-gold transition-colors flex items-center gap-2">
              <Instagram size={18} />
              <span>@schmank5</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative blurred blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wine-red/20 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

// --- App Root ---

function App() {
  return (
    <div className="bg-warm-black min-h-screen font-inter">
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={['#0a0505']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#DAA520" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4A0E0E" />
          <Suspense fallback={null}>
            <SonicCrest />
            <ParticleField />
            <Environment preset="night" />
            <ContactShadows opacity={0.4} scale={10} blur={2.4} far={4.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Ingredients />
        <Menu />
        <Contact />
      </main>

      {/* Signature */}
      <footer className="relative z-10 py-12 px-6 border-t border-stone-900 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-stone-600">
          © {new Date().getFullYear()} Schmank5 Quintett — All Rights Served
        </p>
      </footer>
    </div>
  );
}

export default App;
