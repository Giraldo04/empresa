import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { add, copy, trash, logOut } from 'ionicons/icons'; // Importa algunos iconos
import './Administradores.css';

interface Posicion {
    nombre: string;
    precio: number;
}

interface Modelo {
    nombre: string;
    posiciones: Posicion[];
}

const Administradores: React.FC = () => {
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [nuevoModelo, setNuevoModelo] = useState<string>('');
    const [nuevoCorte, setNuevoCorte] = useState<string>('');
    const [posiciones, setPosiciones] = useState<Posicion[]>([]);
    const [modeloSeleccionado, setModeloSeleccionado] = useState<string>('');
    const [nuevaPosicion, setNuevaPosicion] = useState<string>('');
    const [nuevoPrecio, setNuevoPrecio] = useState<number>(0);

    const agregarPosicion = () => {
        if (nuevaPosicion && nuevoPrecio > 0) {
            setPosiciones([...posiciones, { nombre: nuevaPosicion, precio: nuevoPrecio }]);
            setNuevaPosicion('');
            setNuevoPrecio(0);
        } else {
            alert('Por favor, ingresa un nombre y un precio válido para la posición.');
        }
    };

    const guardarModelo = () => {
        const modeloExistente = modelos.find((mod) => mod.nombre === nuevoModelo);
        if (modeloExistente) {
            alert('El modelo ya existe. Por favor, elige otro nombre o usa la opción de copiar.');
            return;
        }
        setModelos([...modelos, { nombre: nuevoModelo, posiciones }]);
        setNuevoModelo('');
        setNuevoCorte('');
        setPosiciones([]);
    };

    const copiarPosiciones = () => {
        const modeloExistente = modelos.find((mod) => mod.nombre === modeloSeleccionado);
        if (modeloExistente) {
            setPosiciones([...modeloExistente.posiciones]);
        }
    };

    const eliminarPosicion = (index: number) => {
        const nuevasPosiciones = posiciones.filter((_, i) => i !== index);
        setPosiciones(nuevasPosiciones);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = '/login';
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="toolbar">
                    <IonTitle className="header-title">Administración de Modelos y Cortes</IonTitle>
                    <IonButton slot="end" onClick={handleLogout}>
                        <IonIcon icon={logOut} />
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
                                        <IonLabel position="floating">Número de Corte: </IonLabel>
                                        <IonInput value={nuevoCorte} onIonChange={(e) => setNuevoCorte(e.detail.value!)} />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Modelo: </IonLabel>
                                        <IonInput value={nuevoModelo} onIonChange={(e) => setNuevoModelo(e.detail.value!)} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <IonItem className="input-item">
                                        <IonLabel>Copiar Posiciones de un Modelo Existente</IonLabel>
                                        <IonSelect value={modeloSeleccionado} placeholder="Seleccione un modelo" onIonChange={(e) => setModeloSeleccionado(e.detail.value)}>
                                            {modelos.map((mod, index) => (
                                                <IonSelectOption key={index} value={mod.nombre}>{mod.nombre}</IonSelectOption>
                                            ))}
                                        </IonSelect>
                                    </IonItem>
                                    <IonButton expand="block" className="primary-button ion-margin-top" onClick={copiarPosiciones}>
                                        <IonIcon icon={copy} slot="start" />
                                        Copiar Posiciones
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <IonCard className="card">
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Nueva Posición: </IonLabel>
                                        <IonInput value={nuevaPosicion} onIonChange={(e) => setNuevaPosicion(e.detail.value!)} />
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem className="input-item">
                                        <IonLabel position="floating">Precio por Pantalón (en pesos): </IonLabel>
                                        <IonInput type="number" value={nuevoPrecio} onIonChange={(e) => setNuevoPrecio(parseFloat(e.detail.value!))} />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol>
                                    <IonButton expand="block" className="secondary-button ion-margin-top" onClick={agregarPosicion}>
                                        <IonIcon icon={add} slot="start" />
                                        Agregar Posición
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <IonCard className="card">
                    <IonCardContent>
                        <IonLabel className="card-title">Posiciones Registradas: </IonLabel>
                        <IonList>
                            {posiciones.map((pos, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{pos.nombre} - {pos.precio} $</IonLabel>
                                    <IonButton color="danger" slot="end" onClick={() => eliminarPosicion(index)}>
                                        <IonIcon icon={trash} />
                                    </IonButton>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCardContent>
                </IonCard>

                <IonButton expand="block" className="primary-button ion-margin-top" onClick={guardarModelo}>
                    <IonIcon icon={add} slot="start" />
                    Guardar Modelo y Posiciones
                </IonButton>
                <IonButton expand="block" color="danger" onClick={handleLogout} ></IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Administradores;
