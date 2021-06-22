import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => (
	<button className="button" {...props} />
)
