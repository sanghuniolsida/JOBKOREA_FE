// src/App.tsx
import SearchUI from './pages/searchUI'

export default function App() {
  return (
    // 바깥 배경 + 가로 가운데 정렬
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 폰 프레임 */}
      <div className="w-full max-w-[420px] bg-white shadow-2xl">
        {/* iOS 안전영역(선택) + 좌우 패딩 약간 */}
        <div className="pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <SearchUI />
        </div>
      </div>
    </div>
  )
}
