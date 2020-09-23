import React, { useContext, useRef, memo, useEffect, useCallback, useState } from 'react';
import Dialogo from '../../../componentes/Dialog';
import ApiContext from '../../../contexts/ApiContext';
import { useHistory } from 'react-router-dom';
import { DialogActions, Button, Grid, FormControlLabel, Radio } from '@material-ui/core';
import useQuery from '../../../hooks/useQuery';
import comparar from '../../../recursos/Comparar';
import Alerta, { AlertaHandles } from '../../../componentes/Alerta';
import { Form, CampoDeTexto, CampoDeCpfOuCnpj, DateField, CampoDeRadio, PhoneField, CampoDeEmail, CepField, Node, NameField } from '../../../componentes/Form';
import Cliente from '../../../Types/Cliente';


const DialogoAlterarCliente: React.FC = () => {
  const { get, put, } = useContext(ApiContext);
  const history = useHistory();
  const [cliente, setCliente] = useState<Cliente | undefined>();
  const id = useQuery("id");
  const refAlerta = useRef<AlertaHandles>({} as AlertaHandles);

  const manipularEnvio = useCallback(async (dados) => {
    if (dados && cliente) {
      if (!comparar(cliente, dados)) {
        dados._id = cliente._id;
        console.log(dados);
        const resposta = await put("/cliente", dados);
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
  }, [cliente, history, put]);

  const popular = useCallback(async () => {
    const resposta = await get(`/cliente/id?_id=${id}`) as Cliente;
    if (resposta) {
      setCliente(resposta)
    }
  }, [get, id,]);

  useEffect(() => {
    popular();
  }, [popular])

  return (
    <Dialogo maxWidth="md" fullWidth open title="Alterar cliente">
      <Form initialData={cliente} onSubmit={manipularEnvio}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={8}>
            <NameField name="nome" label="Nome" autoComplete="no" fullWidth required autoFocus />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CampoDeCpfOuCnpj name="cpfCnpj" autoComplete="no" label="CPF/CNPJ" disabled fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DateField name="dataNascimento" label="Data de nascimento" fullWidth required openTo="year"/>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CampoDeRadio name="sexo" label="Sexo" required>
              <FormControlLabel value="f" control={<Radio color="primary" />} label="Feminino" />
              <FormControlLabel value="m" control={<Radio color="primary" />} label="Masculino" />
            </CampoDeRadio>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneFixo" autoComplete="no" label="Telefone fixo" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneCelular" autoComplete="no" label="Telefone celular" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <CampoDeEmail name="email" label="E-mail" autoComplete="no" fullWidth />
          </Grid>
          <Node node="endereco">
            <Grid item xs={12} sm={12} md={6}>
              <CampoDeTexto name="logradouro" label="Logradouro" autoComplete="no" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={9} md={6}>
              <CampoDeTexto name="bairro" label="Bairro" autoComplete="no" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <CampoDeTexto name="numero" label="Número" autoComplete="no" fullWidth required />
            </Grid>
            <Grid item xs={12} sm={9} md={7}>
              <CampoDeTexto name="complemento" label="Complemento" autoComplete="no" fullWidth />
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <CepField name="cep" label="CEP" fullWidth autoComplete="no" required />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CampoDeTexto name="estado" label="Estado" fullWidth autoComplete="no" required />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CampoDeTexto name="cidade" label="Cidade" fullWidth autoComplete="no" required />
            </Grid>
          </Node>
        </Grid>
        <DialogActions >
          <Button type="submit">Salvar</Button>
        </DialogActions>
      </Form>
      <Alerta ref={refAlerta} />
    </Dialogo>
  );
}

export default memo(DialogoAlterarCliente);