import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle, MapPin } from 'lucide-react';

const CompletedDeliveries = () => {
  const { deliveries } = useContext(AppContext);
  const completed = deliveries.filter(d => d.status === 'concluida');

  return (
    <div>
      <h2>Entregas Realizadas</h2>
      <p style={{ marginBottom: '20px' }}>Histórico de entregas já finalizadas.</p>
      
      {completed.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p>Nenhuma entrega realizada ainda.</p>
        </div>
      ) : (
        completed.map(delivery => (
          <div key={delivery.id} className="delivery-card glass-panel" style={{ opacity: 0.8 }}>
            <div className="delivery-header">
              <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>{delivery.client}</h3>
              <span className="status-badge status-concluida">Concluída</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              <MapPin size={16} />
              <span style={{ fontSize: '14px', textDecoration: 'line-through' }}>{delivery.address}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color)', marginTop: '8px' }}>
              <CheckCircle size={16} />
              <span style={{ fontSize: '14px' }}>Entregue com sucesso</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedDeliveries;
