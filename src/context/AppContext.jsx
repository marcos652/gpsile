import { createContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [motoboys, setMotoboys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assuming logged in user is motoboy id 1
  const LOGGED_USER_ID = 1;

  useEffect(() => {
    // Listen to motoboys
    const unsubMotoboys = onSnapshot(collection(db, 'motoboys'), (snapshot) => {
      const mData = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      setMotoboys(mData);
    });

    // Listen to deliveries
    const unsubDeliveries = onSnapshot(collection(db, 'deliveries'), (snapshot) => {
      const dData = snapshot.docs.map(doc => ({ firebaseId: doc.id, ...doc.data() }));
      setDeliveries(dData);
      setLoading(false);
    });

    return () => {
      unsubMotoboys();
      unsubDeliveries();
    };
  }, []);

  const getDeliveryRef = (deliveryId) => {
    const d = deliveries.find(x => x.id === deliveryId);
    return d ? doc(db, 'deliveries', d.firebaseId) : null;
  };

  const getMotoboyRef = (motoboyId) => {
    const m = motoboys.find(x => x.id === motoboyId);
    return m ? doc(db, 'motoboys', m.firebaseId) : null;
  };

  const startDelivery = async (deliveryId) => {
    const dRef = getDeliveryRef(deliveryId);
    if (dRef) await updateDoc(dRef, { status: "em-rota" });

    const mRef = getMotoboyRef(LOGGED_USER_ID);
    if (mRef) await updateDoc(mRef, { currentDeliveryId: deliveryId, status: "em entrega" });
  };

  const completeDelivery = async (deliveryId) => {
    const dRef = getDeliveryRef(deliveryId);
    if (dRef) await updateDoc(dRef, { status: "concluida" });

    const mRef = getMotoboyRef(LOGGED_USER_ID);
    if (mRef) await updateDoc(mRef, { currentDeliveryId: null, status: "disponível" });
  };

  const assignMotoboy = async (deliveryId, motoboyId) => {
    const dRef = getDeliveryRef(deliveryId);
    if (dRef) await updateDoc(dRef, { motoboyId: parseInt(motoboyId) });
  };

  const addDelivery = async (newDelivery) => {
    const newId = deliveries.length > 0 ? Math.max(...deliveries.map(d => d.id)) + 1 : 1;
    await addDoc(collection(db, 'deliveries'), { ...newDelivery, id: newId, status: "pendente" });
  };

  const addMotoboy = async (name) => {
    const newId = motoboys.length > 0 ? Math.max(...motoboys.map(m => m.id)) + 1 : 1;
    await addDoc(collection(db, 'motoboys'), {
      id: newId,
      name,
      status: "disponível",
      currentDeliveryId: null,
      lat: -22.2139,
      lng: -49.9458
    });
  };

  const updateMotoboyLocation = async (motoboyId, lat, lng) => {
    const mRef = getMotoboyRef(motoboyId);
    if (mRef) await updateDoc(mRef, { lat, lng });
  };

  // Seed database utility se estiver vazio (na primeira vez)
  useEffect(() => {
    const seed = async () => {
      if (!loading && motoboys.length === 0) {
        const MOCK_MOTOBOYS = [
          { id: 1, name: "Você (Logado)", currentDeliveryId: null, status: "disponível", lat: -22.2139, lng: -49.9458 },
          { id: 2, name: "Marcos", currentDeliveryId: null, status: "disponível", lat: -22.2155, lng: -49.9472 },
          { id: 3, name: "Pedro", currentDeliveryId: null, status: "disponível", lat: -22.2289, lng: -49.9367 }
        ];
        MOCK_MOTOBOYS.forEach(async (m) => await addDoc(collection(db, 'motoboys'), m));
      }
      if (!loading && deliveries.length === 0) {
        const MOCK_DELIVERIES = [
          { id: 1, motoboyId: 1, client: "João Silva", address: "Av. Sampaio Vidal, 1000", status: "pendente", lat: -22.2139, lng: -49.9458, description: "Entregar pacote na portaria." },
          { id: 2, motoboyId: 2, client: "Maria Souza", address: "Rua São Luiz, 500", status: "pendente", lat: -22.2155, lng: -49.9472, description: "Ligar ao chegar." },
          { id: 3, motoboyId: 2, client: "Carlos Pedro", address: "Av. das Esmeraldas, 250", status: "pendente", lat: -22.2289, lng: -49.9367, description: "Cuidado, frágil." }
        ];
        MOCK_DELIVERIES.forEach(async (d) => await addDoc(collection(db, 'deliveries'), d));
      }
    };
    seed();
  }, [loading, motoboys.length, deliveries.length]);

  return (
    <AppContext.Provider value={{ deliveries, motoboys, startDelivery, completeDelivery, assignMotoboy, addDelivery, addMotoboy, updateMotoboyLocation, LOGGED_USER_ID }}>
      {children}
    </AppContext.Provider>
  );
};
