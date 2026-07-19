import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6 mt-16 bg-surface/50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-linear-to-br from-primary to-primary-dark flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} InterviewIQ AI. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-text-secondary text-sm">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}