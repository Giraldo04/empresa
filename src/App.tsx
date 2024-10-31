import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Trabajadores from './pages/Trabajadores';
import Administradores from './pages/Administradores';
import Login from './pages/Login';

import '@ionic/react/css/core.css';
import './theme/variables.css';

const App: React.FC = () => {
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    console.log('Token:', token, 'Rol:', rol);

    if (token && rol) {
      if (rol === 'administrador') {
        window.location.href = '/administradores';
      } else if (rol === 'trabajador') {
        window.location.href = '/trabajadores';
      }
    } else {
      window.location.href = '/login';
    }
  }, [history]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact />
          <Route path="/administradores" component={Administradores} exact />
          <Route path="/trabajadores" component={Trabajadores} exact />
          <Redirect from="/" to="/login" exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
