import '../styles/auth.scss';

import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useHistory } from 'react-router-dom';
import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { verifyStringIsEmpty } from '../utils/validators';
import { database } from '../services/firebase';


export const Home = () => {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();
	const [roomCode, setRoomCode] = useState('');

	const goToNewRooms = () => history.push('/rooms/new')

	const handleCreateRoom = async () => {
		if (!user) {
			try {
				await signInWithGoogle();
				goToNewRooms()
			} catch (e) {}
		} else {
			goToNewRooms()
		}
	}

	const handleJoinRoom = async (event: FormEvent) => {
		event.preventDefault();
		if (verifyStringIsEmpty(roomCode)) {
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) {
			alert('Room does not exists');
			return;
		}

		if (roomRef.val().endedAt) {
			alert('Room already closed');
			return;
		}

		history.push(`/rooms/${roomCode}`);
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

					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							onChange={event => setRoomCode(event.target.value)}
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