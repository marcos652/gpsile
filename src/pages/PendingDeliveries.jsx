import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

const PendingDeliveries = () => {
  const { deliveries } = useContext(AppContext);
  const pending = deliveries.filter(d => d.status === 'pendente' || d.status === 'em-rota');

  return (
    <div>
      <h2>Entregas Pendentes</h2>
      <p style={{ marginBottom: '20px' }}>Toque em uma entrega para ver a rota.</p>
      
      {pending.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle size={48} color="var(--success-color)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3>Tudo limpo!</h3>
          <p>Não há entregas pendentes no momento.</p>
        </div>
      ) : (
        pending.map(delivery => (
          <Link to={`/rota/${delivery.id}`} key={delivery.id} className="delivery-card glass-panel">
            <div className="delivery-header">
              <h3 style={{ margin: 0 }}>{delivery.client}</h3>
              <span className={`status-badge status-${delivery.status}`}>
                {delivery.status === 'pendente' ? 'Pendente' : 'Em Rota'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <MapPin size={16} />
              <span style={{ fontSize: '14px' }}>{delivery.address}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="btn" style={{ padding: '8px 16px', fontSize: '14px', width: 'auto', pointerEvents: 'none', background: 'var(--primary-color)' }}>
                <Navigation size={16} /> Iniciar Rota
              </button>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default PendingDeliveries;
