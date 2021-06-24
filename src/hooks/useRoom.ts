import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

interface QuestionType {
	id: string;
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
	likeCount: number;
	likeId?: string;
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
	likes: Record<string, {
		authorId: string;
	}>;
}>

export const useRoom = (roomId: string) => {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState('');

	const { user } = useAuth();

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);
		/*
			Read firebase realtime database docs to increase performance of this event.
			Use childAdded/removed event instead of all values 
		*/
		roomRef.on('value', room => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, val]) => ({
				id: key,
				content: val.content,
				author: val.author,
				isAnswered: val.isAnswered,
				isHighlighted: val.isHighlighted,
				likeCount: Object.values(val.likes ?? {}).length,
				likeId: Object.entries(val.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
			}))

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		})

		return () => {
			roomRef.off('value');
		}
	}, [roomId, user?.id]);

	return { questions, title }

};
