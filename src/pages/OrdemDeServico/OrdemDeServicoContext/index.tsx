import React, { useState, createContext, useCallback, useContext } from 'react';
import ItemDePeca from '../../../Types/ItemDePeca';
import ItemDeServico from '../../../Types/ItemDeServico';
import ApiContext from '../../../contexts/ApiContext';

interface OrdemDeServicoContextValues{
  itensDePeca: ItemDePeca[];
  itensDeServico: ItemDeServico[];
  indexTab: number;
  valorTotalPecas: () => number;
  valorTotalServicos: () => number;
  setItensDePeca: React.Dispatch<React.SetStateAction<ItemDePeca[]>>;
  setItensDeServico: React.Dispatch<React.SetStateAction<ItemDeServico[]>>;
  setIndexTab: React.Dispatch<React.SetStateAction<number>>;
  handleSubmit: (dados: any) => void;
}

const OrdemDeServicoContext = createContext<OrdemDeServicoContextValues>({} as OrdemDeServicoContextValues);

export const OrdemDeServicoProvider: React.FC = ({children}) => {
  const [itensDePeca, setItensDePeca] = useState<ItemDePeca[]>([]);
  const [itensDeServico, setItensDeServico] = useState<ItemDeServico[]>([]);
  const [indexTab, setIndexTab] = useState<number>(1);

  const {post} = useContext(ApiContext);

  const validar = useCallback(()=>{
    if(itensDeServico.length){
      return true;
    }
    else{
      setIndexTab(2);
      return false;
    }
  },[itensDeServico.length])

  const handleSubmit = useCallback(async (dados)=>{
    if(validar()){
      dados.itensDeServico = itensDeServico.map(itemDeServico => {
        return {
          idServico: itemDeServico.servico._id,
          idFuncionario: itemDeServico.funcionario._id,
          garantia: itemDeServico.garantia,
          unidadeDeGarantia: itemDeServico.unidadeDeGarantia,
          valorUnitario: itemDeServico.valorUnitario,
          quantidade: itemDeServico.quantidade,
          valorTotal: itemDeServico.valorTotal
        }
      });
      dados.itensDePeca = itensDePeca.map(itemDePeca => {
        return {
          idPeca: itemDePeca.peca._id,
          idFornecedor: itemDePeca.fornecedor._id,
          garantia: itemDePeca.garantia,
          unidadeDeGarantia: itemDePeca.unidadeDeGarantia,
          valorUnitario: itemDePeca.valorUnitario,
          quantidade: itemDePeca.quantidade,
          valorTotal: itemDePeca.valorTotal
        }
      });
      await post('ordemdeservico', dados);

    }
  },[itensDePeca, itensDeServico, post, validar]);

  const valorTotalPecas = useCallback(()=>{
    let valorTotal = 0;
    itensDePeca.forEach(itemDePeca=>{
      valorTotal = valorTotal + itemDePeca.valorTotal;
    })
    return valorTotal
  },[itensDePeca])

  const valorTotalServicos = useCallback(()=>{
    let valorTotal = 0;
    itensDeServico.forEach(itemDeServico=>{
      valorTotal = valorTotal + itemDeServico.valorTotal;
    })
    return valorTotal
  },[itensDeServico])

  return (
    <OrdemDeServicoContext.Provider
      value={{
        itensDePeca, 
        itensDeServico,
        indexTab,
        valorTotalPecas,
        valorTotalServicos,
        setItensDePeca,
        setItensDeServico,
        setIndexTab,
        handleSubmit
      }}
    >
      {children}
    </OrdemDeServicoContext.Provider>
  );
}

export default OrdemDeServicoContext;