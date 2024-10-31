import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonToggle } from '@ionic/react';
import { add, checkmark, trash, logOut } from 'ionicons/icons';
import './Trabajadores.css';

interface Registro {
    posicion: string;
    cantidad: number;
    subtotal: number;
}

interface Posicion {
    nombre: string;
    precio: number;
}

interface TrabajadoresProps {
    cortesDisponibles: { modelo: string; corte: string; posiciones: Posicion[] }[];
}

const Trabajadores: React.FC<TrabajadoresProps> = ({ cortesDisponibles = [] }) => {
    const [corteSeleccionado, setCorteSeleccionado] = useState<string>('');
    const [posicionSeleccionada, setPosicionSeleccionada] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(0);
    const [registros, setRegistros] = useState<Registro[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [diasFeriados, setDiasFeriados] = useState<boolean>(false);

    const corteActual = cortesDisponibles?.find(corte => corte.corte === corteSeleccionado);
    const posicionesDisponibles = corteActual ? corteActual.posiciones : [];

    const agregarRegistro = () => {
        const valorPosicion = posicionesDisponibles.find(p => p.nombre === posicionSeleccionada)?.precio || 0;
        const nuevoSubtotal = cantidad * valorPosicion;

        setRegistros([...registros, { posicion: posicionSeleccionada, cantidad, subtotal: nuevoSubtotal }]);
        calcularTotal([...registros, { posicion: posicionSeleccionada, cantidad, subtotal: nuevoSubtotal }]);

        setPosicionSeleccionada('');
        setCantidad(0);
    };

    const calcularTotal = (registrosActuales: Registro[]) => {
        const nuevoSubtotal = registrosActuales.reduce((acc, registro) => acc + registro.subtotal, 0);
        const incremento = diasFeriados ? 1.4 : 1.2; // 40% si hay días feriados, 20% si no
        setTotal(nuevoSubtotal * incremento);
    };

    const eliminarRegistro = (index: number) => {
        const nuevosRegistros = registros.filter((_, i) => i !== index);
        setRegistros(nuevosRegistros);
        calcularTotal(nuevosRegistros);
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
                    <IonButton slot="end" onClick={handleLogout} color="danger" fill="clear">
                        <IonIcon icon={logOut} slot="icon-only" />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard className="card">
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Corte</IonLabel>
                                        <IonInput value={corteSeleccionado} onIonChange={(e) => setCorteSeleccionado(e.detail.value!)} />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Posición</IonLabel>
                                        <IonInput value={posicionSeleccionada} onIonChange={(e) => setPosicionSeleccionada(e.detail.value!)} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Cantidad</IonLabel>
                                        <IonInput type="number" value={cantidad} onIonChange={(e) => setCantidad(parseInt(e.detail.value!, 10))} />
                                    </IonItem>
                                </IonCol>
                                <IonCol>
                                    <IonButton expand="block" className="primary-button ion-margin-top" onClick={agregarRegistro}>
                                        <IonIcon icon={add} slot="start" />
                                        Agregar Registro
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonItem>
                                        <IonLabel>Días Feriados en la Semana</IonLabel>
                                        <IonToggle checked={diasFeriados} onIonChange={(e) => {
                                            setDiasFeriados(e.detail.checked);
                                            calcularTotal(registros);
                                        }} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel className="card-title">Registros:</IonLabel>
                        <IonList>
                            {registros.map((registro, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{registro.posicion} - {registro.cantidad} unidades - Subtotal: ${registro.subtotal}</IonLabel>
                                    <IonButton color="danger" slot="end" onClick={() => eliminarRegistro(index)}>
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCardContent>
                </IonCard>

                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel className="card-title">Total Calculado:</IonLabel>
                        <IonItem className="input-item">
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
