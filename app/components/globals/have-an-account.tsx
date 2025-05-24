import { Link } from "react-router";

interface AlreadyHaveAnAccountProps {
	type: "sign-in" | "sign-up";
}

const signInContent = {
	heading: `Don't have an account ?`,
	to: "/sign-up",
	buttonText: "Sign up",
};

const signUpContent = {
	heading: `Already have an account ?`,
	to: "/sign-in",
	buttonText: "Sign in",
};

const content = {
	"sign-in": signInContent,
	"sign-up": signUpContent,
};

export function HaveAnAccount({ type }: AlreadyHaveAnAccountProps) {
	const { heading, to, buttonText } = content[type as keyof typeof content];
	return (
		<div className="flex items-center justify-center gap-2">
			<p>{heading}</p>
			<Link to={to} className="underline">
				{buttonText}
			</Link>
		</div>
	);
}
