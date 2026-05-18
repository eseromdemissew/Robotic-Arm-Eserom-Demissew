import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Eye, 
  Mic, 
  Hand, 
  Download, 
  ChevronRight, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Shield,
  ExternalLink,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

// --- Static Asset Import ---
// This instructs Vite to bundle the APK file directly from your current directory
// @ts-ignore
import apkUrl from './Robotic_Arm_Control.apk'; 

// --- Constants ---
const PRIMARY_BLUE = '#3b82f6';
const SECONDARY_CYAN = '#06b6d4';

// --- Components ---

const Navbar = ({ isDark, setIsDark }: { isDark: boolean, setIsDark: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Specs', href: '#specs' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'App', href: '#app' },
    { name: 'Tech', href: '#tech' },
    { name: 'Architecture', href: '#architecture' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Robotic <span className="text-blue-500">Arm</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-blue-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="h-6 w-px bg-border" />
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <a 
            href={apkUrl} 
            download="Robotic_Arm_Control.apk"
            onClick={() => toast.success("Starting App Download...")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Download App
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-[60] flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2">
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold hover:text-blue-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href={apkUrl}
                download="Robotic_Arm_Control.apk"
                onClick={() => {
                  setIsOpen(false);
                  toast.success("Starting App Download...");
                }}
                className="mt-4 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xl font-bold text-center shadow-xl shadow-blue-600/30"
              >
                Download App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ArmCanvas = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const drawJoint = (x: number, y: number, label: string, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = '10px Poppins';
      ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
      ctx.fillText(label, x + 15, y + 5);
    };

    const drawLink = (x1: number, y1: number, x2: number, y2: number, width: number) => {
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, PRIMARY_BLUE);
      gradient.addColorStop(1, SECONDARY_CYAN);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = width;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(x1, y1 - 2);
      ctx.lineTo(x2, y2 - 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const render = () => {
      time += 0.015;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, w, h);

      const basePos = { x: w / 2, y: h * 0.85 };
      const shoulderLen = 100;
      const elbowLen = 90;
      const wristLen = 50;

      const sAngle = Math.sin(time) * 0.4 - Math.PI / 2;
      const eAngle = Math.sin(time * 0.7) * 0.6;
      const wAngle = Math.sin(time * 1.2) * 0.3;

      const shoulderPos = {
        x: basePos.x + Math.cos(sAngle) * shoulderLen,
        y: basePos.y + Math.sin(sAngle) * shoulderLen
      };

      const elbowPos = {
        x: shoulderPos.x + Math.cos(sAngle + eAngle) * elbowLen,
        y: shoulderPos.y + Math.sin(sAngle + eAngle) * elbowLen
      };

      const wristPos = {
        x: elbowPos.x + Math.cos(sAngle + eAngle + wAngle) * wristLen,
        y: elbowPos.y + Math.sin(sAngle + eAngle + wAngle) * wristLen
      };

      const gAngle = Math.sin(time * 2) * 0.5 + 0.5;
      const gLen = 20;

      drawLink(basePos.x, basePos.y, shoulderPos.x, shoulderPos.y, 14);
      drawLink(shoulderPos.x, shoulderPos.y, elbowPos.x, elbowPos.y, 10);
      drawLink(elbowPos.x, elbowPos.y, wristPos.x, wristPos.y, 6);

      const angle = sAngle + eAngle + wAngle;
      ctx.save();
      ctx.translate(wristPos.x, wristPos.y);
      ctx.rotate(angle);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(gLen, -5 - gAngle * 10);
      ctx.strokeStyle = SECONDARY_CYAN;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(gLen, 5 + gAngle * 10);
      ctx.strokeStyle = SECONDARY_CYAN;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.restore();

      drawJoint(basePos.x, basePos.y, 'BASE', PRIMARY_BLUE);
      drawJoint(shoulderPos.x, shoulderPos.y, 'SHOULDER', PRIMARY_BLUE);
      drawJoint(elbowPos.x, elbowPos.y, 'ELBOW', PRIMARY_BLUE);
      drawJoint(wristPos.x, wristPos.y, 'WRIST', SECONDARY_CYAN);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="w-full h-[400px] md:h-[500px]" />;
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
          >
            Engineering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
              Future of Motion
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            A production-grade 4-DOF robotic manipulator integrated with autonomous app control, automatic movement, and localized feedback systems.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <a 
              href={apkUrl} 
              download="Robotic_Arm_Control.apk"
              onClick={() => toast.success("Starting App Download...")}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/25 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Download App
            </a>
            <a href="#features" className="px-8 py-4 bg-background border border-border hover:bg-muted rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95">
              Explore Features
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto border-t border-border pt-12"
          >
            {[
              { label: 'DOF', val: '4' },
              { label: 'Instruction', val: 'Application' },
              { label: 'Controller', val: 'Arduino Uno' },
              { label: 'Rotation', val: '180°' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-blue-500">{stat.val}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "App Control System",
      desc: "Real-time spatial manipulation and telemetry sync utilizing secure Bluetooth streaming links.",
      tags: ["Bluetooth"]
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Ultrasonic Sensor",
      desc: "Automatic object detection buffers enabling dynamic obstacle routing and distance calculations.",
      tags: ["Automatic"]
    },
    {
      icon: <Hand className="w-6 h-6" />,
      title: "Save and Run",
      desc: "Record sequence loops natively onto onboard memory matrices for persistent offline operation.",
      tags: ["EEPROM"]
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Core Capabilities</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-background border border-border p-8 rounded-2xl hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-2xl" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded-md text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OrbitalCanvas = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += 0.01;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#1e293b' : '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = PRIMARY_BLUE;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 12px Poppins';
      ctx.fillStyle = PRIMARY_BLUE;
      ctx.textAlign = 'center';
      ctx.fillText('4 DOF', centerX, centerY + 5);

      for (let i = 1; i <= 6; i++) {
        const radius = 40 + i * 25;
        const speed = 0.5 + (7 - i) * 0.2;
        const angle = time * speed;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, angle + Math.PI / 2);
        ctx.strokeStyle = i % 2 === 0 ? PRIMARY_BLUE : SECONDARY_CYAN;
        ctx.lineWidth = 3;
        ctx.stroke();

        const dotX = centerX + Math.cos(angle) * radius;
        const dotY = centerY + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? PRIMARY_BLUE : SECONDARY_CYAN;
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = i % 2 === 0 ? PRIMARY_BLUE : SECONDARY_CYAN;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="w-full h-[400px]" />;
};

const Specs = ({ isDark }: { isDark: boolean }) => {
  const specs = [
    { label: 'DOF', val: '4 Axes of Freedom' },
    { label: 'Controller', val: 'Arduino Uno R3' },
    { label: 'Motors', val: 'MG996R Metal Gear / SG90 Servos' },
    { label: 'Communication', val: 'HC-05 Bluetooth Module' },
    { label: 'Programming Language', val: 'Embedded C++' },
    { label: 'Control Systems', val: 'Android Native Application' },
    { label: 'Power Mapping', val: '5V - 6V DC External Input' },
    { label: 'Material Structural', val: 'High-Density Reinforced Composites' },
    { label: 'End Effector', val: 'Interchangeable Mechanical Gripper' }
  ];

  return (
    <section id="specs" className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-8">Technical Specifications</h2>
            <div className="space-y-4">
              {specs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-border">
                  <span className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{spec.label}</span>
                  <span className="font-semibold text-sm text-right">{spec.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-muted/30 rounded-3xl p-8 relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 p-6 z-10">
                <div className="text-blue-500 font-black text-xs uppercase tracking-tighter">Kinematics Visualization</div>
                <div className="text-2xl font-bold">Inverse Vector Linkages</div>
             </div>
             <OrbitalCanvas isDark={isDark} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Roadmap = () => {
  const steps = [
    {
      title: "Basic Servo Arm Configuration",
      phase: "Phase 1",
      desc: "Fundamental structural layout tracking joint paths via simple localized manual feedback dials.",
      tags: ["Hardware Design"]
    },
    {
      title: "Smartphone Bluetooth Sync",
      phase: "Phase 2",
      desc: "Creating custom data translation pipelines that parse real-time incoming application streams.",
      tags: ["Firmware Map"]
    },
    {
      title: "Autonomous Processing Loops",
      phase: "Phase 3",
      desc: "Synchronizing sensory loops for closed-circuit spatial picking routines without human triggers.",
      tags: ["Automation Core"]
    }
  ];

  return (
    <section id="roadmap" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Project Development Roadmap</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="relative border-l-2 border-border ml-4 md:ml-0 md:left-1/2">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-16 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right md:ml-[-50%]' : 'md:pl-12 md:ml-[50%]'}`}
            >
              <div className={`absolute top-0 w-8 h-8 rounded-full bg-background border-4 border-border flex items-center justify-center z-10 
                ${i % 2 === 0 ? 'right-[-20px] md:right-[-18px]' : 'left-[-42px] md:left-[-18px]'} 
                hover:border-blue-500 transition-colors cursor-pointer group`}
              >
                <div className="w-2 h-2 rounded-full bg-border group-hover:bg-blue-500 transition-colors" />
              </div>
              
              <div className="bg-background border border-border p-6 rounded-2xl shadow-sm hover:border-blue-500/50 transition-all">
                <div className="text-blue-500 font-bold text-xs mb-2">{step.phase}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{step.desc}</p>
                <div className={`flex flex-wrap gap-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                  {step.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded text-[10px] font-bold uppercase tracking-wider">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppDownload = () => {
  const images = [
    "https://storage.googleapis.com/dala-prod-public-storage/attachments/07902664-9ed0-48f8-8673-721c5fb5a590/1779055891197_photo_2026-05-18_01-10-14.jpg",
    "https://storage.googleapis.com/dala-prod-public-storage/attachments/07902664-9ed0-48f8-8673-721c5fb5a590/1779055891198_photo_2026-05-18_01-10-10.jpg",
    "https://storage.googleapis.com/dala-prod-public-storage/attachments/07902664-9ed0-48f8-8673-721c5fb5a590/1779055891198_photo_2026-05-18_01-10-07.jpg"
  ];
  
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="app" className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative mx-auto w-[280px] h-[580px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-20" />
              <div className="relative w-full h-full bg-background rounded-[2.2rem] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    src={images[activeImage]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                    alt="Application Interface Matrix"
                  />
                </AnimatePresence>
              </div>
              <div className="absolute -left-1 top-24 w-1 h-12 bg-foreground/20 rounded-r" />
              <div className="absolute -left-1 top-40 w-1 h-12 bg-foreground/20 rounded-r" />
              <div className="absolute -right-1 top-32 w-1 h-16 bg-foreground/20 rounded-l" />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-black mb-6">Control in your Pocket</h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Experience zero-latency mapping sequences. Instantly adjust specific rotational angles, save automated routines, and execute immediate macro pick paths seamlessly using your device.
            </p>

            <div className="grid gap-6 mb-10">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-6 p-6 bg-muted/30 rounded-2xl border border-border group transition-all"
              >
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Direct APK Package Download</h4>
                  <p className="text-sm text-muted-foreground font-medium">Robotic_Arm_Control.apk</p>
                  <a 
                    href={apkUrl} 
                    download="Robotic_Arm_Control.apk"
                    onClick={() => toast.success("Starting App Download...")}
                    className="text-blue-500 text-sm font-bold mt-2 inline-block hover:underline"
                  >
                    Download Compiled Resource Bundle
                  </a>
                </div>
              </motion.div>

              <div className="flex items-center gap-6 p-6 bg-background rounded-2xl border border-border">
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  <Shield className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Android Operating Minimums</h4>
                  <p className="text-sm text-muted-foreground">Compatible with Android 8.0 up to Android 14 (Target SDK 34)</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 bg-background rounded-2xl border border-border">
                <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                  <ExternalLink className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Hardware Deployment Guide</h4>
                  <p className="text-sm text-muted-foreground">Complete blueprint setup and pairing rules.</p>
                  <button 
                    onClick={() => toast.success("Loading schematic references...")}
                    className="text-blue-500 text-sm font-bold mt-2 inline-block hover:underline text-left"
                  >
                    View System Setup Reference Documentation
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
               <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  <strong>Installation Parameter:</strong> Because this application loads natively, authorizing package execution under unknown origins inside standard security submenus configures operational readiness.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const techs = [
    { name: 'HC-05 Stream', cat: 'Wireless Communications', icon: '📡' },
    { name: 'Embedded C++', cat: 'Firmware Architecture', icon: '⚙️' },
    { name: 'Arduino Uno R3', cat: 'Central Processing Hub', icon: '🤖' },
    { name: 'Ultrasonic Array', cat: 'Proximity Infrastructure', icon: '👁️' }
  ];

  return (
    <section id="tech" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">Core Tech Stack</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techs.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ borderColor: PRIMARY_BLUE, scale: 1.05 }}
              className="bg-background border border-border p-6 rounded-2xl transition-all group"
            >
              <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">{t.icon}</div>
              <h4 className="font-bold text-lg">{t.name}</h4>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{t.cat}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArchitectureCanvas = ({ isDark }: { isDark: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const nodes = [
      { id: 'app', label: 'Mobile Control App', x: 0.15, y: 0.5 },
      { id: 'hc05', label: 'HC-05 Bluetooth Receiver', x: 0.45, y: 0.3 },
      { id: 'uno', label: 'Arduino processing Hub', x: 0.45, y: 0.7 },
      { id: 'servos', label: '4x Active Servo Arrays', x: 0.8, y: 0.5 }
    ];

    const connections = [
      ['app', 'hc05'], ['hc05', 'uno'], ['uno', 'servos']
    ];

    const particles: { connIdx: number, t: number, speed: number }[] = [];
    for(let i = 0; i < 15; i++) {
        particles.push({
            connIdx: Math.floor(Math.random() * connections.length),
            t: Math.random(),
            speed: 0.003 + Math.random() * 0.004
        });
    }

    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      connections.forEach((conn) => {
        const n1 = nodes.find(n => n.id === conn[0])!;
        const n2 = nodes.find(n => n.id === conn[1])!;
        
        ctx.beginPath();
        ctx.moveTo(n1.x * w, n1.y * h);
        ctx.lineTo(n2.x * w, n2.y * h);
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      particles.forEach((p) => {
        const conn = connections[p.connIdx];
        const n1 = nodes.find(n => n.id === conn[0])!;
        const n2 = nodes.find(n => n.id === conn[1])!;

        p.t += p.speed;
        if (p.t > 1) p.t = 0;

        const pX = n1.x * w + (n2.x * w - n1.x * w) * p.t;
        const pY = n1.y * h + (n2.y * h - n1.y * h) * p.t;

        ctx.beginPath();
        ctx.arc(pX, pY, 4, 0, Math.PI * 2);
        ctx.fillStyle = PRIMARY_BLUE;
        ctx.fill();
      });

      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x * w, n.y * h, 8, 0, Math.PI * 2);
        ctx.fillStyle = SECONDARY_CYAN;
        ctx.fill();

        ctx.font = 'bold 11px Poppins';
        ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
        ctx.textAlign = 'left';
        ctx.fillText(n.label, n.x * w + 15, n.y * h + 4);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="w-full h-[350px]" />;
};

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background transition-colors duration-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold tracking-tight">
                Robotic <span className="text-blue-500">Arm Interface</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              An open platform implementing customized hardware configurations coupled with fully modular mobile execution systems.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><a href="#features" className="text-muted-foreground hover:text-blue-500 transition-colors">Core Features</a></li>
              <li><a href="#specs" className="text-muted-foreground hover:text-blue-500 transition-colors">Specifications</a></li>
              <li><a href="#app" className="text-muted-foreground hover:text-blue-500 transition-colors">App Bundle Download</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Connect With Project</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-xl bg-muted hover:bg-blue-500/10 hover:text-blue-500 transition-all" aria-label="Project Repository"><Github className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-xl bg-muted hover:bg-blue-500/10 hover:text-blue-500 transition-all" aria-label="Professional Feed"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-xl bg-muted hover:bg-blue-500/10 hover:text-blue-500 transition-all" aria-label="Support Contact Email"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Robotic Arm System Architecture. Distributed open source.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground font-medium">
            <a href="#" className="hover:text-blue-500 transition-colors">Schematic Files</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Software Licensing</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div className={isDark ? 'dark bg-slate-950 text-slate-50' : 'bg-white text-slate-900'}>
      <Toaster position="bottom-right" richColors />
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      
      <main>
        <Hero />
        
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />
            <ArmCanvas isDark={isDark} />
          </div>
        </div>

        <Features />
        <Specs isDark={isDark} />
        <Roadmap />
        <AppDownload />
        <TechStack />
        
        <section id="architecture" className="py-24 border-t border-border bg-muted/10">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl font-black mb-2">System Topology</h2>
            <p className="text-sm text-muted-foreground mb-12 max-w-md mx-auto">
              Real-time messaging pathways transmitting instruction packets directly from your phone to joint level servo arrays.
            </p>
            <div className="bg-background border border-border rounded-3xl p-6 shadow-sm">
              <ArchitectureCanvas isDark={isDark} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
