import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAlert, IonSpinner } from '@ionic/react';
// @ts-ignore
import api from '../components/db/api'; // Asegúrate de que apunte al archivo api.js correctamente

import { useHistory } from 'react-router-dom'; // Importa desde 'react-router-dom'

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    useEffect(() => {
        // Comprobar si ya hay una sesión activa
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');
        
        if (token && rol) {
            if (rol === 'administrador') {
                history.push('/administradores');
            } else if (rol === 'trabajador') {
                history.push('/trabajadores');
            }
        }
    }, [history]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post('/login', { email, contrasena: password });
            const { token, rol } = response.data;

            if (token && rol) {
                localStorage.setItem('token', token);
                localStorage.setItem('rol', rol);
                setShowAlert(true);
                setAlertMessage('Inicio de sesión exitoso');

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Redirigir después de un pequeño retraso
                setTimeout(() => {
                    if (rol === 'administrador') {
                        history.push('/administradores');
                    } else if (rol === 'trabajador') {
                        history.push('/trabajadores');
                    }
                }, 500);
            }
        } catch (error) {
            setAlertMessage('Error en el inicio de sesión. Verifica tus credenciales.');
            setShowAlert(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Inicio de Sesión</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {loading ? (
                    <IonSpinner name="bubbles" />
                ) : (
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12">
                                <IonItem>
                                    <IonLabel position="floating">Correo Electrónico</IonLabel>
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
                                    <IonLabel position="floating">Contraseña</IonLabel>
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
                                <IonButton expand="block" color="secondary" onClick={handleLogin}>
                                    Iniciar Sesión
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                )}
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Estado"
                    message={alertMessage}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;
