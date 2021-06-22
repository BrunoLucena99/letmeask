import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';

function App() {
  return (
		<BrowserRouter>
			<AuthProvider>
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/rooms/new" component={NewRoom} exact />
					<Route path="/rooms/:id" component={Room} exact />
				</Switch>
			</AuthProvider>
		</BrowserRouter>
  );
}

export default App;
