import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import './BarraLateral.css'

export default function BarraLateral({ estaAberta, nomeOficina, logoOficina, menuPressionado }) {
    return (
        <div className={estaAberta?"barra-lateral-fundo barra-lateral-fundo-aberta":"barra-lateral-fundo"}>
            <div className={estaAberta ? "barraLateral barraLateral-aberta" : "barraLateral"}>
                <div className="d-none d-sm-block">
                    <div className="areaLogo">
                        <img className="logoOficina img-fluid" src={logoOficina.caminho} alt={logoOficina.alt} />
                    </div>
                    <div className="nomeOficina">
                        {nomeOficina}
                    </div>
                </div>
                <div className="d-none d-sm-block">
                    <ListGroup className="m-2">
                        <Link to="" className="list-group-item-action bg-light my-1">Início</Link>
                        <Link to="/marca" className=" list-group-item-action bg-light my-1">Marcas</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Modelos</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Veículos</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Marcas</Link>
                    </ListGroup>
                </div>
                <div className="d-sm-none" onClick={() => { menuPressionado() }}>
                    <ListGroup className="m-2">
                        <Link to="" className="list-group-item-action bg-light my-1">Início</Link>
                        <Link to="/marca" className=" list-group-item-action bg-light my-1">Marcas</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Modelos</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Veículos</Link>
                        <Link to="marca" className=" list-group-item-action bg-light my-1">Marcas</Link>
                    </ListGroup>
                </div>
            </div>
        </div>
    );
}