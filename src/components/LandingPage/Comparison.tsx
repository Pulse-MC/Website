import React, { useRef, useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, 
  Cpu, 
  Zap, 
  Network, 
  Terminal, 
  Layers, 
  Box, 
  Activity 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatedBeam } from "@/components/ui/animated-beam"; 

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NodeIcon = forwardRef<HTMLDivElement, { icon: any; color?: string; label: string; active?: boolean; shake?: boolean }>(
  ({ icon: Icon, color = "text-gray-500", label, active = false, shake = false }, ref) => {
    return (
      <div ref={ref} className="z-10 flex flex-col items-center relative bg-transparent p-2">
        <motion.div
          animate={shake ? { 
            x: [-2, 2, -2, 2, 0], 
            filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
          } : {}}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-xl border bg-black shadow-xl transition-all duration-300",
            active ? "border-[#ff2929] bg-[#ff2929]/10 shadow-[0_0_20px_rgba(255,41,41,0.3)]" : "border-white/10"
          )}
        >
          <Icon className={cn("h-6 w-6 transition-colors duration-300", active ? "text-[#ff2929]" : color)} />
        </motion.div>
        <span className="mt-2 text-[10px] uppercase tracking-wider font-mono text-gray-500 whitespace-nowrap">
          {label}
        </span>
      </div>
    );
  }
);
NodeIcon.displayName = "NodeIcon";

const CpuVisualization = () => {
  const vanillaContainerRef = useRef<HTMLDivElement>(null);
  const pulseContainerRef = useRef<HTMLDivElement>(null);

  const logicRefV = useRef<HTMLDivElement>(null);
  const cpuRefV = useRef<HTMLDivElement>(null);
  const netRefV = useRef<HTMLDivElement>(null);

  const logicRefP = useRef<HTMLDivElement>(null);
  const bufferRefP = useRef<HTMLDivElement>(null);
  const cpuRefP = useRef<HTMLDivElement>(null);
  const netRefP = useRef<HTMLDivElement>(null);

  const [vanillaStress, setVanillaStress] = useState(false);
  const [bufferSize, setBufferSize] = useState(1);
  const [pulseBeam1, setPulseBeam1] = useState(false);
  const [pulseBeam2, setPulseBeam2] = useState(false);
  const [cpuPulseActive, setCpuPulseActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVanillaStress((prev) => !prev);
    }, 150); 
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fillInterval = setInterval(() => {
      setBufferSize(prev => (prev < 1.3 ? prev + 0.05 : 1));
    }, 100);

    const flushInterval = setInterval(() => {
      setPulseBeam1(true);
      setBufferSize(1);

      setTimeout(() => {
        setCpuPulseActive(true);
      }, 400);

      setTimeout(() => {
        setPulseBeam2(true);
      }, 500); 

      setTimeout(() => {
        setPulseBeam1(false);
      }, 700);

      setTimeout(() => {
        setCpuPulseActive(false);
        setPulseBeam2(false);
      }, 1200);

    }, 2500);

    return () => {
      clearInterval(fillInterval);
      clearInterval(flushInterval);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 w-full max-w-5xl mx-auto font-sans">
      
      <div className="relative flex flex-col items-center h-[240px] border border-white/10 rounded-3xl bg-neutral-900/50 p-6 overflow-hidden">
        <div className="w-full flex justify-between items-start mb-8 z-20 px-4">
            <div>
                <h3 className="text-xl font-bold text-gray-200">Vanilla</h3>
                <p className="text-xs text-gray-500 mt-1">Direct unbuffered calls</p>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-[10px] font-mono text-gray-500 mb-1">CPU INTERRUPTS</p>
                <div className="text-xs text-[#ff2929] font-mono border border-[#ff2929]/20 bg-[#ff2929]/10 px-2 py-1 rounded animate-pulse">
                    CRITICAL
                </div>
            </div>
        </div>

        <div ref={vanillaContainerRef} className="flex flex-row items-center justify-between w-full px-4 md:px-12 relative flex-1">
            <AnimatedBeam 
                containerRef={vanillaContainerRef} 
                fromRef={logicRefV} 
                toRef={cpuRefV} 
                duration={0.3} 
                gradientStartColor="#ff2929" 
                gradientStopColor="#ff5555"
            />

            <AnimatedBeam 
                containerRef={vanillaContainerRef} 
                fromRef={cpuRefV} 
                toRef={netRefV} 
                duration={0.3}
                gradientStartColor="#ff2929" 
                gradientStopColor="#555" 
            />

            <NodeIcon ref={logicRefV} icon={Box} label="Game Logic" />
            
            <div className="relative">
                <NodeIcon 
                    ref={cpuRefV} 
                    icon={Cpu} 
                    label="CPU" 
                    active={vanillaStress} 
                    shake={vanillaStress} 
                />
                <div className={cn("absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#ff2929] font-mono whitespace-nowrap transition-opacity duration-100", vanillaStress ? "opacity-100" : "opacity-0")}>
                    IRQ!
                </div>
            </div>

            <NodeIcon ref={netRefV} icon={Network} label="Network" />
        </div>
      </div>

      <div className="relative flex flex-col items-center h-[240px] border border-white/10 rounded-3xl bg-neutral-900/50 p-6 overflow-hidden">
        <div className="w-full flex justify-between items-start mb-8 z-20 px-4">
            <div>
                <h3 className="text-xl font-bold text-gray-200">Pulse</h3>
                <p className="text-xs text-gray-500 mt-1">Batched buffer processing</p>
            </div>
             <div className="flex flex-col items-end">
                <p className="text-[10px] font-mono text-gray-500 mb-1">CPU LOAD</p>
                <div className="text-xs text-emerald-500 font-mono border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                    OPTIMAL
                </div>
            </div>
        </div>

        <div ref={pulseContainerRef} className="flex flex-row items-center justify-between w-full px-4 md:px-12 relative flex-1">
             <AnimatedBeam 
                containerRef={pulseContainerRef} 
                fromRef={logicRefP} 
                toRef={bufferRefP} 
                duration={1.5} 
                gradientStartColor="#374151" 
                gradientStopColor="#10b981" 
            />

            {pulseBeam1 && (
                <AnimatedBeam 
                    containerRef={pulseContainerRef} 
                    fromRef={bufferRefP} 
                    toRef={cpuRefP} 
                    duration={0.6}
                    gradientStartColor="#10b981" 
                    gradientStopColor="#10b981" 
                    pathWidth={4}
                />
            )}

            {pulseBeam2 && (
                <AnimatedBeam 
                    containerRef={pulseContainerRef} 
                    fromRef={cpuRefP} 
                    toRef={netRefP} 
                    duration={0.6}
                    gradientStartColor="#10b981" 
                    gradientStopColor="#10b981" 
                    pathWidth={4}
                />
            )}

            <NodeIcon ref={logicRefP} icon={Box} label="Game Logic" />

            <div className="relative flex items-center justify-center">
                <motion.div 
                    animate={{ scale: bufferSize }}
                    className="absolute w-12 h-12 bg-emerald-500/5 rounded-full border border-emerald-500/30"
                />
                <NodeIcon 
                    ref={bufferRefP} 
                    icon={Layers} 
                    label="Buffer" 
                    color="text-emerald-500" 
                    active={bufferSize > 1.2}
                />
                <div className="absolute -top-6 text-[10px] text-emerald-500/80 font-mono">
                    {pulseBeam1 ? "FLUSHING..." : "ACCUMULATING"}
                </div>
            </div>

            <NodeIcon 
                ref={cpuRefP} 
                icon={Cpu} 
                label="CPU" 
                active={cpuPulseActive} 
                color={cpuPulseActive ? "text-emerald-500" : "text-gray-600"} 
            />
            
            <NodeIcon ref={netRefP} icon={Network} label="Network" />
        </div>
      </div>
    </div>
  );
};


