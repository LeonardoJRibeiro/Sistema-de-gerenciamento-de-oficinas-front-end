import React, { useState, createContext, useCallback, useContext } from 'react';
import ItemDePeca from '../../../Types/ItemDePeca';
import ItemDeServico from '../../../Types/ItemDeServico';
import ApiContext from '../../../contexts/ApiContext';
import OrdemDeServico from '../../../Types/OrdemDeServico';
import { useHistory } from 'react-router-dom';

interface OrdemDeServicoContextValues {
  itensDePeca: ItemDePeca[];
  itensDeServico: ItemDeServico[];
  valorTotalPecas: () => number;
  valorTotalServicos: () => number;
  setItensDePeca: React.Dispatch<React.SetStateAction<ItemDePeca[]>>;
  setItensDeServico: React.Dispatch<React.SetStateAction<ItemDeServico[]>>;
  handleSubmit: (dados: any) => void;
  removerItemDePeca: (_id: string | undefined) => void;
  alterarItemDePeca: (_id: string | undefined) => void;
  itemDePecaSelecionado: number | undefined;
  setItemDePecaSelecionado: React.Dispatch<React.SetStateAction<number | undefined>>;
  itemDeServicoSelecionado: number | undefined;
  alterarItemDeServico: (_id: string | undefined) => void;
  removerItemDeServico: (_id: string | undefined) => void;
  setItemDeServicoSelecionado: React.Dispatch<React.SetStateAction<number | undefined>>;
  getOrdemDeServico: (_id: string) => void;
  ordemDeServico: OrdemDeServico | undefined;
  handleSubmitFormItemDePeca: (dados: any) => void;
  handleSubmitFormItemDeServico: (dados: any) => void;
  clearForm: () => void;
}

const OrdemDeServicoContext = createContext<OrdemDeServicoContextValues>({} as OrdemDeServicoContextValues);

