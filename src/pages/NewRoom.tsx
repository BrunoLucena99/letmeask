import '../styles/auth.scss';
import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { useAuth } from '../hooks/useAuth';
import { verifyStringIsEmpty } from '../utils/validators';

export const NewRoom = () => {
	const { user } = useAuth();
	const [newRoom, setNewRoom] = useState('');
	const history = useHistory();

	const handleCreateRoom = async (event: FormEvent) => {
		event.preventDefault();
		if (verifyStringIsEmpty(newRoom)) {
			return;
		}

		// roomRef Refers on an object/entity of firebase real time database
		const roomRef = database.ref('rooms');

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id
		});

		history.push(`/rooms/${firebaseRoom.key}`)
	};

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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							type="text"
							placeholder="Nome da sala"
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type="submit">
							Criar sala
						</Button>
					</form>
					<p>
						Quer entrar em uma sala existente?
						<Link to="/"> Clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	)
};