import React, { memo } from 'react';
import AutoComplete from '../../Form/Fields/AutoComplete';
import useAutoComplete from '../../../hooks/useAutoComplete';
import Modelo from '../../../Types/Modelo';
import AutoCompleteProps from '../Types';

const AutoCompleteModelo: React.FC<AutoCompleteProps<Modelo>> = props => {
  const { getDefaultValue, handleInputChange, options } = useAutoComplete<Modelo>("modelos", "modelo", "descricao");
  return (
    <AutoComplete
      getDefaultValue={getDefaultValue}
      onInputChange={handleInputChange}
      path="_id"
      fullWidth
      options={options}
      loading={options.length === 0}
      noOptionsText="Nenhuma Opção"
      loadingText="Carregando"
      clearText="Limpar"
      openText="Abrir"
      getOptionLabel={(option) => option ? option.descricao : ""}
      getOptionSelected={(option, value) => option?.descricao === value?.descricao}
      {...props}
    />
  );
}

export default memo(AutoCompleteModelo);