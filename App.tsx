import * as React from 'react';
import './styles.scss';
import './src/translations/i18n';
import Root from 'Root';
import { RecoilRoot } from 'recoil';
global.Buffer = global.Buffer || require('buffer').Buffer

const App = () => {
  return (
    <RecoilRoot>
      <Root />
    </RecoilRoot>

  )

};

export default App;