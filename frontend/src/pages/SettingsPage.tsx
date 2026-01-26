import { useState, useEffect } from 'react';
import { Save, Sliders, Shield } from 'lucide-react';

const SettingsPage = () => {
    const [strictness, setStrictness] = useState(70);
    const [bloomWeight, setBloomWeight] = useState(50);
    const [provider, setProvider] = useState('OpenAI GPT-4o');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedStrictness = localStorage.getItem('qb_settings_strictness');
        const storedBloom = localStorage.getItem('qb_settings_bloom');
        const storedProvider = localStorage.getItem('qb_settings_provider');

        if (storedStrictness) setStrictness(Number(storedStrictness));
        if (storedBloom) setBloomWeight(Number(storedBloom));
        if (storedProvider) setProvider(storedProvider);
    }, []);

    const handleSave = () => {
        localStorage.setItem('qb_settings_strictness', String(strictness));
        localStorage.setItem('qb_settings_bloom', String(bloomWeight));
        localStorage.setItem('qb_settings_provider', provider);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
                    <p className="text-slate-500">Configure AI generation and audit behavior.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm
                        ${saved
                            ? 'bg-green-600 text-white'
                            : 'bg-brand-primary-600 text-white hover:bg-brand-primary-700'}
                    `}
                >
                    <Save size={18} /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Audit Configuration */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-brand-secondary-600" /> Audit Strictness
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Adjust how strictly the AI validates questions against the syllabus. Higher strictness may reduce generation variety but ensures stricter compliance.
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-600">Strictness Level</span>
                            <span className="text-brand-secondary-600">{strictness}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            value={strictness}
                            onChange={(e) => setStrictness(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-secondary-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Flexible</span>
                            <span>Balanced</span>
                            <span>Rigid</span>
                        </div>
                    </div>
                </div>

                {/* Generation Preferences */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Sliders size={20} className="text-brand-accent-600" /> Generation Bias
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Influence how the AI prioritizes Bloom's Taxonomy adherence versus creative scenario generation.
                    </p>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-600">Bloom's Focus</span>
                            <span className="text-brand-accent-600">{bloomWeight}%</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            value={bloomWeight}
                            onChange={(e) => setBloomWeight(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-accent-600"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Creative</span>
                            <span>Balanced</span>
                            <span>Clinical</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-2">Model Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">LLM Provider</label>
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500"
                        >
                            <option>OpenAI GPT-4o</option>
                            <option>Anthropic Claude 3.5 Sonnet</option>
                            <option>Local (Llama 3)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Tokens</label>
                        <input type="number" defaultValue={2000} className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-brand-primary-500/20 focus:border-brand-primary-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
