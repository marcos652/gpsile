import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, CheckCircle } from 'lucide-react';

const AssignRoutes = () => {
  const { deliveries, motoboys, assignMotoboy } = useContext(AppContext);
  const pendingDeliveries = deliveries.filter(d => d.status === 'pendente');

  const handleAssign = (deliveryId, motoboyId) => {
    assignMotoboy(deliveryId, motoboyId);
  };

  return (
    <div>
      <h2>Atribuir Rotas</h2>
      <p style={{ marginBottom: '20px' }}>Defina qual entregador será responsável por cada rota pendente.</p>
      
      {pendingDeliveries.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <CheckCircle size={48} color="var(--success-color)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3>Tudo atribuído!</h3>
          <p>Não há entregas pendentes para atribuir no momento.</p>
        </div>
      ) : (
        pendingDeliveries.map(delivery => {
          return (
            <div key={delivery.id} className="delivery-card glass-panel" style={{ marginBottom: '16px' }}>
              <div className="delivery-header">
                <h3 style={{ margin: 0 }}>{delivery.client}</h3>
                <span className="status-badge status-pendente">
                  Pendente
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <MapPin size={16} />
                <span style={{ fontSize: '14px' }}>{delivery.address}</span>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>
                  Entregador Responsável:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    value={delivery.motoboyId || ""} 
                    onChange={(e) => handleAssign(delivery.id, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'var(--text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="" disabled style={{ color: '#000' }}>Selecione um motoboy</option>
                    {motoboys.map(m => (
                      <option key={m.id} value={m.id} style={{ color: '#000' }}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AssignRoutes;
