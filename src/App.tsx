import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import store from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  );
};

export default App;
