import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Bike, User } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Reusing icon
const motoboyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const AdminView = () => {
  const { motoboys, deliveries } = useContext(AppContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2>Visão Geral da Equipe</h2>
      <p style={{ marginBottom: '16px' }}>Mapa em tempo real e status dos entregadores.</p>

      {/* Mapa */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', height: '300px', marginBottom: '20px', flexShrink: 0 }}>
        <MapContainer center={[-22.2139, -49.9458]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {motoboys.map(m => {
            if (m.lat && m.lng) {
              const currentDelivery = m.currentDeliveryId ? deliveries.find(d => d.id === m.currentDeliveryId) : null;
              return (
                <Marker key={m.id} position={[m.lat, m.lng]} icon={motoboyIcon}>
                  <Popup>
                    <strong>{m.name}</strong><br />
                    {currentDelivery ? `Entregando para: ${currentDelivery.client}` : 'Disponível'}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
      
      {/* Lista */}
      <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
        {motoboys.map(motoboy => {
          const currentDelivery = motoboy.currentDeliveryId 
            ? deliveries.find(d => d.id === motoboy.currentDeliveryId) 
            : null;

          return (
            <div key={motoboy.id} className="glass-panel" style={{ marginBottom: '16px' }}>
              <div className="delivery-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} color="var(--primary-color)" />
                  <h3 style={{ margin: 0 }}>{motoboy.name}</h3>
                </div>
                <span className={`status-badge ${motoboy.status === 'disponível' ? 'status-concluida' : 'status-em-rota'}`}>
                  {motoboy.status}
                </span>
              </div>
              
              {currentDelivery ? (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Bike size={16} color="var(--primary-color)" />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Em rota para:</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-main)' }}>{currentDelivery.client}</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>{currentDelivery.address}</p>
                </div>
              ) : (
                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Aguardando nova entrega.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminView;