const LOG_DATA = [
    "[DEBUG] Zombie spawned (ID: 402)",
    "[DEBUG] Zombie equiped minecraft:diamond_sword",
    "[DEBUG] Zombie equiped minecraft:iron_helmet",
    "[DEBUG] Zombie teleported (x: 100, y: 64, z: 712)",
    "[DEBUG] Zombie walk (x: 114, y: 65, z: 713)",
];

const ConsoleDemo = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const serverRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<HTMLDivElement>(null);
    const [vanillaLogs, setVanillaLogs] = useState<string[]>([]);
    const [pulseLogs, setPulseLogs] = useState<string[]>([]);
    const [isAnimating, setIsAnimating] = useState(false);

    const [flyingPacketsV, setFlyingPacketsV] = useState<number[]>([]);

    const [pulseBeam, setPulseBeam] = useState(false);

    useEffect(() => {
        const runSimulation = async () => {
            setIsAnimating(true);
            setVanillaLogs([]);
            setPulseLogs([]);

            for (let i = 0; i < LOG_DATA.length; i++) {
                setFlyingPacketsV(prev => [...prev, i]);

                await new Promise(r => setTimeout(r, 300));

                setVanillaLogs(prev => Array.from(new Set([...prev, LOG_DATA[i]])));
                setFlyingPacketsV(prev => prev.filter(id => id !== i));

                await new Promise(r => setTimeout(r, 150));
            }

            await new Promise(r => setTimeout(r, 1000));

            setPulseBeam(true);

            await new Promise(r => setTimeout(r, 600));

            setPulseLogs(LOG_DATA);
            setPulseBeam(false);

            await new Promise(r => setTimeout(r, 2000));
            runSimulation();
        };

        runSimulation();
        return () => {}; 
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-12" ref={containerRef}>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-mono text-xs">VANILLA (PAPER)</span>
                    <Activity size={14} className="text-[#ff2929]" />
                </div>
                
                <div className="flex items-center justify-between px-4 h-20 relative">
                    <div ref={serverRef} className="z-10 bg-black border border-gray-700 p-2 rounded-lg">
                        <Server size={20} className="text-gray-400" />
                    </div>

                    <div className="flex-1 relative h-full mx-4 overflow-hidden">
                        <div className="absolute top-1/2 w-full h-[1px] bg-gray-800" />
                        <AnimatePresence>
                            {flyingPacketsV.map((id) => (
                                <motion.div
                                    key={id}
                                    initial={{ left: "0%", opacity: 1 }}
                                    animate={{ left: "100%", opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                    className="absolute top-1/2 -mt-1.5 w-3 h-3 bg-[#ff2929] rounded-full shadow-[0_0_10px_#ff2929]"
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="z-10 bg-black border border-gray-700 p-2 rounded-lg">
                        <MonitorIcon />
                    </div>
                </div>

                <div className="h-40 bg-[#0a0a0a] rounded border border-white/5 p-3 font-mono text-[10px] md:text-xs text-green-400/80 overflow-hidden font-bold shadow-inner">
                    <div className="opacity-50 mb-2 border-b border-white/5 pb-1">user@client:~$ tail -f network.log</div>
                    {vanillaLogs.map((log, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-1 text-red-400"
                        >
                            <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                        </motion.div>
                    ))}
                    {vanillaLogs.length === 0 && <span className="animate-pulse text-gray-700">Waiting for data...</span>}
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 font-mono text-xs">PULSE SOFTWARE</span>
                    <Zap size={14} className="text-emerald-500" />
                </div>

                <div className="flex items-center justify-between px-4 h-20 relative">
                    {pulseBeam && (
                         <div className="absolute left-12 right-12 top-1/2 h-[4px] -mt-[2px] z-0">
                             <motion.div 
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.6, ease: "circIn" }}
                                className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                             />
                         </div>
                    )}

                    <div className={cn("z-10 bg-black border p-2 rounded-lg transition-colors duration-500", pulseBeam ? "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "border-gray-700")}>
                        <Server size={20} className={pulseBeam ? "text-emerald-500" : "text-gray-400"} />
                    </div>
                    
                    <div className="flex-1 h-full mx-4 flex items-center justify-center">
                         <span className={cn("text-[10px] font-mono transition-colors", pulseBeam ? "text-emerald-500" : "text-transparent")}>
                            BATCH SIZE: 4
                         </span>
                    </div>

                    <div ref={clientRef} className={cn("z-10 bg-black border p-2 rounded-lg transition-colors duration-200 delay-500", !pulseBeam && pulseLogs.length > 0 ? "border-emerald-500 bg-emerald-900/20" : "border-gray-700")}>
                        <MonitorIcon color={!pulseBeam && pulseLogs.length > 0 ? "text-emerald-500" : undefined} />
                    </div>
                </div>
                <div className="h-40 bg-[#0a0a0a] rounded border border-white/5 p-3 font-mono text-[10px] md:text-xs text-emerald-400 overflow-hidden font-bold shadow-inner">
                    <div className="opacity-50 mb-2 border-b border-white/5 pb-1">user@client:~$ tail -f pulse_network.log</div>
                    {pulseLogs.map((log, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-1"
                        >
                             <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span> {log}
                        </motion.div>
                    ))}
                    {pulseLogs.length === 0 && <span className="animate-pulse text-gray-700">Buffering state...</span>}
                </div>
            </div>

        </div>
    );
};

const MonitorIcon = ({ color = "text-gray-400" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" height="20" viewBox="0 0 24 24" 
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
        className={color}
    >
        <rect width="20" height="14" x="2" y="3" rx="2" />
        <line x1="8" x2="16" y1="21" y2="21" />
        <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
);

export default function NetworkComparisonSection() {
  return (
    <section className="relative w-full py-24 px-4 bg-[#050505] overflow-hidden text-white min-h-screen flex flex-col items-center">
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: 'radial-gradient(circle at center, #222 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#ff2929]/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl w-full z-10 relative">
        <div className="text-center mb-16">
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 font-syne"
          >
            Data <span className="text-[#ff2929]">Fragmentation</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Visualizing the impact of packet batching on CPU interrupts and network latency.
          </motion.p>
        </div>
        <div>
            <div className="flex items-center gap-2 mb-6">
                <Terminal className="text-[#ff2929]" size={20} />
                <h3 className="text-xl font-bold uppercase tracking-wider font-jet text-[#808080]">// Network Replication Jitter</h3>
            </div>
            <ConsoleDemo />
        </div>

      </div>
    </section>
  );
}