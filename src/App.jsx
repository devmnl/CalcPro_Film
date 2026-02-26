import React, { useState, useEffect } from 'react';
import { Calculator, Ruler, Weight, Layers, Trash2, Info, Menu, X, Instagram, Github, Phone, ExternalLink, Download, Scissors } from 'lucide-react';

const MATERIALS = {
  BOPP: { 
    name: 'BOPP', 
    density: 0.91, 
    microns: [17, 20, 25, 30],
    color: 'bg-blue-600'
  },
  PET: { 
    name: 'PET', 
    density: 1.40, 
    microns: [12],
    color: 'bg-indigo-600'
  },
  PE: { 
    name: 'PE', 
    density: 0.92, 
    microns: [20, 25, 30, 40, 50, 60, 80, 100],
    color: 'bg-sky-600'
  },
  PP: { 
    name: 'PP', 
    density: 0.90, 
    microns: [20, 25, 30, 35, 40],
    color: 'bg-cyan-600'
  }
};

function App() {
  const [material, setMaterial] = useState('BOPP');
  const [thickness, setThickness] = useState(MATERIALS['BOPP'].microns[0]);
  const [width, setWidth] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // Slitter (Corte) State
  const [showSlitter, setShowSlitter] = useState(false);
  const [motherWidth, setMotherWidth] = useState('');
  const [motherWeight, setMotherWeight] = useState('');
  const [targetWidth, setTargetWidth] = useState('');
  const [targetWeight, setTargetWeight] = useState(''); // Peso desejado de cada bobina filha (opcional para cálculo reverso)

  useEffect(() => {
    // Sync mother roll with main inputs when opening slitter for the first time
    if (showSlitter && !motherWidth && width) setMotherWidth(width);
    if (showSlitter && !motherWeight && weight) setMotherWeight(weight);
  }, [showSlitter, width, weight]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Reset thickness when material changes if current thickness is not available
    if (!MATERIALS[material].microns.includes(thickness)) {
      setThickness(MATERIALS[material].microns[0]);
    }
  }, [material]);

  useEffect(() => {
    calculate();
  }, [material, thickness, width, weight]);

  const calculate = () => {
    if (!width || !weight || !thickness) {
      setResult(null);
      return;
    }

    const w = parseFloat(width);
    const m = parseFloat(weight);
    const t = parseFloat(thickness);
    const d = MATERIALS[material].density;

    if (isNaN(w) || isNaN(m) || isNaN(t) || w === 0 || m === 0 || t === 0) {
      setResult(null);
      return;
    }

    // Formula: Length (m) = (Weight (kg) * 1,000,000) / (Width (mm) * Thickness (microns) * Density)
    const length = (m * 1000000) / (w * t * d);
    setResult(length);
  };

  const handleReset = () => {
    setWidth('');
    setWeight('');
    setResult(null);
    setShowSlitter(false);
    setMotherWidth('');
    setMotherWeight('');
    setTargetWidth('');
    setTargetWeight('');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-black text-white py-1 px-4 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center">
            <img src="/logoheader.png" alt="CalcPro Logo" className="h-28 w-auto object-contain" />
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-900">Menu</h2>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Parceiros</h3>
                
                <a href="https://www.toder.ind.br" target="_blank" rel="noreferrer" className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={16} className="text-blue-500" />
                   </div>
                   <div className="h-16 flex items-center justify-center p-2">
                      <img src="/toderlogo.png" alt="Toder" className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                   </div>
                   <div className="text-center mt-2 border-t border-gray-100 pt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Visitar Site</span>
                   </div>
                </a>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-4">Social</h3>
                
                <a href="https://instagram.com/dev_mnl" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg group">
                  <div className="bg-gradient-to-tr from-yellow-400 to-purple-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <Instagram size={20} />
                  </div>
                  <span className="font-medium">Instagram</span>
                  <ExternalLink size={14} className="ml-auto opacity-50" />
                </a>

                <a href="https://wa.me/5511932590460" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors p-2 hover:bg-green-50 rounded-lg group">
                  <div className="bg-green-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <span className="font-medium">WhatsApp</span>
                  <ExternalLink size={14} className="ml-auto opacity-50" />
                </a>

                <a href="https://github.com/devmnl" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg group">
                  <div className="bg-gray-900 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                    <Github size={20} />
                  </div>
                  <span className="font-medium">GitHub</span>
                  <ExternalLink size={14} className="ml-auto opacity-50" />
                </a>

                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg group w-full text-left"
                  >
                    <div className="bg-blue-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <Download size={20} />
                    </div>
                    <span className="font-medium">Instalar App</span>
                  </button>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setShowAbout(true);
                  }}
                  className="flex items-center gap-3 text-gray-700 w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <Info size={20} className="text-blue-600" />
                  <span className="font-medium">Sobre o App</span>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 mt-auto">
              <p>CalcPro v1.0.0</p>
              <p>© 2024 CalcPro Film</p>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <img src="/logoheader.png" alt="CalcPro Logo" className="h-39 w-auto object-contain mx-auto mb-4" />
              
            </div>
            
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed mb-6">
              <p>
                O CalcPro é uma ferramenta profissional desenvolvida para auxiliar no cálculo de metragem de filmes BOPP, PET, PE e PP.
              </p>
              <p>
                Ideal para profissionais da indústria de embalagens flexíveis que necessitam de cálculos rápidos e precisos.
              </p>
            </div>

            <button 
              onClick={() => setShowAbout(false)}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-6 pb-24">
        
        {/* Material Selection */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Layers size={16} /> Material
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(MATERIALS).map((key) => (
              <button
                key={key}
                onClick={() => setMaterial(key)}
                className={`py-3 px-1 rounded-xl text-sm font-bold transition-all duration-200 ${
                  material === key
                    ? 'bg-blue-600 text-white shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </section>

        {/* Thickness Selection */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Ruler size={16} className="rotate-90" /> Espessura (micras)
          </h2>
          <div className="flex flex-wrap gap-2">
            {MATERIALS[material].microns.map((mic) => (
              <button
                key={mic}
                onClick={() => setThickness(mic)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  thickness === mic
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mic}
              </button>
            ))}
          </div>
        </section>

        {/* Inputs */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          
          {/* Width Input */}
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-1 block uppercase tracking-wider">
              Largura (mm)
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Ex: 1000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Ruler className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {/* Weight Input */}
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-1 block uppercase tracking-wider">
              Peso (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ex: 500"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Weight className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </section>

        {/* Result Card */}
        <section className={`rounded-2xl p-6 shadow-lg transition-all duration-300 transform ${result ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white scale-100 opacity-100' : 'bg-gray-200 text-gray-400 scale-95 opacity-50'}`}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-sm font-medium uppercase tracking-wider opacity-80">Resultado Estimado</h2>
            {result && <Info size={16} className="opacity-60" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tracking-tight">
              {result ? result.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) : '0'}
            </span>
            <span className="text-xl font-medium opacity-80">metros</span>
          </div>
          {result && (
            <div className="mt-4 pt-4 border-t border-white/20 text-sm opacity-80 grid grid-cols-2 gap-2">
              <div>
                <span className="block text-xs uppercase">Material</span>
                <span className="font-semibold">{material}</span>
              </div>
              <div>
                <span className="block text-xs uppercase">Densidade</span>
                <span className="font-semibold">{MATERIALS[material].density} g/cm³</span>
              </div>
            </div>
          )}

          {/* Slitter Button */}
          {result && (
            <button
              onClick={() => setShowSlitter(!showSlitter)}
              className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <Scissors size={16} />
              {showSlitter ? 'Ocultar Simulador de Corte' : 'Simular Corte (Slitter)'}
            </button>
          )}

          {/* Slitter Section */}
          {result && showSlitter && (
            <div className="mt-4 bg-white/10 rounded-xl p-4 animate-in slide-in-from-top duration-300">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scissors size={14} /> Simulador de Corte
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-medium opacity-80 mb-1 block">Bobina Mãe (mm)</label>
                  <input
                    type="number"
                    value={motherWidth}
                    onChange={(e) => setMotherWidth(e.target.value)}
                    placeholder={width || "Ex: 1400"}
                    className="w-full bg-white/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 font-bold"
                  />
                </div>
                <div>
                   <label className="text-xs font-medium opacity-80 mb-1 block">Peso Mãe (kg)</label>
                  <input
                    type="number"
                    value={motherWeight}
                    onChange={(e) => setMotherWeight(e.target.value)}
                    placeholder={weight || "Ex: 1000"}
                    className="w-full bg-white/20 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 font-bold"
                  />
                </div>
              </div>

              <div className="mb-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-2">
                   <label className="text-xs font-bold text-yellow-300 uppercase tracking-wider">Bobinas Filhas (Corte)</label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium opacity-80 mb-1 block">Largura (mm)</label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => setTargetWidth(e.target.value)}
                      placeholder="Ex: 700"
                      className="w-full bg-white text-blue-900 border border-white/10 rounded-lg py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium opacity-80 mb-1 block">Peso da Ordem (kg) <span className="text-[10px] font-normal opacity-70">(OP)</span></label>
                    <input
                      type="number"
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      placeholder="Ex: 150"
                      className="w-full bg-white text-blue-900 border border-white/10 rounded-lg py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 text-sm space-y-2">
                {motherWidth && motherWeight && targetWidth ? (
                  (() => {
                    const mw = parseFloat(motherWidth);
                    const mkg = parseFloat(motherWeight);
                    const tw = parseFloat(targetWidth);
                    const tkg = targetWeight ? parseFloat(targetWeight) : 0;
                    const thick = parseFloat(thickness);
                    const dens = MATERIALS[material].density;
                    
                    if (!mw || !mkg || !tw) return <span className="text-xs opacity-50">Preencha os dados da bobina mãe e largura de corte</span>;

                    const numCuts = Math.floor(mw / tw);
                    const waste = mw % tw;
                    const isExact = waste === 0;
                    
                    // Cálculo Industrial
                    // 1. Peso por metro da bobina filha (kg/m)
                    // Fórmula: (Largura * Espessura * Densidade) / 1.000.000
                    const weightPerMeterDaughter = (tw * thick * dens) / 1000000;

                    // 2. Metros necessários para atingir o peso TOTAL da OP
                    // Consideramos que todas as bobinas filhas (faixas) contribuem para o peso da OP
                    // Peso Total por Metro = Peso Filha * Numero de Faixas
                    
                    let metersNeeded = 0;
                    let motherConsumptionWeight = 0;
                    let remainingMotherWeight = 0;
                    let weightPerRoll = 0;
                    
                    if (tkg > 0 && numCuts > 0) {
                      const totalWeightPerMeter = weightPerMeterDaughter * numCuts;
                      metersNeeded = tkg / totalWeightPerMeter;
                      weightPerRoll = tkg / numCuts;
                      
                      // Consumo da Mãe: Metros Necessários * Largura Mãe * Espessura * Densidade / 1e6
                      motherConsumptionWeight = (metersNeeded * mw * thick * dens) / 1000000;
                      remainingMotherWeight = mkg - motherConsumptionWeight;
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <span className="opacity-70">Faixas (Bobinas):</span>
                          <span className="font-bold text-lg">{numCuts} bobinas</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="opacity-70">Sobra Lateral:</span>
                          <span className={`font-bold ${isExact ? 'text-green-400' : 'text-red-400'}`}>
                            {waste.toFixed(1)} mm {isExact ? '(Exato)' : ''}
                          </span>
                        </div>

                        {tkg > 0 && numCuts > 0 && (
                          <>
                            <div className="pt-2 border-t border-white/10 mt-2">
                              <h4 className="text-xs font-bold text-blue-300 uppercase mb-2">Produção (Pedido)</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="opacity-70">Metragem a Rodar:</span>
                                  <span className="font-bold text-white text-lg">{metersNeeded.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} m</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="opacity-70">Peso por Bobina:</span>
                                  <span className="font-bold text-white">{weightPerRoll.toFixed(1)} kg</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="opacity-70">Peso Total OP:</span>
                                  <span className="font-bold text-white">{tkg} kg</span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/10 mt-2">
                              <h4 className="text-xs font-bold text-orange-300 uppercase mb-2">Consumo Bobina Mãe</h4>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="opacity-70">Peso Consumido:</span>
                                  <span className="font-bold text-white">{motherConsumptionWeight.toFixed(1)} kg</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="opacity-70">Peso Restante:</span>
                                  <span className={`font-bold ${remainingMotherWeight < 0 ? 'text-red-500' : 'text-green-400'}`}>
                                    {remainingMotherWeight.toFixed(1)} kg
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <span className="text-xs opacity-50 text-center block py-2">
                    Preencha largura da bobina mãe e do corte para ver o resultado
                  </span>
                )}
              </div>


            </div>
          )}
        </section>

        {/* Action Buttons */}
        <button 
          onClick={handleReset}
          className="w-full py-4 rounded-xl bg-gray-200 text-gray-600 font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
        >
          <Trash2 size={20} />
          Limpar Tudo
        </button>

      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-auto">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="flex justify-center mb-2">
            <img src="/logo_calcpro.png" alt="CalcPro Logo" className="h-48 w-auto object-contain opacity-90" />
          </div>
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} CalcPro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
