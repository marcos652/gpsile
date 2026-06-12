import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, MapPin, Save, User } from 'lucide-react';

const AddRoute = () => {
  const { motoboyId } = useParams();
  const navigate = useNavigate();
  const { motoboys, addDelivery } = useContext(AppContext);
  
  const motoboy = motoboys.find(m => m.id === parseInt(motoboyId));
  
  const [client, setClient] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client || !address) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      // Buscar coordenadas usando Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await res.json();

      let lat, lng;
      if (data && data.length > 0) {
        lat = parseFloat(data[0].lat);
        lng = parseFloat(data[0].lon);
      } else {
        // Se falhar, usa as coordenadas padrão para não quebrar o app
        lat = -22.2139;
        lng = -49.9458;
        alert("Não foi possível encontrar as coordenadas exatas deste endereço. Usando localização padrão.");
      }

      const newDelivery = {
        motoboyId: parseInt(motoboyId),
        client,
        address,
        description,
        lat,
        lng
      };

      addDelivery(newDelivery);
      navigate('/usuarios');
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocorreu um erro ao processar a rota.");
    } finally {
      setLoading(false);
    }
  };

  if (!motoboy) return <div style={{ padding: '20px' }}>Motoboy não encontrado.</div>;

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Adicionar Rota</h2>
      </div>

      <div className="glass-panel" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="var(--primary-color)" />
          <h3 style={{ margin: 0 }}>Entregador: {motoboy.name}</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel">
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
            Nome do Cliente
          </label>
          <input 
            type="text" 
            required
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Ex: João Silva"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
            <MapPin size={16} /> Endereço Completo
          </label>
          <input 
            type="text" 
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex: Av. Sampaio Vidal, 1000, Marília - SP"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', margin: 0 }}>
            Insira o endereço completo (Rua, Número, Cidade) para o GPS traçar a rota corretamente.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
            Observações (Opcional)
          </label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ligar quando chegar na portaria"
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-main)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {errorMsg && <p style={{ color: 'var(--danger-color)', marginBottom: '16px' }}>{errorMsg}</p>}

        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={loading}
          style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
        >
          <Save size={20} />
          {loading ? 'Buscando GPS e Salvando...' : 'Salvar Rota'}
        </button>
      </form>
    </div>
  );
};

export default AddRoute;
