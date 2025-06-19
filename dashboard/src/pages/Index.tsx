import { useKMSKeys } from '../hooks/useKMSKeys';
import QuantumParticles from '../components/QuantumParticles';

const Index = () => {
  const { data: keys, isLoading, error } = useKMSKeys();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className="status-indicator status-loading"></div>
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-quantum-electric border-t-transparent"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-8 w-8 border-2 border-quantum-violet border-t-transparent" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}></div>
          </div>
          <span className="text-lg font-jetbrains text-gray-200">Loading key count…</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="status-indicator status-error"></div>
            <span className="text-sm font-jetbrains text-quantum-pink">SYSTEM ERROR</span>
          </div>
          <p className="text-lg font-jetbrains text-red-300">
            {error instanceof Error ? error.message : 'Failed to fetch data'}
          </p>
          <div className="text-xs font-jetbrains text-gray-400 mt-2">
            Check network connection and API availability
          </div>
        </div>
      );
    }

    if (keys !== undefined) {
      const redCount = keys.filter(k => k.risk === "RED").length;
      const yellowCount = keys.filter(k => k.risk === "YELLOW").length;
      const greenCount = keys.filter(k => k.risk === "GREEN").length;

      return (
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="status-indicator status-success"></div>
            <span className="text-sm font-jetbrains text-quantum-electric">SYSTEM OPERATIONAL</span>
          </div>

          <div className="relative">
            <p className="text-4xl font-bold font-jetbrains text-white mb-2">
              {keys.length}
            </p>
            <p className="text-lg font-inter text-gray-300">
              Quantum Keys Detected
            </p>
            <div className="absolute inset-0 quantum-glow opacity-20 rounded-lg"></div>
          </div>

          {/* 🔴🟡🟢 BADGE COUNTS */}
          <div className="flex justify-center gap-4 text-lg font-bold font-jetbrains">
            <span className="text-red-400">🔴 {redCount}</span>
            <span className="text-yellow-300">🟡 {yellowCount}</span>
            <span className="text-green-400">🟢 {greenCount}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 text-center">
            <div className="glass-card rounded-lg p-3">
              <div className="text-quantum-electric font-jetbrains text-sm">ENCRYPTION</div>
              <div className="text-white font-bold">AES-256</div>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-quantum-violet font-jetbrains text-sm">STATUS</div>
              <div className="text-white font-bold">SECURE</div>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-quantum-pink font-jetbrains text-sm">QUANTUM</div>
              <div className="text-white font-bold">READY</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-quantum-gradient relative overflow-hidden">
      <QuantumParticles />

      {/* Grid Background Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-3xl overflow-hidden relative">
            <div className="relative p-8 text-center">
              <div className="scanning-animation rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center glass-card">
                <span className="text-4xl">🔐</span>
              </div>
              <h1 className="text-4xl font-bold font-inter text-gradient mb-2">QuantumFortis</h1>
              <h2 className="text-xl font-inter text-gray-300 mb-1">Security Dashboard</h2>
              <div className="text-sm font-jetbrains text-gray-400">
                Quantum-Resistant Cryptographic Infrastructure
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-quantum-electric to-quantum-violet mx-auto mt-6 mb-2"></div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              <div className="glass-card rounded-2xl p-8 relative">
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-quantum-electric opacity-60"></div>
                    <div className="w-2 h-2 rounded-full bg-quantum-violet opacity-60"></div>
                    <div className="w-2 h-2 rounded-full bg-quantum-pink opacity-60"></div>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-jetbrains text-gray-300 mb-2">
                    AWS KMS Inventory Scan
                  </h3>
                </div>
                {renderContent()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm font-jetbrains text-gray-400">
              Real-time monitoring • Post-quantum cryptography • Enterprise-grade security
            </p>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-quantum-electric"></div>
                <span className="text-xs font-jetbrains text-gray-500">Live</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-quantum-violet"></div>
                <span className="text-xs font-jetbrains text-gray-500">Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-quantum-pink"></div>
                <span className="text-xs font-jetbrains text-gray-500">Quantum-Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
