"use client";

import { LucideIcon } from 'lucide-react'; // Or your specific icon library
import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, XCircle, ListVideo, BrainCircuit, RefreshCw, BarChart, Percent, LayoutList, ScanLine, FileJson } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
interface Metadata {
  filename: string;
  total_questions: number;
  score: number;
  percentage: number;
  answered: number;
  blank: number;
  multi_marked: number;
  correct: number;
  wrong: number;
}

interface QuestionResult {
  q: number;
  detected: string | null;
  correct: string | null;
  is_correct: boolean | null;
  status: string;
  confidence: number;
}

interface APIResponse {
  metadata: Metadata;
  questions: QuestionResult[];
  annotated_image: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const answerKeyInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    } else {
      setError("Please select a valid image file (JPG, PNG).");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);
    if (answerKeyFile) {
      formData.append("answer_key_file", answerKeyFile);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/grade";
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data: APIResponse = await res.json();
      setResult(data);
    } catch (err) {
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setAnswerKeyFile(null);
  };

  // --- Components ---

  const StatCard = ({
    icon: Icon,
    label,
    value,
    colorClass
  }: {
    icon: LucideIcon, // Change 'image' to 'LucideIcon' or 'React.ElementType'
    label: string,
    value: string | number,
    colorClass: string
  }) => (
    <div className="flex items-center p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
      <div className={`p-3 rounded-xl mr-4 ${colorClass} bg-opacity-20 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <div className="text-sm text-gray-400 font-medium">{label}</div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight">
            NeuralScore
          </h1>
        </div>
        {result && (
          <button
            onClick={resetState}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" /> Start New
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {!result ? (
          /* ================= UPLOAD ZONE ================= */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Automated OMR Grading
              </h2>
              <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
                Upload your scanned optical mark recognition sheets. Powered by YOLOv8 nano for real-time edge detection and evaluation.
              </p>
            </div>

            <div
              className={`w-full relative group transition-all duration-300 ease-out 
                ${isHovering ? 'scale-[1.02]' : 'scale-100'}`}
              onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsHovering(false); }}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              {/* Glowing animated border effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r transition-opacity duration-300 blur-xl
                ${isHovering ? 'from-indigo-500/40 to-purple-500/40 opacity-100' : 'from-indigo-500/10 to-purple-500/10 opacity-50'}
                ${file ? 'opacity-0' : ''}`}
              />

              <div className={`relative w-full overflow-hidden rounded-3xl bg-[#0F1117]/80 backdrop-blur-xl border-2 border-dashed flex flex-col items-center
                ${isHovering ? 'border-primary' : 'border-white/10'} 
                ${file ? 'border-solid border-white/10 p-4' : 'cursor-pointer p-16'}`}>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {!file ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                      <UploadCloud className={`w-10 h-10 ${isHovering ? 'text-primary' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Drag & drop image here</h3>
                    <p className="text-gray-400 text-sm mb-6">Supports JPG, PNG (Max 10MB)</p>
                    <button className="px-6 py-2.5 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all">
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    {previewUrl && (
                      <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black/50 mb-6 flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300 truncate max-w-[60%] pl-2">{file.name}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); resetState(); }}
                          className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                          disabled={isProcessing}
                        >
                          Remove
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> Scanning...
                            </>
                          ) : (
                            <>
                              <ScanLine className="w-4 h-4" /> Process Image
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Answer Key Upload */}
            <div className={`w-full max-w-sm mx-auto mt-6 transition-all duration-300 ${file && !isProcessing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <input
                type="file"
                accept="application/json"
                className="hidden"
                ref={answerKeyInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setAnswerKeyFile(e.target.files[0]);
                  }
                }}
              />
              <button
                onClick={() => answerKeyInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm text-gray-300"
              >
                <FileJson className="w-4 h-4 text-primary" />
                {answerKeyFile ? answerKeyFile.name : "Upload Custom Answer Key (.json) (Optional)"}
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm w-full text-center">
                {error}
              </motion.div>
            )}

          </motion.div>
        ) : (
          /* ================= RESULTS DASHBOARD ================= */
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Image Viewer */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm p-2 shadow-2xl relative group">
                  <div className="absolute top-4 left-4 z-10 p-2 px-3 bg-black/60 rounded-lg backdrop-blur-md border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                    <LayoutList className="w-3.5 h-3.5 text-primary" /> Visual Detection Space
                  </div>
                  <div className="relative rounded-2xl overflow-hidden bg-[#0A0C10] flex items-center justify-center min-h-[400px]">
                    <img
                      src={result.annotated_image}
                      alt="Parsed OMR Sheet"
                      className="w-full rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Statistics & Flow */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Top Level Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={BarChart} label="Total Score" value={`${result.metadata.score} / ${result.metadata.total_questions}`} colorClass="text-blue-400 bg-blue-500" />
                  <StatCard icon={Percent} label="Accuracy" value={`${result.metadata.percentage}%`} colorClass={result.metadata.percentage >= 50 ? 'text-green-400 bg-green-500' : 'text-orange-400 bg-orange-500'} />
                  <StatCard icon={CheckCircle2} label="Correct" value={result.metadata.correct} colorClass="text-emerald-400 bg-emerald-500" />
                  <StatCard icon={XCircle} label="Wrong" value={result.metadata.wrong} colorClass="text-rose-400 bg-rose-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-400 mb-1">Answers Parsed</div>
                      <div className="text-xl font-bold text-gray-200">{result.metadata.answered} of {result.metadata.total_questions}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-primary/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{Math.round((result.metadata.answered / result.metadata.total_questions) * 100)}%</span>
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500"></div> Blank Answers: {result.metadata.blank}</span>
                      <span className="text-sm font-medium text-gray-400 mt-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Multi-Marked: {result.metadata.multi_marked}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl flex-1 backdrop-blur-sm overflow-hidden flex flex-col max-h-[600px]">
                  <div className="p-5 border-b border-white/10 bg-white/[0.02]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <ListVideo className="w-5 h-5 text-gray-400" /> Detailed Breakdown
                    </h3>
                  </div>
                  <div className="overflow-auto p-0 flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-[#161A23] z-10 shadow-md">
                        <tr>
                          <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Q#</th>
                          <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Detected</th>
                          <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Expected</th>
                          <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Conf.</th>
                          <th className="p-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {result.questions.map((q) => (
                          <tr key={q.q} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-medium text-gray-300 w-16">Q{q.q}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${q.detected ? 'bg-white/10 text-white' : 'bg-transparent text-gray-500'}`}>
                                {q.detected || '-'}
                              </span>
                            </td>
                            <td className="p-4 text-gray-400 font-medium">
                              {q.correct || '-'}
                            </td>
                            <td className="p-4 text-gray-500 font-mono text-xs">
                              {(q.confidence * 100).toFixed(1)}%
                            </td>
                            <td className="p-4">
                              {q.status === 'blank' ? (
                                <span className="text-gray-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-gray-500" /> Blank</span>
                              ) : q.status === 'multi-marked' ? (
                                <span className="text-orange-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Multimark</span>
                              ) : q.is_correct ? (
                                <span className="text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Correct</span>
                              ) : (
                                <span className="text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4" /> Incorrect</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
