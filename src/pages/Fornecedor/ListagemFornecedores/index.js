import React, { memo } from 'react';
import FornecedorItem from '../FornecedorItem';


function ListagemFornecedores({ fornecedores = [] }) {

  return (
    <>
      
      {
        !!fornecedores.length && fornecedores.map((cliente, index) => (
          <FornecedorItem fornecedor={cliente} key={index} />
        ))
      }
    </>
  );
}

export default memo(ListagemFornecedores);