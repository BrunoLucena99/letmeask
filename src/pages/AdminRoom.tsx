import '../styles/room.scss';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
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

	const handleCheckQuestionAsAnswered = async (questionId: string) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true,
		});
	};

	const handleHighlightQuestion = async (questionId: string, isHighlighted: boolean) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: !isHighlighted,
		});
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
							isAnswered={question.isAnswered}
							isHighlighted={question.isHighlighted}
						>

							{!question.isAnswered && (
								<>
									<button
									type="button"
									onClick={() => handleCheckQuestionAsAnswered(question.id)}
									>
										<img src={checkImg} alt="Marcar pergunta como respondida" />
									</button>

									<button
										type="button"
										onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
									>
										<img src={answerImg} alt="Dar destaque a pergunta" />
									</button>
								</>
							)}

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