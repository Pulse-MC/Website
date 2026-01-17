export const BASE_URL = 'https://api.pulsemc.dev';

export interface PlatformData {
  id: string;
  version: string;
  platform: string;
  downloadLink: string;
  size: string;
  releaseDate: string;
}

export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlight?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const mockVersions = ['1.21.5', '1.21.4', '1.20.1', '1.19.4'];

export const mockPlatforms = [
  { id: 'forge', name: 'Forge', description: 'Mod loading framework' },
  { id: 'fabric', name: 'Fabric', description: 'Lightweight mod loader' },
  { id: 'purpur', name: 'Purpur', description: 'Feature-rich server' },
  { id: 'paper', name: 'Paper', description: 'High-performance server' },
  { id: 'velocity', name: 'Velocity', description: 'Modern proxy' },
];

export const mockDownloads: PlatformData[] = [
  {
    id: '1',
    version: '1.21.5',
    platform: 'forge',
    downloadLink: '#',
    size: '2.4 MB',
    releaseDate: '2024-01-15',
  },
  {
    id: '2',
    version: '1.21.5',
    platform: 'fabric',
    downloadLink: '#',
    size: '1.8 MB',
    releaseDate: '2024-01-15',
  },
  {
    id: '3',
    version: '1.21.4',
    platform: 'paper',
    downloadLink: '#',
    size: '3.1 MB',
    releaseDate: '2024-01-10',
  },
];

export const mockFeatures: FeatureData[] = [
  {
    id: '1',
    title: 'Packet Batching',
    description: 'Groups multiple packets into single transmissions, reducing network overhead by up to 70%',
    icon: 'layers',
    highlight: true,
    size: 'large',
  },
  {
    id: '2',
    title: 'Zero Latency',
    description: 'Sub-millisecond processing with optimized protocol handling',
    icon: 'zap',
    size: 'medium',
  },
  {
    id: '3',
    title: 'Smart Compression',
    description: 'Adaptive compression algorithms that balance speed and bandwidth',
    icon: 'package',
    size: 'medium',
  },
  {
    id: '4',
    title: 'Protocol Optimization',
    description: 'Native support for modern Minecraft protocols with backwards compatibility',
    icon: 'network',
    size: 'small',
  },
  {
    id: '5',
    title: 'Real-time Analytics',
    description: 'Monitor network performance with built-in diagnostics',
    icon: 'activity',
    size: 'small',
  },
  {
    id: '6',
    title: 'Plugin Ready',
    description: 'Seamless integration with existing server infrastructure',
    icon: 'plug',
    size: 'small',
  },
];
