import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonList, IonSelect, IonSelectOption, IonCard, IonCardContent } from '@ionic/react';

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
      alert('El modelo ya existe. Por favor, elige otro nombre o usa la opción de copia.');
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Administración de Modelos y Cortes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Número de Corte</IonLabel>
              <IonInput value={nuevoCorte} onIonChange={(e) => setNuevoCorte(e.detail.value!)} />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Modelo</IonLabel>
              <IonInput value={nuevoModelo} onIonChange={(e) => setNuevoModelo(e.detail.value!)} />
            </IonItem>

            <IonItem>
              <IonLabel>Copiar Posiciones de un Modelo Existente</IonLabel>
              <IonSelect value={modeloSeleccionado} placeholder="Seleccione un modelo" onIonChange={(e) => setModeloSeleccionado(e.detail.value)}>
                {modelos.map((mod, index) => (
                  <IonSelectOption key={index} value={mod.nombre}>{mod.nombre}</IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonButton expand="block" color="secondary" onClick={copiarPosiciones}>Copiar Posiciones</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Nueva Posición</IonLabel>
              <IonInput value={nuevaPosicion} onIonChange={(e) => setNuevaPosicion(e.detail.value!)} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Precio por Pantalón (en pesos)</IonLabel>
              <IonInput type="number" value={nuevoPrecio} onIonChange={(e) => setNuevoPrecio(parseFloat(e.detail.value!))} />
            </IonItem>
            <IonButton expand="block" color="primary" onClick={agregarPosicion}>Agregar Posición</IonButton>
          </IonCardContent>
        </IonCard>

        <IonList>
          <IonLabel className="ion-padding">Posiciones Registradas:</IonLabel>
          {posiciones.map((pos, index) => (
            <IonItem key={index}>
              <IonLabel>{pos.nombre} - {pos.precio} $</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="block" color="success" onClick={guardarModelo}>Guardar o y Posiciones</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Administradores;
