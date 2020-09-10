import React, { useCallback, memo } from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { Form, CampoDeBusca } from '../../../componentes/Form';
import ComboBoxMarca from '../../../componentes/ComboBox/ComboBoxMarca';

export interface ConsultaValues {
  marca: String;
  consulta: String;
}

interface FormConsultaProps {
  onSubmit: (data: ConsultaValues) => void;
}
const FormConsultaPeca: React.FC<FormConsultaProps> = ({ onSubmit }) => {
  const handleSubmit = useCallback((data: any) => {
    onSubmit(data)
  }, [onSubmit]);

  return (
    <Card>
      <CardHeader title="Consulta" />
      <CardContent>
        <Form onSubmit={handleSubmit}>
          <ComboBoxMarca name="marca" label="Filtrar pela marca" />
          <CampoDeBusca name="consulta" fullWidth label="Consulta" />
        </Form>
      </CardContent>
    </Card>
  );
}

export default memo(FormConsultaPeca);