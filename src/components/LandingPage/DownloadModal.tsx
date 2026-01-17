import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, ChevronRight, Archive, Beaker } from 'lucide-react';
import Modal from '../global/Modal';
import Button from '../global/Button';
import { mockVersions, mockPlatforms, mockDownloads } from '../../config/apiconfig';
import { useNavigate } from 'react-router-dom';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const navigate = useNavigate();

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    setStep(2);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setStep(3);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedVersion('');
      setSelectedPlatform('');
    }, 300);
  };

  const downloadData = mockDownloads.find(
    (d) => d.version === selectedVersion && d.platform === selectedPlatform
  ) || {
    downloadLink: '#',
    size: '2.0 MB',
    releaseDate: new Date().toISOString().split('T')[0],
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Download Pulse">
      <div className="min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-[#ff2929] text-white'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                {step > s ? <Check size={20} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                    step > s ? 'bg-[#ff2929]' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">Select Minecraft Version</h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 text-sm">
                <p className="text-gray-400">Choose the version you want to use</p>
                
                <div className="hidden sm:block w-px h-4 bg-white/10 mx-1" />
                <span className=" text-gray-500 text-xs uppercase font-bold tracking-wider">Or go to:</span>

                <div className="flex items-center gap-2">

                  <Button variant='secondary' size='small' icon={Archive} onClick={() => navigate('/releases')}>
                      Releases
                  </Button>

                  <Button variant='secondary' size='small' icon={Beaker} onClick={() => navigate('/devbuilds')}>
                      Dev Builds
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {mockVersions.map((version) => (
                  <button
                    key={version}
                    onClick={() => handleVersionSelect(version)}
                    className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff2929]/50 hover:bg-[#ff2929]/5 transition-all text-left group relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="text-xl font-bold text-white mb-1">{version}</div>
                      <div className="text-sm text-gray-500 group-hover:text-[#ff2929] transition-colors">
                        Latest Release
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Select Platform</h3>
              <p className="text-gray-400 mb-6">
                Version: <span className="text-[#ff2929]">{selectedVersion}</span>
              </p>
              <div className="space-y-3">
                {mockPlatforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className="w-full p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#ff2929]/50 hover:bg-[#ff2929]/5 transition-all text-left group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xl font-bold text-white mb-1">{platform.name}</div>
                      <div className="text-sm text-gray-500">{platform.description}</div>
                    </div>
                    <ChevronRight className="text-gray-500 group-hover:text-[#ff2929] transition-colors" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-6 text-gray-400 hover:text-white transition-colors"
              >
                ← Back to version selection
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-[#ff2929]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-[#ff2929]" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Download</h3>
              <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white font-semibold">{selectedVersion}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white font-semibold capitalize">{selectedPlatform}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white font-semibold">{downloadData.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white font-semibold">{downloadData.releaseDate}</span>
                </div>
              </div>
              <Button
                onClick={() => window.open(downloadData.downloadLink, '_blank')}
                variant="primary"
                size="large"
                icon={Download}
                className="w-full"
              >
                Download Pulse
              </Button>
              <button
                onClick={() => setStep(2)}
                className="mt-4 text-gray-400 hover:text-white transition-colors"
              >
                ← Change platform
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
