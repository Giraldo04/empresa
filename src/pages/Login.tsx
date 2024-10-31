import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonAlert } from '@ionic/react';
// @ts-ignore
import api from '../components/db/api'
import { useHistory } from 'react-router';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', { email, contrasena: password });
            console.log("Respuesta completa del servidor:", response.data);


            const { token, rol } = response.data;

            localStorage.setItem('token', token); // Guarda el token en el almacenamiento local
            localStorage.setItem('rol', rol)

            setAlertMessage('Inicio de sesión exitoso');
            setShowAlert(true);

            if (rol=== 'administrador') {
                history.push('/administradores');
                
            }else if (rol === 'trabajador') {
                history.push('/trabajadores');
                
            }


            
        } catch (error) {
            setAlertMessage('Error en el inicio de sesión. Verifica tus credenciales.');
            setShowAlert(true);
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
