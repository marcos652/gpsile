import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PendingDeliveries from './pages/PendingDeliveries';
import CompletedDeliveries from './pages/CompletedDeliveries';
import AdminView from './pages/AdminView';
import UsersRoutes from './pages/UsersRoutes';
import AssignRoutes from './pages/AssignRoutes';
import AddRoute from './pages/AddRoute';
import AddUser from './pages/AddUser';
import RouteMap from './pages/RouteMap';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PendingDeliveries />} />
            <Route path="/realizadas" element={<CompletedDeliveries />} />
            <Route path="/admin" element={<AdminView />} />
            <Route path="/usuarios" element={<UsersRoutes />} />
            <Route path="/atribuir" element={<AssignRoutes />} />
            <Route path="/adicionar-rota/:motoboyId" element={<AddRoute />} />
            <Route path="/adicionar-usuario" element={<AddUser />} />
            <Route path="/rota/:id" element={<RouteMap />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
