import React, { useState, useEffect } from 'react';
import {baseIndicatorState, selectedFilterState, calculateDateFromIndicator, calculateMonthFromYear} from '../state/navbar';
import { useRecoilState, useRecoilValueLoadable, useRecoilValue } from 'recoil';


const Navbar = () => {
 
  const baseIndicator = useRecoilValueLoadable(baseIndicatorState);
  const [selectedFilter, setSelectedFilter] = useRecoilState(selectedFilterState);
  const yearCalculationState = useRecoilValueLoadable(calculateDateFromIndicator);
  const monthCalculationState = useRecoilValueLoadable(calculateMonthFromYear);

  return (
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <p className="title">Buscador de Indicadores</p>
          <p className="subtitle">Seleccione sus filtros</p>
          <div className='row'>
              <div className='grid is-flex is-justify-content-space-around'>
                <div className='cell field is-horizontal'>
                  <div className="label is-normal pr-3">
                    <label className="label">Indicadores</label>
                  </div>
                  <div className="control">
                    <div className="select is-normal">
                      <select onChange={(e) => {
                        setSelectedFilter({...selectedFilter, indicator: e.target.value, month:0});
                      }} disabled={baseIndicator.state === 'loading'}>
                        <option>Seleccione un indicador</option>

                        {baseIndicator.state === 'loading' ?(
                          <option>Cargando...</option>
                        ) : (

                          baseIndicator.contents.map(indicator => (
                            <option key={indicator.codigo} value={indicator.codigo}>{indicator.nombre}</option>
                          ))
                        )}
                      </select>
                      {baseIndicator.state === 'loading' && <span className="spinner">🔄</span>}
                    </div>
                  </div>
                </div>
                
                <div className="field cell is-horizontal">
                  <div className="label is-normal pr-3">
                    <label className="label">Año</label>
                  </div>
                  <div className="control">
                    <div className="select is-normal">
                      <select onChange={(e) => setSelectedFilter({...selectedFilter, year: parseInt(e.target.value)})}
                      disabled={yearCalculationState.state === 'loading'}
                      value={selectedFilter.year}
                      >  
                        <option>Seleccione un año</option>
                        {yearCalculationState.state === 'loading' ? (
                          <option>Cargando...</option>
                        ) : (
                          yearCalculationState.contents.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))
                        )}
                      </select>
                      {yearCalculationState.state === 'loading' && <span className="spinner">🔄</span>}
                    </div>
                  </div>
                  </div>

                <div className="field cell is-horizontal">
                  <div className="label is-normal pr-3">
                    <label className="label">Mes</label>
                  </div>
                  <div className="control">
                    <div className="select is-normal">
                    <select onChange={(e) => setSelectedFilter({...selectedFilter, month: e.target.value})}
                      disabled={monthCalculationState.state === 'loading' || monthCalculationState.contents.length === 0}
                      value={selectedFilter.month}
                      >
                      <option>Seleccione un mes</option>
                      {monthCalculationState.contents.length > 0 ?
                        (
                        
                        monthCalculationState.contents.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))
                      )
                      :(
                        <option>No Aplica</option>
                      )}
                    </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>            
        </div>
      </section>
      
    </div>
  );
};

export default Navbar;





