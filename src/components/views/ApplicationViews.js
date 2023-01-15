import { useNavigate } from "react-router-dom";
import { logout } from "../helpers/logout";
import { HomeContainer } from "../Home/HomeContainer"

export const ApplicationViews = () => {
	let navigate = useNavigate();

	// Move this to where ever you end up putting your logout button
	const onLogout = () => {
		logout.logout(navigate);
	};

	return <>
		<button type="submit" onClick={onLogout}>
			Logout
		</button>
		<HomeContainer />
	</>
}