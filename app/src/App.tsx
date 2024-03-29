import React from 'react';
import {Providers} from './shared/providers';
import {Root} from './app/navigation/Root';

function App() {
  return (
    <Providers>
      <Root />
    </Providers>
  );
}

export default App;
