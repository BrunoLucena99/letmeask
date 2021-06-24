import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useHistory, useParams } from 'react-router-dom';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

interface RoomRouteParams {
	id: string;
}

export const AdminRoom = () => {
	const params = useParams<RoomRouteParams>();
	const roomId = params.id;
	const history = useHistory();

	const { questions, title } = useRoom(roomId);

	const handleDeleteQuestion = async (questionId: string) => {
		if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	};

	const handleEndRoom = async () => {
		await database.ref(`rooms/${roomId}`).update({
			endedAt: new Date()
		});

		history.push('/');
	};

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask logo" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom} >Encerrar sala</Button>
					</div>
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

				<div className="question-list">
					{questions.map((question) => (
						<Question
							key={question.id}
							author={question.author}
							content={question.content}
						>
							<button
								type="button"
								onClick={() => handleDeleteQuestion(question.id)}
							>
								<img src={deleteImg} alt="Remover pergunta" />
							</button>
						</Question>
					))}
				</div>
			</main>
		</div>
	)
}