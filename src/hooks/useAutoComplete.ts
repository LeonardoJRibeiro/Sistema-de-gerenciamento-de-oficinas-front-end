import { AutocompleteInputChangeReason } from "@material-ui/lab";
import { useCallback, useContext, useEffect } from "react";
import ApiContext from "../contexts/ApiContext";
import { Dominio } from "../contexts/WebSocketContext";
import useListagem from "./useListagem";

export default function useAutoComplete<T>(pathToItens: string, dominio: string, filterToSearch: string) {
  const { itens, listar, handleSearch, setItens } = useListagem<T>(dominio as Dominio, undefined, true);
  const { get } = useContext(ApiContext);

  const getMoreOptions = useCallback(async (search) => {
    handleSearch([{
      name: filterToSearch,
      value: search
    }]);
  }, [filterToSearch, handleSearch]);

  const getDefaultValueInOptions = useCallback((value) => {
    return itens.find((item: any) => item._id === value);
  }, [itens]);

  const getDefaultValue = useCallback(async (value) => {
    let defaultValue = getDefaultValueInOptions(value);
    if (defaultValue) {
      return defaultValue;
    }
    else {
      defaultValue = await get(`/${dominio}/id?_id=${value}`, {disableAllProgress: true}) as any;
      if (defaultValue) {
        setItens(itens => {
          return {
            total: itens.total,
            itens: [...itens.itens, defaultValue as T]
          }
        }
        )
        return defaultValue;
      }
      else {
        return null;
      }
    }
  }, [dominio, get, getDefaultValueInOptions, setItens]);


  useEffect(() => {
    listar();
  }, [listar]);

  const handleInputChange = useCallback((event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input" && value.length > 1) {
      getMoreOptions(value);
    }
  }, [getMoreOptions]);

  return {
    handleInputChange,
    getDefaultValue,
    options: itens,
  }
}