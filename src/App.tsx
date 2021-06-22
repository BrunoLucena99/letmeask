import {BrowserRouter, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

function App() {
  return (
		<BrowserRouter>
			<AuthProvider>
				<Route path="/" component={Home} exact />
				<Route path="/rooms/new" component={NewRoom} exact />
			</AuthProvider>
		</BrowserRouter>
  );
}

export default App;
