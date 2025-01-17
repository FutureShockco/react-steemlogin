import React, { Component } from "react";
import { withRouter, Redirect, BrowserRouter} from 'react-router-dom';
import steemlogin from 'steemlogin';
import {setToken, getToken, removeToken} from '../storage/localToken';
import actionsCreator from "./actionsCreator"

const qs = require('query-string');

const SteemContext = React.createContext();


 class App extends Component
{
		constructor(props){
			super(props)

			if(!this.props.config)
				throw new Error('Steem config JSON is required.'); 

			this.state = {
				token: null,
				redirect: false,
				auth: null,
				api: null,
				loading: false, //For Async or slow methods
				error_logs: [],
			}


			this.steemLogin  = steemlogin.Initialize(this.props.config)
			this.steemLoginUrl = this.steemLogin.getLoginURL();
		}
		//Clean all the state of the app
		logout()
		{

			this.steemLogin.revokeToken((err, res)=> {
				if(res)
				{
					this.setState({token: null,
				redirect: false,
				auth: null,
				api: null,
				error_logs: []})
					removeToken()
				}
			});
		}


		login(redirect="", auto_redirect=true)
		{
			//We check if is a SteemLogin Method
			if(this._getLocationParams())
				if(auto_redirect)
					this.props.history.push(redirect)

			if(this._loadToken())
			{
				this.setState({loading: true})
				this.steemLogin.me((err, res) =>{
				if(res){
					this.setState({auth: res.account})
				}
				else{
					const error_logs = this.state.error_logs;
					error_logs.push("Failed to login: ", err);
					this.logout()
				}
				this.setState({loading: false})
				});
			}
		}

		_getLocationParams()
		{
			//Validate if is an steemlogin token or something else.
			const queries = qs.parse(this.props.location.search);
			if(queries)
				if(queries.access_token)
				{
					setToken(queries);
					return true
				}
			return false
		}

		_loadToken()
		{
			 const saved_token = getToken();
			 if(saved_token)
				if(saved_token.access_token)
				{
					//Validata date created
					this.setState({token:saved_token.access_token})
					this.steemLogin.setAccessToken([saved_token.access_token])
					return true
				}
			return false
		}

		plugginLogin()
		{
			var params = {};

			// The "username" parameter is required prior to log in for "Steem Keychain" users.
			if (steemlogin.useSteemKeychain) {
				console.log(steemlogin.useSteemKeychain)

			//params = { username: 'fabien' };
			}
/*
			this.steemlogin.login(params, function(err, token) {
			console.log(err, token)
			});
			*/

		}

		componentDidMount()
		{

			if(this.props.apha === "testv3")
				this.plugginLogin()

			this.login()


		}

		render()
		{
			const steem = {

						loginUrl: this.steemLoginUrl,
						auth: this.state.auth,
						steemLogin: this.steemLogin,
						logout: this.logout.bind(this),
						loading: this.state.loading
			}

			
				steem["actions"] = actionsCreator(steem);


			return (

				<SteemContext.Provider value={steem}>
					{this.props.children}
				 </SteemContext.Provider>
			);
		}
	}


const Tmp = withRouter(App)


const SteemProvider = (props)=>(
	<BrowserRouter>
		<Tmp {...props}/>
	</BrowserRouter>)

export default SteemProvider




 const withSteem = (WrapperedComponent)=>{

	return (props)=>(
			<SteemContext.Consumer>
		  			{steem => {

		  				return(<WrapperedComponent 
		  					{...props} 
		  					steem={steem} />)
		  			}}
			</SteemContext.Consumer>
		);
}


export {SteemContext, withSteem}


// Donate!
// var link = api.sign('transfer', {
//   to: 'fabien',
//   amount: '1.000 STEEM',
//   memo: 'Hello World!',
// }, 'http://localhost:8000/demo/transfer-complete');