export const OrdemDeServicoProvider: React.FC = ({ children }) => {
  const [itensDePeca, setItensDePeca] = useState<ItemDePeca[]>([]);
  const [itemDePecaSelecionado, setItemDePecaSelecionado] = useState<number | undefined>();
  const [itemDeServicoSelecionado, setItemDeServicoSelecionado] = useState<number | undefined>();
  const [itensDeServico, setItensDeServico] = useState<ItemDeServico[]>([]);
  const [ordemDeServico, setOrdemDeServico] = useState<OrdemDeServico | undefined>();
  const { post, get, put } = useContext(ApiContext);
  const history = useHistory();

  const clearForm = useCallback(() => {
    setItensDeServico([]);
    setItensDePeca([]);
    setOrdemDeServico(undefined);
    setItemDePecaSelecionado(undefined);
    setItemDeServicoSelecionado(undefined);
  }, []);

  const getOrdemDeServico = useCallback(async (_id: string) => {
    const resposta = await get(`ordemdeservico/id?_id=${_id}`) as OrdemDeServico | undefined;
    if (resposta) {
      setOrdemDeServico(resposta as OrdemDeServico);
      if (resposta.itensDePeca) {
        setItensDePeca(resposta.itensDePeca)
      }
      if (resposta.itensDeServico) {
        setItensDeServico(resposta.itensDeServico)
      }
    }
  }, [get]);

  const validar = useCallback(() => {
    if (itensDeServico.length) {
      return true;
    }
    else {
      return false;
    }
  }, [itensDeServico.length,])

  const handleSubmit = useCallback(async (dados) => {
    if (validar()) {
      dados.itensDeServico = itensDeServico.map(itemDeServico => {
        return {
          servico: itemDeServico.servico._id,
          funcionario: itemDeServico.funcionario._id,
          garantia: itemDeServico.garantia,
          unidadeDeGarantia: itemDeServico.unidadeDeGarantia,
          valorUnitario: itemDeServico.valorUnitario,
          quantidade: itemDeServico.quantidade,
          valorTotal: itemDeServico.valorTotal
        }
      });
      dados.itensDePeca = itensDePeca.map(itemDePeca => {
        return {
          peca: itemDePeca.peca._id,
          fornecedor: itemDePeca.fornecedor._id,
          garantia: itemDePeca.garantia,
          unidadeDeGarantia: itemDePeca.unidadeDeGarantia,
          valorUnitario: itemDePeca.valorUnitario,
          quantidade: itemDePeca.quantidade,
          valorTotal: itemDePeca.valorTotal
        }
      });
      console.log(dados);
      if (ordemDeServico) {
        dados._id = ordemDeServico._id;
        const response = await put('ordemdeservico', dados);
        if (response) {
          history.goBack();
        }
      }
      else {
        const response = await post('ordemdeservico', dados);
        if (response) {
          history.goBack();
        }
      }
    }
  }, [history, itensDePeca, itensDeServico, ordemDeServico, post, put, validar]);

  const valorTotalPecas = useCallback(() => {
    let valorTotal = 0;
    itensDePeca.forEach(itemDePeca => {
      valorTotal = valorTotal + itemDePeca.valorTotal;
    })
    return valorTotal
  }, [itensDePeca])

  const valorTotalServicos = useCallback(() => {
    let valorTotal = 0;
    itensDeServico.forEach(itemDeServico => {
      valorTotal = valorTotal + itemDeServico.valorTotal;
    })
    return valorTotal
  }, [itensDeServico])

  const getIndexItemDePecaById = useCallback((_id: string) => {
    return itensDePeca.findIndex(itemDePeca => itemDePeca._id === _id);
  }, [itensDePeca]);

  const getIndexItemDeServicoById = useCallback((_id: string) => {
    return itensDeServico.findIndex(itemDeServico => itemDeServico._id === _id);
  }, [itensDeServico]);

  const removerItemDePeca = useCallback((_id: string | undefined) => {
    if (_id !== undefined) {
      const index = getIndexItemDePecaById(_id)
      setItemDePecaSelecionado(undefined)
      setItensDePeca([...itensDePeca.slice(0, index), ...itensDePeca.slice(index + 1)])
    }
  }, [getIndexItemDePecaById, itensDePeca]);

  const alterarItemDePeca = useCallback((_id: string | undefined) => {
    if (_id !== undefined) {
      setItemDePecaSelecionado(getIndexItemDePecaById(_id));
    }
  }, [getIndexItemDePecaById]);

  const removerItemDeServico = useCallback((_id: string | undefined) => {
    if (_id !== undefined) {
      const index = getIndexItemDeServicoById(_id)
      setItemDeServicoSelecionado(undefined)
      setItensDeServico([...itensDeServico.slice(0, index), ...itensDeServico.slice(index + 1)])
    }
  }, [getIndexItemDeServicoById, itensDeServico]);

  const alterarItemDeServico = useCallback((_id: string | undefined) => {
    if (_id !== undefined) {
      setItemDeServicoSelecionado(getIndexItemDeServicoById(_id));
    }
  }, [getIndexItemDeServicoById]);


  const handleSubmitFormItemDePeca = useCallback((dados) => {
    // if () {
    console.log(dados.peca)
    const itemDePeca: ItemDePeca = {
      peca: dados.peca,
      fornecedor: (dados.fornecedor),
      valorUnitario: Number(dados.valorUnitario),
      garantia: Number(dados.garantia),
      unidadeDeGarantia: dados.unidadeDeGarantia,
      quantidade: Number(dados.quantidade),
      valorTotal: Number(dados.valorUnitario) * Number(dados.quantidade),
      _id: String(itensDePeca.length),
    }
    //if (!validar(itemDePeca)) {
    if (itemDePecaSelecionado !== undefined) {
      setItensDePeca([
        ...itensDePeca.slice(0, itemDePecaSelecionado),
        itemDePeca,
        ...itensDePeca.slice(itemDePecaSelecionado + 1)
      ]);
      setItemDePecaSelecionado(undefined)
    }
    else {
      console.log('ins')
      setItensDePeca((ItensDePeca) => [...ItensDePeca, itemDePeca])
    }
    //  }
    // }
  }, [itemDePecaSelecionado, itensDePeca, setItemDePecaSelecionado, setItensDePeca]);

  const handleSubmitFormItemDeServico = useCallback((dados) => {
    const itemDeServico = {
      servico: dados.servico,
      funcionario: dados.funcionario,
      valorUnitario: Number(dados.valorUnitario),
      garantia: Number(dados.garantia),
      unidadeDeGarantia: dados.unidadeDeGarantia,
      quantidade: Number(dados.quantidade),
      valorTotal: Number(dados.valorUnitario) * Number(dados.quantidade),
      _id: String(itensDeServico.length),
    } as ItemDeServico;
    //if (!validar(itemDeServico)) {
    if (itemDeServicoSelecionado !== undefined) {
      setItensDeServico([
        ...itensDeServico.slice(0, itemDeServicoSelecionado),
        itemDeServico,
        ...itensDeServico.slice(itemDeServicoSelecionado + 1)
      ]);
    }
    else {
      setItensDeServico((ItensDeServico) => [...ItensDeServico, itemDeServico])
    }
    // }

  }, [itemDeServicoSelecionado, setItensDeServico, itensDeServico]);

  return (
    <OrdemDeServicoContext.Provider
      value={{
        itensDePeca,
        itensDeServico,
        valorTotalPecas,
        valorTotalServicos,
        setItensDePeca,
        setItensDeServico,
        handleSubmit,
        alterarItemDePeca,
        removerItemDePeca,
        itemDePecaSelecionado,
        setItemDePecaSelecionado,
        itemDeServicoSelecionado,
        setItemDeServicoSelecionado,
        alterarItemDeServico,
        removerItemDeServico,
        getOrdemDeServico,
        ordemDeServico,
        handleSubmitFormItemDePeca,
        handleSubmitFormItemDeServico,
        clearForm,
      }}
    >
      {children}
    </OrdemDeServicoContext.Provider>
  );
}

export default OrdemDeServicoContext;