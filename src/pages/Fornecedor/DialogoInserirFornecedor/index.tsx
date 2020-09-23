import React, { useContext, memo, useCallback } from 'react';
import Dialogo from '../../../componentes/Dialog';
import ApiContext from '../../../contexts/ApiContext';
import { useHistory } from 'react-router-dom';
import { DialogActions, Button, Grid, } from '@material-ui/core';
import { CampoDeCpfOuCnpj, Form, CampoDeTexto, PhoneField, CampoDeEmail, CepField, Node, NameField } from '../../../componentes/Form';

const DialogoInserirFornecedor: React.FC = () => {
  const { post } = useContext(ApiContext);
  const history = useHistory();

  const manipularEnvio = useCallback(async (fornecedorASerInserido) => {
    if (fornecedorASerInserido) {
      console.log(fornecedorASerInserido);
      const resposta = await post("/fornecedor", fornecedorASerInserido);
      if (resposta) {
        history.goBack();
      }
    }
  }, [history, post]);

  return (
    <Dialogo maxWidth="md" fullWidth open title="Inserir fornecedor">
      <Form onSubmit={manipularEnvio}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={8}>
            <NameField name="nomeFantasia" label="Nome fantasia" autoComplete="no" fullWidth required autoFocus />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <CampoDeCpfOuCnpj name="cpfCnpj" label="CPF/CNPJ" autoComplete="no" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <CampoDeTexto name="razaoSocial" label="RazaoSocial" autoComplete="no" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneFixo" label="Telefone fixo" autoComplete="no" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <PhoneField name="telefoneCelular" label="Telefone celular" autoComplete="no" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <CampoDeEmail name="email" label="E-mail" required fullWidth autoComplete="no" />
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
    </Dialogo>
  );
}

export default memo(DialogoInserirFornecedor);