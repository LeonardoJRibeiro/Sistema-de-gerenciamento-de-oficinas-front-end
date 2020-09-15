import React, { useContext, useCallback, memo, useState, useEffect } from 'react';
import Marca from '../../../Types/Marca';
import ApiContext from '../../../contexts/ApiContext';
import ComboBox from '../../Form/Fields/ComboBox';
import { AutocompleteInputChangeReason } from '@material-ui/lab';

interface ComboBoxMarcaProps {
  onChange?: (marca: Marca | null) => void;
  label: string;
  name: string;
  required?: boolean
}

const ComboBoxMarca: React.FC<ComboBoxMarcaProps> = ({ onChange, label, name, required }) => {
  const { get } = useContext(ApiContext);
  const [options, setOptions] = useState<Marca[]>([] as Marca[]);

  const getOptions = useCallback(async () => {
    console.log("obtendo opções")
    const resposta = await get(`/marca/?pagina=1&limite=100`, true) as any;
    if (resposta) {
      setOptions(resposta.marcas as Marca[]);
    }
  }, [get]);

  const getMoreOptions = useCallback(async (consulta) => {
    const resposta = await get(`/marca/consulta?descricao=${consulta}&pagina=1&limite=100`, true) as any;
    if (resposta) {
      setOptions(resposta.marcas as Marca[]);
    }
  }, [get]);

  const getDefaultValueInOptions = useCallback((value) => {
    return options.find((marca) => marca._id === value);
  }, [options]);

  const getDefaultValue = useCallback(async (value) => {
    let defaultValue = getDefaultValueInOptions(value);
    console.log(defaultValue)
    if (defaultValue) {
      return defaultValue;
    }
    else {
      defaultValue = await get(`/marca/id?_id=${value}`) as any;
      if (defaultValue) {
        setOptions(options => [...options, defaultValue as Marca])
        return defaultValue;
      }
      else {
        return null;
      }
    }
  }, [get, getDefaultValueInOptions]);


  useEffect(() => {
    getOptions();
  }, [getOptions]);

  const handleInputChange = useCallback((event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input" && value.length > 1) {
      getMoreOptions(value);
    }
  }, [getMoreOptions]);

  return (
    <ComboBox
      getDefaultValue={getDefaultValue}
      onInputChange={handleInputChange}
      name={name}
      label={label}
      path="current._id"
      fullWidth
      options={options}
      loading={options.length === 0}
      noOptionsText="Nenhuma Opção"
      loadingText="Carregando"
      clearText="Limpar"
      openText="Abrir"
      required={required}
      getOptionLabel={(option) => option.descricao}
      getOptionSelected={(option, value) => option.descricao === value.descricao}
    />
  );
}

export default memo(ComboBoxMarca);