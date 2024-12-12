import React, { useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonAlert,
    IonIcon,
} from '@ionic/react';
import { add, arrowBack } from 'ionicons/icons';
import api from '../components/db/apis.js';
import { useHistory } from 'react-router';
import './CrearUsuario.css';

const CrearUsuario: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const history = useHistory();

    const crearUsuario = async () => {
        try {
            const response = await api.post('/crear-usuario', {
                nombre,
                email,
                contrasena,
                rol,
            });

            if (response.status === 201) {
                setMensaje('Usuario creado con éxito');
                setShowAlert(true);
                setNombre('');
                setEmail('');
                setContrasena('');
                setRol('');
            }
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            setMensaje('Error al crear el usuario. Verifica los datos.');
            setShowAlert(true);
        }
    };

    const volver = () => {
        history.push('/administradores');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButton slot="start" onClick={volver} fill="clear">
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                    <IonTitle>Crear Usuario</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12">
                                    <IonItem>
                                        <IonLabel position="floating">Nombre</IonLabel>
                                        <IonInput
                                            value={nombre}
                                            onIonChange={(e) => setNombre(e.detail.value!)}
                                            placeholder="Ingrese el nombre"
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <IonItem>
                                        <IonLabel position="floating">Correo Electrónico</IonLabel>
                                        <IonInput
                                            type="email"
                                            value={email}
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                            placeholder="Ingrese el correo"
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
                                            value={contrasena}
                                            onIonChange={(e) => setContrasena(e.detail.value!)}
                                            placeholder="Ingrese la contraseña"
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="12">
                                    <IonItem>
                                        <IonLabel>Rol</IonLabel>
                                        <IonSelect
                                            value={rol}
                                            placeholder="Seleccione un rol"
                                            onIonChange={(e) => setRol(e.detail.value!)}
                                        >
                                            <IonSelectOption value="trabajador">
                                                Trabajador
                                            </IonSelectOption>
                                            <IonSelectOption value="administrador">
                                                Administrador
                                            </IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        <IonButton
                            expand="block"
                            color="primary"
                            onClick={crearUsuario}
                            className="crear-usuario-btn"
                        >
                            <IonIcon icon={add} slot="start" />
                            Crear Usuario
                        </IonButton>
                    </IonCardContent>
                </IonCard>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Estado"
                    message={mensaje}
                    buttons={['OK']}
                />
            </IonContent>
        </IonPage>
    );
};

export default CrearUsuario;
