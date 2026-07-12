import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // File ko base64 string mein badalte hain, taake Cloudinary ko bheja ja sake
    const base64File = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "interviewiq/resumes",
      resource_type: "raw", // PDF jaisi non-image files ke liye zaroori
    });

    // Agar user ka pehle se resume tha, purana delete kar dete hain (sirf ek resume rakhte hain)
    const existing = await Resume.findOne({ user: req.user._id });
    if (existing) {
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: "raw" });
      await existing.deleteOne();
    }

    const resume = await Resume.create({
      user: req.user._id,
      resumeUrl: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
    });

    res.status(201).json({ message: "Resume uploaded successfully", resume });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

export const getMyResume = async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: "No resume found" });
  }
  res.json(resume);
};