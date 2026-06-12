import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { User, MapPin, Navigation, Plus, UserPlus } from 'lucide-react';

const UsersRoutes = () => {
  const { motoboys, deliveries } = useContext(AppContext);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Rotas por Entregador</h2>
        <Link to="/adicionar-usuario">
          <button className="btn btn-success" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
            <UserPlus size={16} /> Novo Entregador
          </button>
        </Link>
      </div>
      
      {motoboys.map(motoboy => {
        const userDeliveries = deliveries.filter(d => d.motoboyId === motoboy.id && d.status !== 'concluida');

        return (
          <div key={motoboy.id} className="glass-panel" style={{ marginBottom: '20px' }}>
            <div className="delivery-header" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={24} color="var(--primary-color)" />
                <h3 style={{ margin: 0, fontSize: '18px' }}>{motoboy.name}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`status-badge ${motoboy.status === 'disponível' ? 'status-concluida' : 'status-em-rota'}`}>
                  {motoboy.status}
                </span>
                <Link to={`/adicionar-rota/${motoboy.id}`}>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Nova Rota
                  </button>
                </Link>
              </div>
            </div>

            {userDeliveries.length === 0 ? (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Nenhuma rota pendente para este usuário.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {userDeliveries.map(delivery => (
                  <div key={delivery.id} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600' }}>{delivery.client}</span>
                      <span className={`status-badge status-${delivery.status}`} style={{ fontSize: '12px', padding: '2px 8px' }}>
                        {delivery.status === 'pendente' ? 'Pendente' : 'Em Rota'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      <MapPin size={14} />
                      <span style={{ fontSize: '13px' }}>{delivery.address}</span>
                    </div>
                    <Link to={`/rota/${delivery.id}`}>
                      <button className="btn" style={{ width: '100%', padding: '10px 0', fontSize: '14px', background: 'var(--primary-color)' }}>
                        <Navigation size={16} /> Iniciar Rota do Usuário
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UsersRoutes;
