import React, { memo, useContext } from 'react';
import { Switch, Route, Redirect, } from 'react-router-dom';
import PaginaInicial from './componentes/paginaInicial/PaginaInicial';
import Teste from './componentes/teste';
import AuthContext from './contexts/AuthContext';
import PaginaInicialOficina from './componentes/paginaInicialOficina/PaginaInicialOficina';
import DialgoMarcas from './componentes/marca/DialogMarcas';
import DialogoLogin from './componentes/DialogoLogin';
import DialogInserirMarca from './componentes/marca/DialogoInserirMarca';


function Rotas() {
  const { usuario } = useContext(AuthContext);
  return (
    <>
      <Switch>
        <Route path="/login" exact>
          <DialogoLogin/>
        </Route>
        <Route path="/t" exact>
          <Teste />
        </Route>
      </Switch>
      {
        !usuario ? (
          <PaginaInicial />
        )
          : (
            <>
              <PaginaInicialOficina />
              <Switch>
                <Route path="/marcas" exact>
                  <DialgoMarcas />
                </Route>
                <Route path="/marcas/inserir" exact>
                  <DialogInserirMarca />
                </Route>
                <Route path="/login" exact>
                  <Redirect to="/" />
                </Route>
              </Switch>
            </>
          )
      }

    </>
  );
}

export default memo(Rotas);