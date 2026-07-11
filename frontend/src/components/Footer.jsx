export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 mt-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} InterviewIQ AI. All rights reserved.
        </p>
        <div className="flex gap-6 text-text-secondary text-sm">
          <a href="#" className="hover:text-text-primary">Privacy</a>
          <a href="#" className="hover:text-text-primary">Terms</a>
          <a href="#" className="hover:text-text-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
}