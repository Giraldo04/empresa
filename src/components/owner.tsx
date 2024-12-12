import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonList, IonGrid, IonRow, IonCol } from '@ionic/react';
// @ts-ignore
import api from './db/apis.js';
import './Administradores.css';

const Administradores: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('trabajador');


    const handleCrearUsuario = async () => {
        try {
            const response = await api.post('/crear-usuario', {nombre, email, contrasena: password, rol});
            if (response.status === 201) {
                alert('Usuario creado con exito');
                setNombre('');
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            alert('Error al crear el usuario. Por favor, intenta nuevamente.')
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Administrador - Crear Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size="12">
                            <IonItem>
                                <IonLabel position="floating">Nombre</IonLabel>
                                <IonInput   
                                    type="text"
                                    value={nombre}
                                    onIonChange={(e) => setNombre(e.detail.value!)}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonItem>
                                <IonLabel position="floating">Correo Electronico</IonLabel>
                                <IonInput
                                    type="email"
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonItem>
                                <IonLabel position="floating">Contrasena</IonLabel>
                                <IonInput
                                    type="password"
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonItem>
                                <IonLabel position="floating">Rol</IonLabel>
                                <IonInput
                                    type="text"
                                    value={rol}
                                    onIonChange={(e) => setRol(e.detail.value!)}
                                />
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol size="12">
                            <IonButton expand="block" color="secondary" onClick={handleCrearUsuario}>
                                Crear Usuario
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );

    
};

export default Administradores;