import '../styles/auth.scss';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

export const Home = () => {
	const history = useHistory();
	const { signInWithGoogle, user } = useContext(AuthContext);

	const goToNewRooms = () => history.push('/rooms/new')

	const handleCreateRoom = async () => {
		if (!user) {
			try {
				await signInWithGoogle();
				goToNewRooms()
			} catch(e) {
				console.log('Erro: ', e);
			}
		} else {
			goToNewRooms()
		}
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />	
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo real</p>
			</aside>
			<main>
				<div className="main-content" >
					<img src={logoImg} alt="Logo letmeask" />

					<button className="create-room" onClick={handleCreateRoom} >
						<img src={googleIconImg} alt="Logo do Google" />
						Crie sua sala com o Google
					</button>

					<div className="separator">ou entre em uma sala</div>

					<form>
						<input
							type="text"
							placeholder="Digite o código da sala"
						/>
						<Button type="submit">
							Entrar na sala
						</Button>
					</form>
					
				</div>
			</main>
		</div>
	)
};