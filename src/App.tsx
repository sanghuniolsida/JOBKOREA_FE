import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchUI from './pages/searchUI';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchUI />} />
      </Routes>
    </BrowserRouter>
  );
}
