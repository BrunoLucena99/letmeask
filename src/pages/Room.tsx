import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { FormEvent } from 'react';
import { verifyStringIsEmpty } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

interface RoomRouteParams {
	id: string;
}

export const Room = () => {
	const [newQuestion, setNewQuestion] = useState('');
	const params = useParams<RoomRouteParams>();
	const roomId = params.id;

	const { user } = useAuth();
	const { questions, title } = useRoom(roomId);

	const handleSendQuestion = async (event: FormEvent) => {
		event.preventDefault();

		if (verifyStringIsEmpty(newQuestion)) {
			return;
		}

		if (!user) {
			// verify react hot toast
			throw new Error('You must be logged in');
		}

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			isHighlighted: false,
			isAnswered: false
		}

		await database.ref(`rooms/${roomId}/questions`).push(question);
		setNewQuestion('');

	};

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask logo" />
					<RoomCode code={roomId} />
				</div>
			</header>

			<main className="content">

				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && (
						<span>
							{`${questions.length} ${questions.length === 1 ? 'pergunta' : 'perguntas'}`}
						</span>
					)}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder="O que você quer perguntar?"
						onChange={event => setNewQuestion(event.target.value)}
						value={newQuestion}
					/>

					<div className="form-footer">
						{user ? (
							<div className="user-info">
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta, <button>faça seu login</button>.
							</span>
						)}
						<Button type="submit" disabled={!user}>
							Enviar pergunta
						</Button>
					</div>
				</form>
				<div className="question-list">
					{questions.map((question) => (
						<Question
							key={question.id}
							author={question.author}
							content={question.content}
						/>
					))}
				</div>
			</main>
		</div>
	)
}