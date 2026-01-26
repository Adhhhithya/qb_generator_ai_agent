import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Clock, ListChecks, CheckCircle2, ArrowRight, AlertCircle, UploadCloud, Loader } from 'lucide-react';
import { createPaper, addSection, generatePaper } from '../../api/papers';
import { uploadSyllabus } from '../../api/syllabus';

type WizardStep = 1 | 2 | 3;

interface SectionConfig {
    name: string; // Part A/B/C
    marks_per_question: number;
    number_of_questions: number;
    bloom_level: string;
}

const examDurations = ['1 hour', '1.5 hours', '2 hours', '3 hours'];
const bloomLevels = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const GenerateWizard = () => {
    const [step, setStep] = useState<WizardStep>(1);

    // Step 1 - Input
    const [institutionName, setInstitutionName] = useState('');
    const [examDuration, setExamDuration] = useState(examDurations[2]);
    const [syllabusText, setSyllabusText] = useState('');
    const [totalMarksInput, setTotalMarksInput] = useState<number>(100);
    const [uploading, setUploading] = useState(false);

    // Step 2 - Configure Sections
    const [sections, setSections] = useState<SectionConfig[]>([
        { name: 'Part A', marks_per_question: 2, number_of_questions: 5, bloom_level: 'Understand' },
        { name: 'Part B', marks_per_question: 5, number_of_questions: 5, bloom_level: 'Apply' },
    ]);

    // Step 3 - Confirmation / Generation
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [generationResult, setGenerationResult] = useState<any>(null);
    const [generatedPaperId, setGeneratedPaperId] = useState<number | null>(null);

    const sectionMarks = sections.reduce((sum, s) => sum + s.marks_per_question * s.number_of_questions, 0);
    const totalMarks = totalMarksInput || sectionMarks;

    const canProceedStep1 = institutionName.trim().length > 0 && examDuration && syllabusText.trim().length > 0;
    const canProceedStep2 = sections.length > 0 &&
        sections.every(s => s.name && s.marks_per_question > 0 && s.number_of_questions > 0 && s.bloom_level) &&
        sectionMarks === totalMarksInput;

    const addNewSection = () => {
        setSections(prev => [...prev, { name: `Part ${String.fromCharCode(65 + prev.length)}`, marks_per_question: 1, number_of_questions: 1, bloom_level: 'Remember' }]);
    };

    const updateSection = (index: number, field: keyof SectionConfig, value: any) => {
        setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    };

    const removeSection = (index: number) => {
        setSections(prev => prev.filter((_, i) => i !== index));
    };

    const handleConfirmAndGenerate = async () => {
        setError('');
        if (!canProceedStep1 || !canProceedStep2) {
            setError('Please complete all required fields and ensure section marks equal total marks before generating.');
            return;
        }

        setCreating(true);
        try {
            // Prepare create data
            const createData = {
                title: `${institutionName} Exam Paper`,
                total_marks: totalMarksInput,
                syllabus: syllabusText,
                institution_name: institutionName,
                exam_duration: examDuration,
                max_marks: totalMarksInput,
            };

            const created = await createPaper(createData);
            const paperId = created.paper_id;
            setGeneratedPaperId(paperId);

            // Add sections
            for (const s of sections) {
                await addSection(paperId, {
                    name: s.name,
                    marks_per_question: s.marks_per_question,
                    number_of_questions: s.number_of_questions,
                });
            }

            // Trigger generation
            const gen = await generatePaper(paperId);
            setGenerationResult(gen);
            // Redirect to preview page once generated
            window.location.href = `/papers/${paperId}`;
            setStep(3);
        } catch (e: any) {
            setError(e?.message || 'Failed to generate paper');
        } finally {
            setCreating(false);
        }
    };

    const Stepper = () => {
        const steps = [
            { id: 1, label: 'Input', icon: Building },
            { id: 2, label: 'Configure', icon: ListChecks },
            { id: 3, label: 'Review', icon: CheckCircle2 },
        ];
        return (
            <div className="flex items-center justify-center gap-6 mb-8">
                {steps.map((s, idx) => {
                    const Icon = s.icon as any;
                    const status = step > s.id ? 'complete' : step === s.id ? 'current' : 'upcoming';
                    return (
                        <div key={s.id} className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all
                                ${status === 'complete' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                    status === 'current' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                        'bg-slate-50 border-slate-200 text-slate-500'}
                            `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className={`text-sm font-semibold ${status === 'complete' ? 'text-emerald-700' : status === 'current' ? 'text-blue-700' : 'text-slate-500'}`}>{s.label}</div>
                            {idx < steps.length - 1 && (
                                <div className="w-12 h-px bg-slate-200 mx-2" />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Stepper />

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">College / Institution Name *</label>
                                <input
                                    value={institutionName}
                                    onChange={(e) => setInstitutionName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="e.g., XYZ University"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Exam Duration *</label>
                                <select
                                    value={examDuration}
                                    onChange={(e) => setExamDuration(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    {examDurations.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Total Marks *</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={totalMarksInput}
                                    onChange={(e) => setTotalMarksInput(Number(e.target.value))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="e.g., 100"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Upload New Source (PDF/DOCX)</label>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 px-4 py-3 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:border-blue-300">
                                        <UploadCloud className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-semibold text-slate-700">Upload file</span>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploading(true);
                                                setError('');
                                                try {
                                                    const res = await uploadSyllabus(file);
                                                    setSyllabusText(res.raw_text || '');
                                                } catch (err: any) {
                                                    setError(err?.message || 'Upload failed');
                                                } finally {
                                                    setUploading(false);
                                                }
                                            }}
                                        />
                                    </label>
                                    {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
                                </div>
                                <p className="text-xs text-slate-500">Uploads populate the syllabus text automatically.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Syllabus / Grounding Text *</label>
                                <textarea
                                    value={syllabusText}
                                    onChange={(e) => setSyllabusText(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Paste syllabus content here"
                                />
                                <p className="text-xs text-slate-500 mt-1">Required. Uploading a file auto-fills this field.</p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => canProceedStep1 && setStep(2)}
                                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${canProceedStep1 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Configure Sections</h3>
                            <button onClick={addNewSection} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold">Add Section</button>
                        </div>

                        <div className="space-y-4">
                            {sections.map((s, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Section Name</label>
                                            <input
                                                value={s.name}
                                                onChange={(e) => updateSection(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Marks / Question</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={s.marks_per_question}
                                                onChange={(e) => updateSection(index, 'marks_per_question', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1"># Questions</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={s.number_of_questions}
                                                onChange={(e) => updateSection(index, 'number_of_questions', Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">Bloom Level</label>
                                            <select
                                                value={s.bloom_level}
                                                onChange={(e) => updateSection(index, 'bloom_level', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                                            >
                                                {bloomLevels.map(bl => <option key={bl} value={bl}>{bl}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => removeSection(index)} className="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-slate-600">Sections Total: <span className="font-semibold text-slate-900">{sectionMarks}</span> / Target: <span className="font-semibold text-slate-900">{totalMarksInput}</span></div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50">Back</button>
                                <button
                                    onClick={() => canProceedStep2 && setStep(3)}
                                    className={`px-6 py-3 rounded-lg font-semibold ${canProceedStep2 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                >
                                    Review <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Review & Confirm</h3>
                                <p className="text-sm text-slate-500">Double-check details before generating your paper.</p>
                            </div>
                            {creating && (
                                <div className="flex items-center gap-2 text-blue-600 text-sm">
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Generating…
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs text-slate-500">Institution</p>
                                <p className="text-lg font-semibold text-slate-900">{institutionName}</p>
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs text-slate-500">Exam Duration</p>
                                <p className="text-lg font-semibold text-slate-900">{examDuration}</p>
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                                <p className="text-xs text-slate-500">Total Marks</p>
                                <p className="text-lg font-semibold text-slate-900">{totalMarksInput}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-slate-700">Sections</h4>
                                <span className="text-xs text-slate-500">Marks sum must equal total</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {sections.map((s, i) => (
                                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                        <div className="flex flex-wrap gap-3 items-center">
                                            <span className="font-semibold text-slate-900">{s.name}</span>
                                            <span className="text-slate-600">Marks/Q: {s.marks_per_question}</span>
                                            <span className="text-slate-600">Questions: {s.number_of_questions}</span>
                                            <span className="text-purple-700 bg-purple-50 px-2 py-1 rounded text-xs font-semibold">Bloom: {s.bloom_level}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-slate-600">Total Marks: <span className="font-semibold text-slate-900">{totalMarks}</span></div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 mb-4">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50">Back</button>
                            <button
                                onClick={handleConfirmAndGenerate}
                                disabled={creating}
                                className={`px-6 py-3 rounded-lg font-semibold ${creating ? 'bg-blue-300 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                {creating ? 'Generating…' : 'Confirm & Generate'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GenerateWizard;
