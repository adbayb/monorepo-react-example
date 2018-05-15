import React, { Component, StrictMode } from "react";
import { Button } from "@adbayb/shared";

class App extends Component {
	// @note: catch all from all children components (useful if we need to track)
	componentDidCatch(error, info) {
		console.error("App->error", error, info);
	}

	render() {
		return (
			<StrictMode>
				<div>APP1</div>
				<Button />
			</StrictMode>
		);
	}
}

export default App;
