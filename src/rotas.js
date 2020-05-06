import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import CadastroOficina from './dominios/oficina/CadastroOficina';
import PaginaInicial from './componentes/paginaInicial/PaginaInicial';

function Rotas(props) {
  return (
    <Switch>
      <Route path="/oficina/cadastro/" exact>
        <CadastroOficina {...props}/>
      </Route>
      <Route path="/" exact>
        <PaginaInicial {...props}/>
      </Route>
    </Switch>
  );
}

export default memo(Rotas);