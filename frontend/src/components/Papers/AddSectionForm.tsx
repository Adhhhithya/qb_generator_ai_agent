import { useState } from "react";

interface AddSectionFormProps {
  onAdd: (section: { name: string; marks: number; count: number }) => void;
}

const AddSectionForm = ({ onAdd }: AddSectionFormProps) => {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [count, setCount] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !marks || !count) {
      return;
    }

    onAdd({
      name: name.trim(),
      marks: Number(marks),
      count: Number(count),
    });

    // Reset form
    setName("");
    setMarks("");
    setCount("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-4 items-end">
      <div className="w-1/3">
        <label className="block text-xs text-slate-600 mb-1">Section Name</label>
        <input
          placeholder="Part A"
          className="border border-slate-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="w-1/4">
        <label className="block text-xs text-slate-600 mb-1">Marks / Q</label>
        <input
          type="number"
          placeholder="2"
          className="border border-slate-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          onKeyPress={handleKeyPress}
          min="1"
        />
      </div>

      <div className="w-1/4">
        <label className="block text-xs text-slate-600 mb-1"># Questions</label>
        <input
          type="number"
          placeholder="10"
          className="border border-slate-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          onKeyPress={handleKeyPress}
          min="1"
        />
      </div>

      <button
        onClick={handleAdd}
        disabled={!name.trim() || !marks || !count}
        className="bg-slate-900 text-white px-5 py-2 rounded-md hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </div>
  );
};

export default AddSectionForm;
