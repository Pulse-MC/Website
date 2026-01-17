import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Package, Calendar, ChevronLeft, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/global/Button';
import Card from '../components/global/Card';
import { BASE_URL } from '@/config/apiconfig';

interface Release {
  version: string;
  build_number: number;
  game_version: string;
  changelog: string;
  download_url: string;
  release_date: string;
}

export default function Releases() {
  const { version, build_number } = useParams<{ version?: string; build_number?: string }>();
  const navigate = useNavigate();
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>(version || '');
  const [expandedReleases, setExpandedReleases] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchReleases = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${BASE_URL}/releases`;
        const params = new URLSearchParams();

        if (version) params.append('version', version);
        if (build_number) params.append('build_number', build_number);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch releases: ${response.statusText}`);
        }

        const data = await response.json();
        setReleases(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching releases:', err);
        setError(err instanceof Error ? err.message : 'Failed to load releases');
        setReleases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [version, build_number]);

  const availableVersions = Array.from(new Set(releases.map(r => r.game_version))).sort().reverse();

  const filteredReleases = selectedVersion
    ? releases.filter(r => r.game_version === selectedVersion)
    : releases;

  const handleVersionFilter = (ver: string) => {
    setSelectedVersion(ver);
    if (ver) {
      navigate(`/releases/${ver}`);
    } else {
      navigate('/releases');
    }
  };

  const toggleChangelog = (releaseId: string) => {
    setExpandedReleases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(releaseId)) {
        newSet.delete(releaseId);
      } else {
        newSet.add(releaseId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#ff2929] transition-colors mb-6"
          >
            <ChevronLeft size={20} />
            Back to Home
          </Link>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Stable <span className="text-[#ff2929]">Releases</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Official stable releases of Pulse. Production-ready builds with full support and documentation.
          </p>
        </motion.div>

        {availableVersions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleVersionFilter('')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  !selectedVersion
                    ? 'bg-[#ff2929] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                All Versions
              </button>
              {availableVersions.map((ver) => (
                <button
                  key={ver}
                  onClick={() => handleVersionFilter(ver)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedVersion === ver
                      ? 'bg-[#ff2929] text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  Minecraft {ver}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-[#ff2929]/20 border-t-[#ff2929] rounded-full"
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <div>
                <h3 className="text-lg font-bold text-red-500">Error Loading Releases</h3>
                <p className="text-gray-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && filteredReleases.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Releases Found</h3>
            <p className="text-gray-500">
              {selectedVersion
                ? `No releases available for Minecraft ${selectedVersion}`
                : 'Check back later for new releases'}
            </p>
          </motion.div>
        )}

        <div className="grid gap-4">
          {filteredReleases.map((release, index) => {
            const releaseId = `${release.version}-${release.build_number}`;
            const isExpanded = expandedReleases.has(releaseId);

            return (
              <motion.div
                key={releaseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6" glowOnHover>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">
                          Pulse {release.version}
                        </h3>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                          Stable
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Package size={16} />
                          <span>Minecraft {release.game_version}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar size={16} />
                          <span>{new Date(release.release_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="font-mono text-xs">Build #{release.build_number}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleChangelog(releaseId)}
                        className="flex items-center gap-2 text-[#ff2929] hover:text-[#ff4444] transition-colors font-semibold mb-3"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        {isExpanded ? 'Hide' : 'Show'} Changelog
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white/5 rounded-xl p-4 mt-4"
                        >
                          <h4 className="text-lg font-bold text-white mb-3">What's New</h4>
                          <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                            {release.changelog}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        onClick={() => window.open(release.download_url, '_blank')}
                        variant="primary"
                        size="large"
                        icon={Download}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
