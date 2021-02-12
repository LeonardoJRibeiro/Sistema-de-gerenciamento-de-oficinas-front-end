import { Box, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Tooltip } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { useCallback, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import BotaoIncluir from '../BotaoIncluir';
import EditIcon from '@material-ui/icons/Edit';
import useListagem from '../../hooks/useListagem';
import Modelo from '../../Types/Modelo';
import Servico from '../../Types/Servico';
import Peca from '../../Types/Peca';
import Marca from '../../Types/Marca';
import Especialidade from '../../Types/Especialidade';
import FormConsulta, { Filter } from '../FormConsulta';
import Veiculo from '../../Types/Veiculo';
import OrdemDeServico from '../../Types/OrdemDeServico';
import Cliente from '../../Types/Cliente';
import Fornecedor from '../../Types/Fornecedor';
import Funcionario from '../../Types/Funcionario';

type Value<T = any> = T;

interface BaseListagemProps<T,> {
  getPrimaryText: (item: T) => string;
  getSecondaryText?: (item: T) => string | JSX.Element;
  getLinkToChange: (item: T) => string;
  getTitleLinkToChange: (item: T) => string;
  getLinkToShow?: (item: T) => string;
  linkToInsert: string;
  linkToInsertTitle: string;
  formSearchFilters: Filter[];
  renderSecondaryActions?: (item: T) => JSX.Element;
  renderAvatar?: (item: T) => JSX.Element;
  onClick?: (item: T) => void;
}


type Props = (BaseListagemProps<Peca> & {
  dominio: "peca"
}) | (BaseListagemProps<Servico> & {
  dominio: "servico"
}) | (BaseListagemProps<Modelo> & {
  dominio: "modelo"
}) | (BaseListagemProps<Marca> & {
  dominio: "marca"
}) | (BaseListagemProps<Especialidade> & {
  dominio: "especialidade"
}) | (BaseListagemProps<Veiculo> & {
  dominio: "veiculo"
}) | (BaseListagemProps<Cliente> & {
  dominio: "cliente"
}) | (BaseListagemProps<Fornecedor> & {
  dominio: "fornecedor"
}) | (BaseListagemProps<Funcionario> & {
  dominio: "funcionario"
}) | (BaseListagemProps<OrdemDeServico> & {
  dominio: "ordemdeservico"
})

export default function Listagem({
  getPrimaryText,
  getSecondaryText,
  linkToInsert,
  getTitleLinkToChange,
  linkToInsertTitle,
  getLinkToChange,
  renderAvatar,
  renderSecondaryActions,
  formSearchFilters,
  dominio,
  onClick,
  getLinkToShow
}: Props): JSX.Element {
  const history = useHistory();
  const { handlePageChange, handleSearch, itens, listar, page, total } = useListagem(dominio);

  useEffect(() => {
    listar()
  }, [listar])

  const handleClick = useCallback((item: any) => {
    if (getLinkToShow){
      history.push(getLinkToShow(item));
    }
    if (onClick) {
      onClick(item)
    }
  }, [getLinkToShow, history, onClick]);

  return (
    <>
      <FormConsulta onSubmit={handleSearch} filters={formSearchFilters} />
      <Box mb={2}>
        <List>
          {
            itens?.map((item, index) => {
              const props: object = onClick || getLinkToShow ? {
                button: true,
                onClick: () => handleClick(item)
              } : {}
              return (
                <ListItem key={index} divider {...props}>
                  {renderAvatar
                    ? <ListItemAvatar >
                      {renderAvatar(item)}
                    </ListItemAvatar>
                    : null
                  }
                  <ListItemText primary={getPrimaryText(item)} secondary={getSecondaryText ? getSecondaryText(item) : null} />
                  <ListItemSecondaryAction>
                    {
                      renderSecondaryActions && renderSecondaryActions(item)
                    }
                    <Tooltip title={getTitleLinkToChange(item)}>
                      <IconButton component={Link} to={getLinkToChange(item)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })
          }
        </List>
      </Box >
      <Box display="flex" justifyContent="center">
        <Pagination count={Math.ceil(Number(total) / 100)} onChange={handlePageChange} page={page} />
      </Box>
      <BotaoIncluir titulo={linkToInsertTitle} linkTo={linkToInsert} />
    </>
  );
}