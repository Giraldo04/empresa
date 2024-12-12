import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import { add, checkmark, trash, logOut } from 'ionicons/icons';
import './Trabajadores.css';
import api from '../components/db/apis';

interface Posicion {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number; // Para ingresar la cantidad realizada
}

interface Corte {
    id: number;
    numeroCorte: string;
    modelo: string;
    posiciones: Posicion[];
}



const Trabajadores: React.FC = () => {
    const [cortes, setCortes] = useState<Corte[]>([]);
    const [corteSeleccionado, setCorteSeleccionado] = useState<string | undefined>(undefined);
    const [posiciones, setPosiciones] = useState<Posicion[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [diasFeriados, setDiasFeriados] = useState<boolean>(false);

    // Obtener cortes desde el backend
    useEffect(() => {
        const obtenerCortes = async () => {
            try {
                const response = await api.get<Corte[]>('/obtener-cortes');
                setCortes(response.data);
            } catch (error) {
                console.error('Error al obtener los cortes:', error);
                alert('Error al cargar los cortes, intente nuevamente.');
            }
        };
        obtenerCortes();
    }, []);

    // Manejar cambio de selección de corte
    const manejarCambioCorte = (corteId: string) => {
        const corte = cortes.find((c) => c.id.toString() === corteId);
        if (corte) {
            setCorteSeleccionado(corteId);
            setPosiciones(
                corte.posiciones.map((pos) => ({
                    ...pos,
                    cantidad: 0, // Inicializar cantidad en 0
                }))
            );
        }
    };

    // Manejar cambio de cantidad en posiciones
    const manejarCambioCantidad = (posicionId: number, cantidad: number) => {
        const nuevasPosiciones = posiciones.map((pos) =>
            pos.id === posicionId ? { ...pos, cantidad: cantidad || 0 } : pos
        );
        setPosiciones(nuevasPosiciones);

        // Recalcular total
        const nuevoTotal = nuevasPosiciones.reduce((acc, pos) => acc + pos.cantidad * pos.precio, 0);
        const incremento = diasFeriados ? 1.4 : 1.2; // Incremento del 40% o 20%
        setTotal(nuevoTotal * incremento);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = '/login';
    };

    return (
        <IonPage className="trabajadores-page">
            <IonHeader>
                <IonToolbar className="toolbar">
                    <IonTitle className="header-title">Registro de Producción</IonTitle>
                    <IonButton slot="end" onClick={handleLogout}>
                        <IonIcon icon={logOut} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel>Selecciona un Corte:</IonLabel>
                        <IonSelect
                            placeholder="Seleccionar corte"
                            value={corteSeleccionado}
                            onIonChange={(e) => manejarCambioCorte(e.detail.value)}
                        >
                            {cortes.map((corte) => (
                                <IonSelectOption key={corte.id} value={corte.id.toString()}>
                                    {corte.numeroCorte} - {corte.modelo}
                                </IonSelectOption>
                            ))}
                        </IonSelect>

                        {corteSeleccionado && (
                            <IonList>
                                {posiciones.map((pos) => (
                                    <IonItem key={pos.id}>
                                        <IonLabel>
                                            {pos.nombre} - ${pos.precio}
                                        </IonLabel>
                                        <IonInput
                                            type="number"
                                            value={pos.cantidad}
                                            onIonChange={(e) =>
                                                manejarCambioCantidad(pos.id, parseInt(e.detail.value!, 10))
                                            }
                                            placeholder="Cantidad realizada"
                                        />
                                    </IonItem>
                                ))}
                            </IonList>
                        )}

                        <IonItem>
                            <IonLabel>Días Feriados:</IonLabel>
                            <IonToggle
                                checked={diasFeriados}
                                onIonChange={(e) => {
                                    setDiasFeriados(e.detail.checked);
                                    const nuevoTotal = posiciones.reduce(
                                        (acc, pos) => acc + pos.cantidad * pos.precio,
                                        0
                                    );
                                    const incremento = e.detail.checked ? 1.4 : 1.2;
                                    setTotal(nuevoTotal * incremento);
                                }}
                            />
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel className="card-title">Total Calculado:</IonLabel>
                        <IonItem>
                            <IonLabel>${total.toFixed(2)}</IonLabel>
                        </IonItem>
                        <IonButton expand="block" className="primary-button ion-margin-top">
                            <IonIcon icon={checkmark} slot="start" />
                            Enviar Registro Semanal
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Trabajadores;
