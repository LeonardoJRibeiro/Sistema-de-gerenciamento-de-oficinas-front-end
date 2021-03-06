import React, { createContext, useState, useEffect } from "react";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import responsiveFontSizes from '@material-ui/core/styles/responsiveFontSizes';
import Paper from '@material-ui/core/Paper';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface ThemeContextValues {
  alterarTema: () => void,
  alterarTamanhoFonte: (novoTamanho: number) => void,
  temaEscuro: boolean,
  tamanhoFonte: number,
}

const TemaContexto = createContext<ThemeContextValues>({} as ThemeContextValues);

export const TemaProvider: React.FC = (props: any) => {
  const prefersDarkTheme = useMediaQuery("(prefers-color-scheme: dark)");
  const [temaEscuro, setTemaEscuro] = useState<boolean>(prefersDarkTheme);
  const [tamanhoFonte, setTamanhoFonte] = useState<number>(13);

  useEffect(() => {
    const temaEscuro = localStorage.getItem("temaEscuro");
    if (!temaEscuro) {
      setTemaEscuro(prefersDarkTheme);
    }
  }, [prefersDarkTheme]);

  const alterarTema = () => {
    if (temaEscuro) {
      setTemaEscuro(false);
      localStorage.setItem("temaEscuro", JSON.stringify(false));
    }
    else {
      setTemaEscuro(true);
      localStorage.setItem("temaEscuro", JSON.stringify(true));
    }
  }

  function alterarTamanhoFonte(novoTamanho: number) {
    if (novoTamanho >= 10 && novoTamanho <= 30) {
      setTamanhoFonte(novoTamanho);
      localStorage.setItem("tamanhoFonte", JSON.stringify(novoTamanho));
    }
  }

  useEffect(() => {
    const temaEscuro = localStorage.getItem("temaEscuro");
    if (temaEscuro) {
      setTemaEscuro(JSON.parse(temaEscuro));
    }
    const tamanhoFonte = localStorage.getItem("tamanhoFonte");
    if (tamanhoFonte) {
      setTamanhoFonte(Number(tamanhoFonte));
    }
  }, []);

  const tema = createMuiTheme({
    palette: {
      type: temaEscuro ? "dark" : "light",
    },
    typography: {
      fontSize: tamanhoFonte,
    },
    overrides: {
      MuiGrid: {
        item: {
          transition: '0.3s'
        }
      }
    }
  });

  return (
    <TemaContexto.Provider value={{ alterarTema, alterarTamanhoFonte, temaEscuro, tamanhoFonte }}>
      <ThemeProvider theme={responsiveFontSizes(tema)}>
        <Paper square>
          {props.children}
        </Paper>
      </ThemeProvider>
    </TemaContexto.Provider>
  )
}

export default TemaContexto;