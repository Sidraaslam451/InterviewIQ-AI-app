function App() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="bg-surface border border-border rounded p-8 max-w-sm">
        <h1 className="text-text-primary text-2xl font-semibold mb-2">
          Design system test
        </h1>
        <p className="text-text-secondary text-sm mb-4">
          Agar yeh card sahi dikh raha hai, tokens kaam kar rahe hain.
        </p>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm">
          Test button
        </button>
      </div>
    </div>
  )
}

export default App