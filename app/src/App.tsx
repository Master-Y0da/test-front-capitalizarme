import React, { Suspense, useState } from 'react';
import Navbar from './components/Navbar';
import Grafico from './components/Grafico';

const App: React.FC = () => {

  return (
    <div>
      <Navbar />
      <div className='is-flex is-justify-content-center my-5'>
        <div className='card has-background-grey-lighter' style={{width: '50%'}}>
            <Grafico/>
        </div>
      </div>
    </div>
  );
};
export default App;