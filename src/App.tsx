import React, { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Trabajadores from './pages/Trabajadores';
import Administradores from './pages/Administradores';
import Login from './pages/Login';

import '@ionic/react/css/core.css';
import './theme/variables.css';

const App: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    console.log('Token:', token, 'Rol:', rol);

    if (token && rol) {
      if (rol === 'administrador' && window.location.pathname !== '/administradores') {
        history.push('/administradores');
      } else if (rol === 'trabajador' && window.location.pathname !== '/trabajadores') {
        history.push('/trabajadores');
      }
    } else if (window.location.pathname !== '/login') {
      history.push('/login');
    }

    setLoading(false);
  }, [history]);

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un componente de carga más estilizado si lo prefieres
  }

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
