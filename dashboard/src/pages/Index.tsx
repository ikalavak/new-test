import { useState } from 'react';
import { useKMSKeys } from '../hooks/useKMSKeys';
import QuantumParticles from '../components/QuantumParticles';
import { toast } from 'react-hot-toast';

const Index = () => {
  const { data: keys, isLoading, error, refetch } = useKMSKeys();
  const [isRotating, setIsRotating] = useState<string | null>(null);

  // 🔁 Rotate Test API handler
  const handleRotateTest = async (keyId: string, alias: string) => {
    setIsRotating(keyId);
    const loadingToast = toast.loading('Processing...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rotate-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId, alias }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'API Error');
      }

      toast.success(`✅ Rotate successful for ${keyId}`, { id: loadingToast });
      refetch(); // 🔄 Refresh inventory after success
    } catch (error: any) {
      console.error('❌ Rotate Error:', error);
      toast.error(`❌ Failed: ${error.message}`, { id: loadingToast });
    } finally {
      setIsRotating(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center space-x-3">
          <span className="text-lg font-jetbrains text-gray-200">Loading key count…</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center space-y-3">
          <span className="text-sm font-jetbrains text-quantum-pink">SYSTEM ERROR</span>
          <p className="text-lg font-jetbrains text-red-300">
            {error instanceof Error ? error.message : 'Failed to fetch data'}
          </p>
        </div>
      );
    }

    if (keys) {
      const redCount = keys.filter(k => k.risk === 'RED').length;
      const yellowCount = keys.filter(k => k.risk === 'YELLOW').length;
      const greenCount = keys.filter(k => k.risk === 'GREEN').length;

      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm font-jetbrains text-quantum-electric">SYSTEM OPERATIONAL</span>
            </div>
            <div className="relative">
              <p className="text-4xl font-bold font-jetbrains text-white mb-2">{keys.length}</p>
              <p className="text-lg font-inter text-gray-300">Quantum Keys Detected</p>
            </div>
            <div className="flex justify-center gap-4 text-lg font-bold font-jetbrains">
              <span className="text-red-400">🔴 {redCount}</span>
              <span className="text-yellow-300">🟡 {yellowCount}</span>
              <span className="text-green-400">🟢 {greenCount}</span>
            </div>
          </div>

          {/* 🔑 Key List */}
          <div className="space-y-4">
            {keys.map((key) => (
              <div
                key={key.keyId}
                className="glass-card rounded-xl p-4 flex items-center justify-between"
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

                {/* 🔁 Rotate Test Button */}
                {key.risk === 'RED' || key.risk === 'YELLOW' ? (
                  <button
                    className={`px-4 py-1 bg-quantum-electric text-white rounded-lg font-jetbrains hover:bg-blue-500 transition ${
                      isRotating === key.keyId ? 'opacity-50 cursor-wait' : ''
                    }`}
                    onClick={() => handleRotateTest(key.keyId, key.alias || 'N/A')}
                    disabled={isRotating !== null}
                  >
                    {isRotating === key.keyId ? '🔄 Rotating...' : '🔁 Rotate Test'}
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

          {isRotating && (
            <div className="text-center text-blue-400 mt-4">
              🔄 Processing Rotate Test...
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-quantum-gradient relative overflow-hidden">
      <QuantumParticles />
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
                {renderContent()}
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-sm font-jetbrains text-gray-400">
              Real-time monitoring • Post-quantum cryptography • Enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
