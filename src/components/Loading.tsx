import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';

const Loading: React.FC = () => (
  <IonContent className="ion-padding ion-text-center">
    <IonSpinner name="crescent" />
    <div>Cargando...</div>
  </IonContent>
);

export default Loading;
