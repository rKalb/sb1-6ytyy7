import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminLayout } from './components/AdminLayout';
import { AdminCategories } from './pages/AdminCategories';
import { AdminMetadata } from './pages/AdminMetadata';
import { AdminDataManagement } from './pages/AdminDataManagement';
import { PartsListPage } from './pages/PartsListPage';
import { NewPartPage } from './pages/NewPartPage';
import { EditPartPage } from './pages/EditPartPage';
import { PartDetailsPage } from './pages/PartDetailsPage';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/parts" replace />} />
          <Route path="/parts" element={<PartsListPage />} />
          <Route path="/parts/new" element={<NewPartPage />} />
          <Route path="/parts/:partNumber" element={<PartDetailsPage />} />
          <Route path="/parts/:partNumber/edit" element={<EditPartPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="categories" replace />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="metadata" element={<AdminMetadata />} />
            <Route path="data" element={<AdminDataManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}