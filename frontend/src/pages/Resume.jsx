import { useState, useEffect } from "react";
import api from "../services/api";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get("/resume");
        setResume(res.data);
      } catch {
        // 404 ka matlab bas resume abhi tak nahi hai — koi masla nahi
      }
    };
    fetchResume();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(res.data.resume);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-text-primary text-2xl font-semibold mb-6">Resume</h1>

      <Card className="max-w-lg">
        {resume && (
          <div className="mb-4 pb-4 border-b border-border">
            <p className="text-text-secondary text-sm mb-1">Current resume</p>
            <a
              href={resume.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary text-sm"
            >
              {resume.fileName}
            </a>
          </div>
        )}

        <form onSubmit={handleUpload}>
          {error && <p className="text-danger text-sm mb-3">{error}</p>}

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 text-text-secondary text-sm"
          />

          <Button type="submit" disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload resume"}
          </Button>
        </form>
      </Card>
    </div>
  );
}