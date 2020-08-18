import React, { useCallback, useState, useContext, useEffect, useRef, memo } from 'react';
import { Form, MoneyField, CampoDeTexto } from '../../../../componentes/Form';
import ApiContext from '../../../../contexts/ApiContext';
import SelectField from '../../../../componentes/Form/Fields/SelectField';
import { Grid, MenuItem, Button, Container } from '@material-ui/core';
import { FormProviderHandles } from '../../../../componentes/Form/types';
import Servico from '../../../../Types/Servico';
import Funcionario from '../../../../Types/Funcionario';
import OrdemDeServicoContext from '../../OrdemDeServicoContext';


const FormItensDeServico: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[] | undefined>(undefined);
  const [funcionarios, setFuncionarios] = useState<Funcionario[] | undefined>(undefined);
  const { get } = useContext(ApiContext);
  const formRef = useRef<FormProviderHandles>({} as FormProviderHandles);
  const { setItensDeServico } = useContext(OrdemDeServicoContext);

  const popularServicos = useCallback(async () => {
    const servicos = await get('servico') as Servico[];
    if (servicos) {
      setServicos(servicos);
    }
  }, [get]);

  const popularFuncionarios = useCallback(async () => {
    const funcionarios = await get('funcionario') as Funcionario[];
    if (funcionarios) {
      setFuncionarios(funcionarios);
    }
  }, [get]);

  useEffect(() => {
    popularServicos();
  }, [popularServicos]);

  useEffect(() => {
    popularFuncionarios();
  }, [popularFuncionarios]);

  const handleSubmit = useCallback((dados) => {
    if (servicos && funcionarios) {
      const servico = servicos[Number(dados.servico)];
      const funcionario = funcionarios[Number(dados.funcionario)];
      const valorUnitario = Number(dados.valorUnitario);
      const quantidade = Number(dados.quantidade);
      const valorTotal = valorUnitario * quantidade;
      setItensDeServico((ItensDeServico) => [...ItensDeServico, {
        servico,
        funcionario,
        valorTotal,
        valorUnitario,
        quantidade,
      }])
    }
  }, [funcionarios, servicos, setItensDeServico]);

  const calcularValorTotal = useCallback((event) => {
    const valorUnitario = Number(formRef.current.getFieldValue('valorUnitario'));
    const quantidade = Number(formRef.current.getFieldValue('quantidade'));
    formRef.current.setFieldValue('valorTotal', quantidade * valorUnitario);
  }, []);

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item md={4} lg={3}>
            <SelectField name="servico" fullWidth required label="Serviço">
              {servicos?.map((servico, indice) => (
                <MenuItem key={indice} value={indice}>{servico.descricao}</MenuItem>
              ))}
            </SelectField>
          </Grid>
          <Grid item md={4} lg={3}>
            <SelectField name="funcionario" fullWidth required label="Funcionário">
              {funcionarios?.map((funcionario, indice) => (
                <MenuItem key={indice} value={indice}>{funcionario.nome}</MenuItem>
              ))}
            </SelectField>
          </Grid>
          <Grid item md={2}>
            <MoneyField name="valorUnitario" fullWidth required label="Valor unitário" onChange={calcularValorTotal} />
          </Grid>
          <Grid item md={2}>
            <CampoDeTexto type="number" min={0} name="quantidade" fullWidth required label="Quantidade" onChange={calcularValorTotal} />
          </Grid>
          <Grid item md={1}>
            <MoneyField name="valorTotal" fullWidth required label="ValorTotal" />
          </Grid>
          <Grid item md={1}>
            <Button type="submit" variant="outlined">Adicionar</Button>
          </Grid>
        </Grid>
      </Container>
    </Form>
  );
}

export default memo(FormItensDeServico);