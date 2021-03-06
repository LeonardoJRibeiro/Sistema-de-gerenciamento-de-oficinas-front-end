import React, { useCallback, useContext, useRef, memo } from 'react';
import { Form, MoneyField, CampoDeTexto, CampoDeSelecao } from '../../../componentes/Form';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Hidden from '@material-ui/core/Hidden';
import { FormProviderHandles } from '../../../componentes/Form/types';
import OrdemDeServicoContext from '../../OrdemDeServico/OrdemDeServicoContext';
import AutoCompleteServico from '../../../componentes/AutoComplete/AutoCompleteServico';
import AutoCompleteFuncionario from '../../../componentes/AutoComplete/AutoCompleteFuncionario';
import ArrowTop from '../../../componentes/ArrowTop';

const FormItensDeServico: React.FC = () => {
  const formRef = useRef<FormProviderHandles>({} as FormProviderHandles);
  const { itensDeServico, itemDeServicoSelecionado, setItemDeServicoSelecionado, handleSubmitFormItemDeServico } = useContext(OrdemDeServicoContext);

  const calcularValorTotal = useCallback((event) => {
    const valorUnitario = Number(formRef.current.getFieldValue('valorUnitario'));
    const quantidade = Number(formRef.current.getFieldValue('quantidade'));
    formRef.current.setFieldValue('valorTotal', quantidade * valorUnitario);
  }, []);

  const handleReset = useCallback(() => {
    if (itemDeServicoSelecionado !== undefined) {
      setItemDeServicoSelecionado(undefined);
    }
  }, [itemDeServicoSelecionado, setItemDeServicoSelecionado]);

  const intialData = itemDeServicoSelecionado !== undefined ? {
    ...itensDeServico[itemDeServicoSelecionado],
    servico: itensDeServico[itemDeServicoSelecionado].servico._id,
    funcionario: itensDeServico[itemDeServicoSelecionado].funcionario._id,
  } : undefined;

  return (
    <>
      <Hidden mdUp>
        <ArrowTop />
      </Hidden>
      <Form onSubmit={handleSubmitFormItemDeServico} ref={formRef} initialData={intialData} clearOnSubmit>
        <Card>
          <CardHeader title="Incluir serviço" />
          <CardContent>
            <Grid container spacing={2} justify="flex-end">
              <Grid item xs={12} md={6} >
                <AutoCompleteServico name="servico" label="Serviço" />
              </Grid>
              <Grid item xs={12} md={6}>
                <AutoCompleteFuncionario name="funcionario" required label="Funcionário" />
              </Grid>
              <Grid item xs={7} md={2} >
                <CampoDeTexto type="number" name="garantia" fullWidth required label="Garantia" />
              </Grid>
              <Grid item xs={5} md={2}>
                <CampoDeSelecao name="unidadeDeGarantia" label="Tipo" fullWidth required>
                  <MenuItem value="0">Km</MenuItem>
                  <MenuItem value="1">Dias</MenuItem>
                </CampoDeSelecao>
              </Grid>
              <Grid item xs={6} md={3} >
                <MoneyField name="valorUnitario" fullWidth required label="Valor unitário" onChange={calcularValorTotal} />
              </Grid>
              <Grid item xs={6} md={2} >
                <CampoDeTexto type="number" name="quantidade" fullWidth required label="Quantidade" onChange={calcularValorTotal} />
              </Grid>
              <Grid item xs={6} md={3}>
                <MoneyField name="valorTotal" fullWidth required label="ValorTotal" />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid container spacing={2} justify="flex-end">
              <Grid item >
                <Button type="reset" onClick={handleReset} variant="outlined">{itemDeServicoSelecionado !== undefined ? "Cancelar" : "Limpar"}</Button>
              </Grid>
              <Grid item >
                <Button type="submit" variant="outlined">{itemDeServicoSelecionado !== undefined ? "Alterar" : "Adicionar"}</Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Form >
    </>
  );
}

export default memo(FormItensDeServico);