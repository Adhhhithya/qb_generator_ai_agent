import { useState } from "react";

interface CreatePaperPageProps {
  onPaperCreated: (paperId: number) => void;
}

const CreatePaperPage = ({ onPaperCreated }: CreatePaperPageProps) => {
  // Institution & Exam Details
  const [institutionName, setInstitutionName] = useState("");
  const [department, setDepartment] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [examDuration, setExamDuration] = useState("3 Hours");
  const [maxMarks, setMaxMarks] = useState(100);

  // Paper Details
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [syllabus, setSyllabus] = useState("");
  const [syllabusInputMethod, setSyllabusInputMethod] = useState<"upload" | "manual">("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ACCEPTED_FORMATS = [".pdf", ".doc", ".docx"];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
      return;
    }

    // Validate file format
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      setError(`Invalid file format. Accepted formats: ${ACCEPTED_FORMATS.join(", ")}`);
      return;
    }

    // For now, store the file info - in production, you'd parse the file
    setUploadedFileName(file.name);
    setError(null);
    
    // Here you could add logic to extract text from PDF/DOC
    // For now, we'll just store the file reference
    setSyllabus(`[File: ${file.name}]`);
  };

  const handleCreate = async () => {
    // Validate institution details
    if (!institutionName.trim()) {
      setError("Please enter institution name");
      return;
    }

    if (!department.trim()) {
      setError("Please enter department");
      return;
    }

    if (!courseTitle.trim()) {
      setError("Please enter course/subject name");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a paper title");
      return;
    }

    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/papers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            title,
            total_marks: totalMarks,
            syllabus,
            institution_name: institutionName,
            department,
            course_title: courseTitle,
            exam_duration: examDuration,
            max_marks: maxMarks
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create paper");
      }

      const data = await response.json();
      onPaperCreated(data.paper_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create paper");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
        Create Question Paper
      </h1>
      <p className="text-base text-[#6B7280] mb-8">
        Define institution details and paper configuration before adding sections.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-white border border-[#DC2626] rounded-lg">
          <p className="text-[#DC2626] text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-8 bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-sm">
        {/* Institution & Exam Details Section */}
        <div className="pb-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1E3A5F] mb-6">
            Institution and Exam Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                College / Institution Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g., MIT, Stanford University"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Department <span className="text-[#DC2626]">*</span>
              </label>
              <input
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science, Electrical Engineering"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Course / Subject Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g., Database Management Systems, Data Structures"
                disabled={loading}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Exam Duration
                </label>
                <input
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                  value={examDuration}
                  onChange={(e) => setExamDuration(e.target.value)}
                  placeholder="3 Hours"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  disabled={loading}
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Paper Details Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#1E3A5F] mb-6">
            Paper Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Paper Title
              </label>
              <input
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="DBMS Midterm - Normalization"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Total Marks
              </label>
              <input
                type="number"
                className="w-full border border-[#E5E7EB] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                disabled={loading}
                min="1"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Paper Title
          </label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="DBMS Midterm – Normalization"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Total Marks
          </label>
          <input
            type="number"
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            disabled={loading}
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A1A] mb-4">
            Syllabus Input Method
          </label>
          
          {/* Toggle Options */}
          <div className="flex gap-6 mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="syllabusMethod"
                value="upload"
                checked={syllabusInputMethod === "upload"}
                onChange={(e) => {
                  setSyllabusInputMethod("upload");
                  setError(null);
                }}
                disabled={loading}
                className="w-4 h-4 text-[#1E3A5F] cursor-pointer"
              />
              <span className="ml-2 text-sm text-[#1A1A1A]">
                Upload PDF / DOC <span className="text-[#DC2626] font-semibold">(default)</span>
              </span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="syllabusMethod"
                value="manual"
                checked={syllabusInputMethod === "manual"}
                onChange={(e) => {
                  setSyllabusInputMethod("manual");
                  setError(null);
                }}
                disabled={loading}
                className="w-4 h-4 text-[#1E3A5F] cursor-pointer"
              />
              <span className="ml-2 text-sm text-[#1A1A1A]">
                Paste / Type manually
              </span>
            </label>
          </div>

          {/* File Upload Area */}
          {syllabusInputMethod === "upload" && (
            <div className="mb-4">
              <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#1E3A5F] transition">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="hidden"
                  id="syllabus-upload"
                />
                <label htmlFor="syllabus-upload" className="cursor-pointer block">
                  <div className="text-sm font-medium text-[#6B7280] mb-2">PDF or DOCX</div>
                  <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    PDF, DOC, DOCX (Max 10MB)
                  </p>
                </label>
              </div>
              
              {uploadedFileName && (
                <div className="mt-3 p-3 bg-[#F0FDF4] border border-[#059669] rounded-md flex items-center justify-between">
                  <span className="text-sm text-[#059669]">
                    Uploaded: {uploadedFileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName(null);
                      setSyllabus("");
                      const input = document.getElementById("syllabus-upload") as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="text-sm text-[#059669] hover:text-[#047857] font-medium"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Manual Input Area */}
          {syllabusInputMethod === "manual" && (
            <div className="mb-4">
              <textarea
                className="mt-1 w-full border border-[#E5E7EB] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                rows={4}
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Normalization, Functional Dependencies, 1NF, 2NF, 3NF"
                disabled={loading}
              />
              <p className="text-xs text-[#6B7280] mt-1">
                Used to ensure syllabus-aligned question generation.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreate}
            disabled={loading}
            className={`px-8 py-3 rounded-md font-medium transition ${
              loading
                ? "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                : "bg-[#1E3A5F] text-white hover:bg-[#162C46]"
            }`}
          >
            {loading ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePaperPage;
