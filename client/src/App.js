
import { Container } from '@material-ui/core';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import UploadPage from './components/UploadPage/UploadPage';
import VideoPage from './components/VideoPage/VideoPage';
import Profile from './components/Profile/Profile';

const App = () => (
	<BrowserRouter>
		<Container maxWidth="lg" disableGutters="true">
			<Navbar />
			<Switch>
				<Route path="/" exact component = { Auth } />
				<Route path="/homepage" exact component = { Home } />
				<Route path="/upload" exact component = { UploadPage } />
				<Route path="/profile" exact component = { Profile } />
				<Route path="/:videoId" exact component = { VideoPage } /> 
			</Switch>
		</Container>
	</BrowserRouter>
);

export default App;