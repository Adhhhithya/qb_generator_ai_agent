import { useState } from 'react';
import { uploadSyllabus } from '../api/syllabus';
import { createPaper, addSection, generatePaper, fetchPaper } from '../api/papers';
import type { Paper, PaperSection, GenerationProgressItem } from '../api/papers';

export type GeneratorStep = 1 | 2 | 3 | 4;

export interface GeneratorState {
    step: GeneratorStep;

    // Step 1: Syllabus
    syllabusFile: File | null;
    syllabusText: string;
    isUploading: boolean;

    // Step 2: Config
    paperTitle: string;
    totalMarks: number;
    sections: { name: string; marks: number; count: number }[];
    metadata: {
        institution: string;
        course: string;
        duration: string;
    };
    isCreating: boolean;
    paperId: number | null;

    // Step 3: Generation
    isGenerating: boolean;
    progressLogs: GenerationProgressItem[];

    // Step 4: Result
    finalPaper: Paper | null;
    error: string | null;
}

const DEFAULT_SECTIONS = [
    { name: 'Part A', marks: 2, count: 10 },  // 20 marks
    { name: 'Part B', marks: 13, count: 5 },  // 65 marks
];

export const usePaperGenerator = () => {
    const [state, setState] = useState<GeneratorState>({
        step: 1,
        syllabusFile: null,
        syllabusText: '',
        isUploading: false,

        paperTitle: 'Internal Assessment 1',
        totalMarks: 50,
        sections: [], // Will init when moving to step 2 or on demand
        metadata: {
            institution: '',
            course: '',
            duration: '90 Minutes'
        },
        isCreating: false,
        paperId: null,

        isGenerating: false,
        progressLogs: [],

        finalPaper: null,
        error: null
    });

    // --- Actions ---

    const handleFileUpload = async (file: File) => {
        setState(s => ({ ...s, isUploading: true, error: null }));
        try {
            const res = await uploadSyllabus(file);
            setState(s => ({
                ...s,
                syllabusFile: file,
                syllabusText: res.raw_text,
                isUploading: false
            }));
        } catch (err: any) {
            setState(s => ({ ...s, isUploading: false, error: err.message }));
        }
    };

    const updateSyllabusText = (text: string) => {
        setState(s => ({ ...s, syllabusText: text }));
    };

    const nextStep = () => {
        if (state.step === 1 && state.sections.length === 0) {
            // Initialize defaults on first entry to config
            setState(s => ({ ...s, step: 2, sections: DEFAULT_SECTIONS }));
        } else {
            setState(s => ({ ...s, step: (s.step + 1) as GeneratorStep }));
        }
    };

    const prevStep = () => {
        setState(s => ({ ...s, step: (s.step - 1) as GeneratorStep }));
    };

    const addSectionConfig = () => {
        setState(s => ({
            ...s,
            sections: [...s.sections, { name: `Part ${String.fromCharCode(65 + s.sections.length)}`, marks: 5, count: 2 }]
        }));
    };

    const removeSectionConfig = (index: number) => {
        setState(s => ({
            ...s,
            sections: s.sections.filter((_, i) => i !== index)
        }));
    };

    const updateSectionConfig = (index: number, field: keyof typeof state.sections[0], value: any) => {
        const newSections = [...state.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setState(s => ({ ...s, sections: newSections }));
    };

    // --- Core Logic: Create & Configure Paper ---
    const submitConfiguration = async () => {
        if (!state.syllabusText) return;

        setState(s => ({ ...s, isCreating: true, error: null }));

        try {
            // 1. Create Paper Blueprint
            const paperRes = await createPaper({
                title: state.paperTitle,
                total_marks: state.totalMarks,
                syllabus: state.syllabusText,
                institution_name: state.metadata.institution,
                course_title: state.metadata.course,
                exam_duration: state.metadata.duration,
                max_marks: state.totalMarks
            });

            const paperId = paperRes.paper_id;

            // 2. Add Sections Sequentially
            for (const sec of state.sections) {
                await addSection(paperId, {
                    name: sec.name,
                    marks_per_question: sec.marks,
                    number_of_questions: sec.count
                });
            }

            // Success -> Move to Generation
            setState(s => ({ ...s, isCreating: false, paperId, step: 3 }));

            // Auto-trigger generation? Let's make it explicit in UI, but for now we can call it.
            startGeneration(paperId);

        } catch (err: any) {
            setState(s => ({ ...s, isCreating: false, error: err.message }));
        }
    };

    // --- Core Logic: Generate ---
    const startGeneration = async (id: number) => {
        setState(s => ({ ...s, isGenerating: true, progressLogs: [], error: null }));

        try {
            const genRes = await generatePaper(id);

            if (genRes.status === 'SUCCESS' || genRes.status === 'DRAFT') {
                setState(s => ({ ...s, progressLogs: genRes.progress }));

                // Fetch full paper to show result
                const fullPaper = await fetchPaper(id);
                setState(s => ({
                    ...s,
                    isGenerating: false,
                    finalPaper: fullPaper,
                    step: 4
                }));
            } else {
                throw new Error("Generation returned unknown status");
            }

        } catch (err: any) {
            setState(s => ({
                ...s,
                isGenerating: false,
                error: err.message || "Generation failed. Please try again."
            }));
        }
    };

    return {
        state,
        setState,
        actions: {
            handleFileUpload,
            updateSyllabusText,
            nextStep,
            prevStep,
            addSectionConfig,
            removeSectionConfig,
            updateSectionConfig,
            submitConfiguration,
            startGeneration,
            clearState
        }
    };
};
