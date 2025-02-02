import React from 'react';
import Plot from 'react-plotly.js';
import { useRecoilValueLoadable, useRecoilValue } from 'recoil';
import {checkValidFilters, selectedFilterState} from '../state/navbar';


const Grafico = () => {

  const selectedFilter = useRecoilValue(selectedFilterState);
  const validFilter = useRecoilValueLoadable(checkValidFilters);


  if (validFilter.state === 'loading') return <div>Cargando...</div>;
  if (validFilter.state === 'hasError')return <div>Error al cargar los datos</div>;
  if (!validFilter.contents.length) return <div>No hay datos disponibles</div>;

  return (
    <div>
        {validFilter.state === 'loading' ? <div>Cargando...</div> : (
        <Plot
        data={[
            {
            x: validFilter.contents.map(d => new Date(d.fecha).toLocaleDateString()),
            y: validFilter.contents.map(d => d.valor),
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
            }
        ]}
        layout={{ title: { text: `${selectedFilter.indicator}`},
                    xaxis: { title: { text: 'Fecha'}},
                    yaxis: { title: { text: 'Valor'}},
                    height: '80vh',
        }}
        />
        )}
    </div>
  );
};

export default Grafico;