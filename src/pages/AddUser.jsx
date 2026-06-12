import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

const AddUser = () => {
  const navigate = useNavigate();
  const { addMotoboy } = useContext(AppContext);
  
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);

    try {
      await addMotoboy(name);
      navigate('/usuarios');
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} type="button">
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0 }}>Adicionar Entregador</h2>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel">
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
            <UserPlus size={16} /> Nome do Entregador
          </label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Carlos Silva"
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

        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={loading}
          style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}
        >
          <Save size={20} />
          {loading ? 'Salvando...' : 'Salvar Entregador'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
