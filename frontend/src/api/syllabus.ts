const API_URL = "http://127.0.0.1:8000";

export interface SyllabusExtractResponse {
    raw_text: string;
    file_name: string;
    file_size_kb: number;
    extraction_method: string;
}

export async function uploadSyllabus(file: File): Promise<SyllabusExtractResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/syllabus/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(errorData.detail || "Failed to upload syllabus");
    }

    return response.json();
}
