import SearchUI from './pages/searchUI'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[420px] bg-white shadow-2xl">
        <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <SearchUI />
        </div>
      </div>
    </div>
  )
}
