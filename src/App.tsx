import React, { useEffect, useState } from 'react';
import { Redirect, Route, useHistory } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Trabajadores from './pages/Trabajadores';
import Administradores from './pages/Administradores';
import Login from './pages/Login';
import PrivateRoute  from './components/PrivateRoute';
import CrearUsuario from './pages/CrearUsuario';

import '@ionic/react/css/core.css';
import './theme/variables.css';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading/>; 
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/login" component={Login} exact />
          <Route path="/crear-usuario" component={CrearUsuario} exact />
          <PrivateRoute path="/administradores" component={Administradores} exact />
          <PrivateRoute path="/crear-usuario" component={CrearUsuario} exact />
          <PrivateRoute path="/trabajadores" component={Trabajadores} exact />
          <Redirect from="/" to="/login" exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
