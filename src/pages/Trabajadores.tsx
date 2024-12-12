import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import { logOut, checkmark } from 'ionicons/icons';
import './Trabajadores.css';
import api from '../components/db/apis';

interface Posicion {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
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

    // Obtener los cortes desde el backend
    useEffect(() => {
        const obtenerCortes = async () => {
            try {
                const response = await api.get<Corte[]>('/obtener-cortes');
                console.log('Cortes obtenidos:', response.data); // Verifica los datos
    
                if (response.data && Array.isArray(response.data)) {
                    // Mapear directamente las posiciones sin aplicar parseFloat si precio ya es un número
                    const cortesConPrecioNumerico = response.data.map((corte) => ({
                        ...corte,
                        posiciones: corte.posiciones.map((pos) => ({
                            ...pos,
                            precio: pos.precio, // Asumimos que ya es un número
                        })),
                    }));
    
                    setCortes(cortesConPrecioNumerico);
                } else {
                    console.warn('Formato inesperado:', response.data);
                    setCortes([]);
                }
            } catch (error) {
                console.error('Error al obtener los cortes:', error);
                alert('Error al cargar los cortes, intente nuevamente.');
            }
        };
    
        obtenerCortes();
    }, []);
    

    const manejarCambioCorte = (corteId: string) => {
        const corte = cortes.find((c) => c.id?.toString() === corteId);
        if (corte) {
            setCorteSeleccionado(corteId);
            setPosiciones(
                corte.posiciones.map((pos) => ({
                    ...pos,
                    cantidad: 0, // Inicializamos la cantidad en 0
                }))
            );
        } else {
            console.warn('Corte no encontrado:', corteId);
            setPosiciones([]);
        }
    };

    const manejarCambioCantidad = (posicionId: number, cantidad: number) => {
        const nuevasPosiciones = posiciones.map((pos) =>
            pos.id === posicionId ? { ...pos, cantidad: cantidad || 0 } : pos
        );
        setPosiciones(nuevasPosiciones);

        // Calcular el total
        const nuevoTotal = nuevasPosiciones.reduce((acc, pos) => acc + pos.cantidad * pos.precio, 0);
        const incremento = diasFeriados ? 1.4 : 1.2; // Incremento del 40% o 20%
        setTotal(nuevoTotal * incremento);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <IonPage className="trabajadores-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="header-title">Registro de Producción</IonTitle>
                    <IonButton slot="end" onClick={handleLogout}>
                        <IonIcon icon={logOut} />
                        Cerrar Sesión
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* Selección de Corte */}
                <IonCard className="card">
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel>Selecciona un Corte:</IonLabel>
                                    <IonSelect
                                        placeholder="Seleccionar corte"
                                        value={corteSeleccionado}
                                        onIonChange={(e) => manejarCambioCorte(e.detail.value)}
                                    >
                                        {cortes.length > 0 ? (
                                            cortes.map((corte) =>
                                                corte && corte.id ? (
                                                    <IonSelectOption key={corte.id} value={corte.id.toString()}>
                                                        {corte.numeroCorte} - {corte.modelo}
                                                    </IonSelectOption>
                                                ) : null
                                            )
                                        ) : (
                                            <IonSelectOption disabled>No hay cortes disponibles</IonSelectOption>
                                        )}
                                    </IonSelect>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <IonLabel className="ion-margin-top">Días Feriados:</IonLabel>
                                    <IonToggle
                                        checked={diasFeriados}
                                        onIonChange={(e) => setDiasFeriados(e.detail.checked)}
                                    />
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                {/* Lista de Posiciones */}
                <IonCard className="card">
                    <IonCardContent>
                    <IonList>
    {posiciones.map((pos) => (
        <IonItem key={pos.id}>
            <IonLabel>
                {pos.nombre} - ${!isNaN(Number(pos.precio)) ? Number(pos.precio).toFixed(2) : '0.00'}
            </IonLabel>
            <IonInput
                type="number"
                value={pos.cantidad}
                onIonChange={(e) =>
                    manejarCambioCantidad(pos.id, parseInt(e.detail.value!, 10) || 0)
                }
                placeholder="Cantidad realizada"
            />
        </IonItem>
    ))}
</IonList>


                    </IonCardContent>
                </IonCard>

                {/* Total Calculado */}
                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel>Total Calculado:</IonLabel>
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
