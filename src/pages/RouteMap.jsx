import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { ArrowLeft, CheckCircle, Navigation, XCircle } from 'lucide-react';
import L from 'leaflet';

// Fix leafet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for Motoboy
const motoboyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map and fit bounds
function MapUpdater({ bounds, isNavigating, myLocation }) {
  const map = useMap();
  useEffect(() => {
    if (isNavigating && myLocation) {
      map.setView(myLocation, 18);
    } else if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map, isNavigating, myLocation]);
  return null;
}

const RouteMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deliveries, startDelivery, completeDelivery, updateMotoboyLocation, LOGGED_USER_ID } = useContext(AppContext);
  const [delivery, setDelivery] = useState(null);
  
  const [myLocation, setMyLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const d = deliveries.find(d => d.id === parseInt(id));
    if (d) {
      setDelivery(d);
      if (d.status === 'pendente') {
        startDelivery(d.id);
      }
    }
  }, [id, deliveries, startDelivery]);

  // Pegar a localização do usuário em tempo real
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setMyLocation([position.coords.latitude, position.coords.longitude]);
          updateMotoboyLocation(LOGGED_USER_ID, position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setErrorMsg("Permissão de localização negada ou erro ao buscar. Mostrando apenas o destino.");
          console.error(error);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setErrorMsg("Geolocalização não suportada no seu navegador.");
    }
  }, []);

  // Calcular a rota no OSRM
  useEffect(() => {
    if (myLocation && delivery && routeCoordinates.length === 0) {
      const start = `${myLocation[1]},${myLocation[0]}`; // lng, lat
      const end = `${delivery.lng},${delivery.lat}`; // lng, lat
      
      fetch(`https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            // OSRM returns coordinates as [lng, lat], Leaflet needs [lat, lng]
            const coords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
            setRouteCoordinates(coords);
          }
        })
        .catch(err => {
          console.error("Erro ao buscar rota:", err);
          setErrorMsg("Falha ao traçar rota automática.");
        });
    }
  }, [myLocation, delivery, routeCoordinates.length]);

  if (!delivery) return <div style={{ padding: '20px' }}>Carregando...</div>;

  const destinationPosition = [delivery.lat, delivery.lng];
  
  // Calcular limites do mapa
  let bounds = [];
  if (routeCoordinates.length > 0) {
    bounds = routeCoordinates;
  } else if (myLocation) {
    bounds = [myLocation, destinationPosition];
  } else {
    bounds = [destinationPosition];
  }

  const handleComplete = () => {
    completeDelivery(delivery.id);
    navigate('/usuarios');
  };

  const toggleNavigation = () => {
    setIsNavigating(!isNavigating);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Rota de Entrega</h2>
      </div>

      <div className="glass-panel" style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{delivery.client}</h3>
        <p style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>{delivery.address}</p>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>Obs: {delivery.description}</p>
        {errorMsg && <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--danger-color)' }}>{errorMsg}</p>}
      </div>

      <div className="map-container" style={{ flex: 1, minHeight: '300px' }}>
        <MapContainer center={destinationPosition} zoom={15} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Destino */}
          <Marker position={destinationPosition}>
            <Popup>
              <strong>Destino:</strong><br />
              {delivery.client} <br /> {delivery.address}
            </Popup>
          </Marker>

          {/* Minha Localização */}
          {myLocation && (
             <Marker position={myLocation} icon={motoboyIcon}>
               <Popup>Sua localização atual</Popup>
             </Marker>
          )}

          {/* Linha da Rota */}
          {routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="#3b82f6" weight={6} opacity={0.8} />
          )}

          <MapUpdater bounds={bounds} isNavigating={isNavigating} myLocation={myLocation} />
        </MapContainer>
      </div>

      <div style={{ marginTop: '16px' }}>
        {!isNavigating ? (
          <button className="btn" onClick={toggleNavigation} style={{ width: '100%', padding: '16px 0', background: 'var(--primary-color)', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
            <Navigation size={20} /> Iniciar Navegação no App
          </button>
        ) : (
          <button className="btn" onClick={toggleNavigation} style={{ width: '100%', padding: '16px 0', background: 'var(--danger-color)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
            <XCircle size={20} /> Parar Navegação
          </button>
        )}
      </div>

      <button className="btn btn-success" onClick={handleComplete} style={{ marginTop: '16px', padding: '18px' }}>
        <CheckCircle size={20} /> Finalizar Entrega
      </button>
    </div>
  );
};

export default RouteMap;
