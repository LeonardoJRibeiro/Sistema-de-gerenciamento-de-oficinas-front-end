import React, { memo } from 'react';
import {  Box, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Hidden } from '@material-ui/core';
import ClienteItem from '../ClienteItem';
import Cliente from '../../../Types/Cliente';

interface ListagemClientesProps{
  clientes: Cliente[];
}

const ListagemClientes: React.FC<ListagemClientesProps> = ({ clientes }) => {
  return (
    <Box mb={2}>
      <TableContainer >
        <Table size="small">
          <TableHead>
            <TableRow >
              <TableCell >Nome</TableCell>
              <Hidden xsDown>
                <TableCell >Telefone Celular</TableCell>
              </Hidden>
              <TableCell size="small" align="right">Expandir</TableCell>
              <TableCell size="small" align="right">alterar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !!clientes.length && clientes.map((cliente, index) => (
                <ClienteItem cliente={cliente} key={index} />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default memo(ListagemClientes);