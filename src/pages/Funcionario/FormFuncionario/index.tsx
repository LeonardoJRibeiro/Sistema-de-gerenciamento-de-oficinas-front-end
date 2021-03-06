import React, { useContext, useRef, memo, useEffect, useCallback, useState } from 'react';
import Dialogo from '../../../componentes/Dialog';
import ApiContext from '../../../contexts/ApiContext';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import useQuery from '../../../hooks/useQuery';
import comparar from '../../../recursos/Comparar';
import Alerta, { AlertaHandles } from '../../../componentes/Alerta';
import { Form, CampoDeCpfOuCnpj, DateField, CampoDeRadio, PhoneField, CampoDeEmail, NameField } from '../../../componentes/Form';
import Funcionario from '../../../Types/Funcionario';
import FuncionarioD from '../../../Types/FuncionarioD';
import FormEndereco from '../../../componentes/FormEndereco';
import BotaoIncluirOuAlterar from '../../../componentes/BotaoIncluirOuAlterar';
import AutoCompleteEspecialidade from '../../../componentes/AutoComplete/AutoCompleteEspecialidade';

const FormFuncionario: React.FC = () => {
  const { get, put, post } = useContext(ApiContext);
  const history = useHistory();
  const [funcionario, setFuncionario] = useState<FuncionarioD | undefined>(undefined);
  const id = useQuery("id");
  const refAlerta = useRef<AlertaHandles | undefined>(undefined);
  const isEdit = id !== null;


  const manipularEnvio = useCallback(async (dados) => {
    if (isEdit) {
      if (dados) {
        if (!comparar(funcionario, dados)) {
          dados._id = funcionario?._id;
          console.log(dados);
          const resposta = await put("/funcionario", dados);
          if (resposta) {
            history.goBack();
          }
        }
        else {
          if (refAlerta.current) {
            refAlerta.current.setTipo("warning");
            refAlerta.current.setMensagem("Nenhuma alteração foi efetuada.");
            refAlerta.current.setAberto(true);
          }
        }
      }
    }
    else {
      const resposta = await post("/funcionario", dados);
      if (resposta) {
        history.goBack();
      }
    }
  }, [funcionario, history, isEdit, post, put]);

  const popular = useCallback(async () => {
    const resposta = await get(`funcionario/id?_id=${id}`) as Funcionario;
    if (resposta) {
      const funcionario = {
        ...resposta,
        especialidades: resposta.especialidades.map(especialidade => especialidade._id)
      } as FuncionarioD
      setFuncionario(funcionario)
    }
  }, [get, id]);

  useEffect(() => {
    if (isEdit) {
      popular()
    }
  }, [isEdit, popular])
  console.log(funcionario)

  return (
    <Dialogo maxWidth="md" fullWidth open title={isEdit ? "Alterar funcionário" : "Incluir funcionário"}>
      <Form initialData={funcionario} onSubmit={manipularEnvio}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={8}>
            <NameField name="nome" label="Nome" autoComplete="no" fullWidth required autoFocus />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CampoDeCpfOuCnpj name="cpf" label="CPF" autoComplete="no" disabled={isEdit} onlyCpf fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DateField name="dataNascimento" label="Data de nascimento" fullWidth required openTo="year" />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CampoDeRadio name="sexo" label="Sexo" required>
              <FormControlLabel value="f" control={<Radio color="primary" />} label="Feminino" />
              <FormControlLabel value="m" control={<Radio color="primary" />} label="Masculino" />
            </CampoDeRadio>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneFixo" label="Telefone fixo" autoComplete="no" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneCelular" label="Telefone celular" autoComplete="no" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <CampoDeEmail name="email" label="E-mail" autoComplete="no" fullWidth />
          </Grid>
          <FormEndereco />
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <AutoCompleteEspecialidade label="Especialidades" multiple required name="especialidades" />
          </Grid>
        </Grid>
        <BotaoIncluirOuAlterar isEdit={isEdit} />
      </Form>
      <Alerta ref={refAlerta} />
    </Dialogo>
  );
}

export default memo(FormFuncionario);