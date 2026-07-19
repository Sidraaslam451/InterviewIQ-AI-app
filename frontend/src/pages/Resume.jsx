import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck, ExternalLink } from "lucide-react";
import api from "../services/api";
import Card from "../components/Card";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get("/resume");
        setResume(res.data);
      } catch {
        // No resume yet — fine
      }
    };
    fetchResume();
  }, []);

  const handleUpload = async (selectedFile) => {
    if (!selectedFile) return;
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(res.data.resume);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      handleUpload(dropped);
    }
  };

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-2xl font-semibold text-text-primary mb-1"
      >
        Resume
      </motion.h1>
      <p className="text-text-secondary mb-8">Keep your resume up to date for tailored questions</p>

      <Card className="max-w-lg">
        <AnimatePresence mode="wait">
          {resume && (
            <motion.div
              key="current"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5 pb-5 border-b border-border"
            >
              <p className="text-text-secondary text-xs mb-2">Current resume</p>
              <div className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-lg px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <FileCheck size={18} className="text-success" />
                </div>
                
                  href={resume.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary text-sm font-medium truncate flex-1 hover:text-primary transition-colors"
                
                  {resume.fileName}
                
                <ExternalLink size={14} className="text-text-secondary shrink-0" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-danger text-sm mb-4 bg-danger/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <motion.label
          htmlFor="resume-upload"
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          animate={{
            borderColor: dragActive ? "#6366F1" : "#E5E7EB",
            backgroundColor: dragActive ? "rgba(99,102,241,0.05)" : "transparent",
          }}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 px-6 cursor-pointer transition-colors"
        >
          <motion.div
            animate={{ y: dragActive ? -4 : 0, scale: uploading ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: uploading ? Infinity : 0, duration: 1 }}
            className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Upload size={20} className="text-primary" />
          </motion.div>
          <div className="text-center">
            <p className="text-text-primary text-sm font-medium">
              {uploading ? "Uploading..." : "Drop your resume here, or click to browse"}
            </p>
            <p className="text-text-secondary text-xs mt-1">PDF only, up to 5MB</p>
          </div>
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={(e) => handleUpload(e.target.files[0])}
            disabled={uploading}
            className="hidden"
          />
        </motion.label>
      </Card>
    </div>
  );
}