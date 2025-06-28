import { useKMSKeys } from '../hooks/useKMSKeys';
import QuantumParticles from '../components/QuantumParticles';

const Index = () => {
  const { data: keys, isLoading, error } = useKMSKeys();

  // ✅ Step 1: Handle Rotate Test
  const handleRotateTest = async (keyId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rotate-test?keyId=${keyId}`, {
        method: 'POST',
      });
      const result = await response.json();
      alert(`🔁 Rotate Test triggered for key: ${keyId}`);
      console.log('✅ Rotation result:', result);
    } catch (err) {
      console.error('❌ Failed to rotate key', err);
      alert('Failed to rotate key.');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <div className="status-indicator status-loading"></div>
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-quantum-electric border-t-transparent"></div>
            <div
              className="absolute inset-0 animate-spin rounded-full h-8 w-8 border-2 border-quantum-violet border-t-transparent"
              style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}
            ></div>
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
      const redCount = keys.filter((k) => k.risk === 'RED').length;
      const yellowCount = keys.filter((k) => k.risk === 'YELLOW').length;
      const greenCount = keys.filter((k) => k.risk === 'GREEN').length;

      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="status-indicator status-success"></div>
              <span className="text-sm font-jetbrains text-quantum-electric">SYSTEM OPERATIONAL</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-bold font-jetbrains text-white mb-2">{keys.length}</p>
              <p className="text-lg font-inter text-gray-300">Quantum Keys Detected</p>
              <div className="absolute inset-0 quantum-glow opacity-20 rounded-lg"></div>
            </div>
            <div className="flex justify-center gap-4 text-lg font-bold font-jetbrains">
              <span className="text-red-400">🔴 {redCount}</span>
              <span className="text-yellow-300">🟡 {yellowCount}</span>
              <span className="text-green-400">🟢 {greenCount}</span>
            </div>
          </div>

          {/* ✅ Step 2: Key list with Rotate Test buttons */}
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.keyId}
                className="glass-card rounded-xl p-4 flex items-center justify-between text-left"
              >
                <div>
                  <div className="text-sm font-inter text-gray-300">
                    <span className="font-bold text-white">{key.keyId}</span>
                  </div>
                  <div className="text-xs font-jetbrains text-gray-400">
                    Risk Level:{' '}
                    <span
                      className={`text-${
                        key.risk === 'RED'
                          ? 'red'
                          : key.risk === 'YELLOW'
                          ? 'yellow'
                          : 'green'
                      }-400`}
                    >
                      {key.risk}
                    </span>
                  </div>
                </div>

                {key.risk === 'RED' || key.risk === 'YELLOW' ? (
                  <button
                    className="px-4 py-1 bg-quantum-electric text-white rounded-lg font-jetbrains hover:bg-blue-500 transition"
                    onClick={() => handleRotateTest(key.keyId)}
                  >
                    🔁 Rotate Test
                  </button>
                ) : (
                  <button
                    className="px-4 py-1 bg-gray-600 text-gray-300 rounded-lg font-jetbrains cursor-not-allowed"
                    disabled
                  >
                    ✅ No Action
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-quantum-gradient relative overflow-hidden">
      <QuantumParticles />

      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>
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
