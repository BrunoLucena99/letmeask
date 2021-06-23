import { useEffect, useState } from "react";
import { database } from "../services/firebase";

interface QuestionType {
	id: string;
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string,
		avatar: string,
	},
	content: string,
	isAnswered: boolean,
	isHighlighted: boolean,
}> 

export const useRoom = (roomId: string) => {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState('');

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
				isHighlighted: val.isHighlighted
			}))

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		})
	}, [roomId]);

	return { questions, title }

};
