import ErrorPage from "./components/error";

export default function NotFound() {
	return <ErrorPage statusCode={404} />;
}
