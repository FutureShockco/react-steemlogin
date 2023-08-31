# react-steemlogin

### What is react-steemlogin?
Start quickly a steem project with this flexible library that combines SteemLogin and Steem

***

   

## Content

[1. Installing.](#install)

[2. Using SteemLogin Context.](#steemlogin)

  [- Step 1: Setting up our provider.](#steemlogin-1)

  [- Step 2: Using the context consumer.](#steemlogin-2)

  [- What is in the steem instance?](#steemlogin-3)

[3. Async Steem functions.](#steem)

[4. Helpers.](#helper)

[5. Example.](#expamle)



***

<a name="install"/>

## 1.Installing
```bash
$ npm install react-steemlogin
$ yarn add react-steemlogin
 ```


***

<a name="steemlogin"/>

## 2.Using SteemLogin Context.

This library implements a context provider to manage the login state and other steemLogin instances.

<a name="steemlogin-1"/>

### Step 1: Setting up the context provider (you MUST do this step)

When the context provider is mounted, checks if there is the callback url with the token from SteemLogin to authenticate the user automatically.


*Note: The context provider requires the Steem Connect configJSON of your project*


**App.js**
```javascript
import React from 'react';
import SteemProvider from 'react-steemlogin';
import Dashboard from './Dashboard'; //Caution!

//SteemLogin Config JSON
const STEEM_CONFIG = {
        baseURL: 'https://steemlogin.com',
        app: '<appname>', 
        callbackURL: "<callbackURL>", 
        scope: [ 'login', 'vote', 
                'comment', 'delete_comment', 
                'comment_options', 'custom_json'
                ]
        };



const App = ()=>{
  return( 
    <SteemProvider config={STEEM_CONFIG}>
      <Dashboard />
    </SteemProvider>
    );
}

export default App;
```

***

<a name="steemlogin-2"/>

### Step 2: Using the Steem Context Consumer.

Once we have the SteemProvider in a parent component *(App.js)* we need to consume our **Context Provider** to  use the instances and functions from SteemLogin, in React there are many options to consume context, let's some of them.


*(Option A)* - **Using steem context consumer with useContext (hooks)**

*Note: Your React version must be >= 16.8 to use hooks*


**Dahsboard.js** 

```javascript
import React, {useContext} from 'react';
import {SteemContext} from 'react-steemlogin';

const Dashboard = (props)=>{
  const {
    loginUrl,
    auth,
    loading
    } = useContext(SteemContext);
    
  if(loading) return <h1>Loading, please wait...</h1>

  return( 
    <React.Fragment>
      {auth?<h1>You are logged</h1>:<a href={loginUrl}>Log in</a>}
    </React.Fragment>
    )
}

export default Dashboard;
```

---

*(Option B)* - **Using steem context consumer with withSteem (HOC)**

**Dahsboard.js**

```javascript
import React from 'react';
import {withSteem} from 'react-steemlogin'; //CONSUMER HOC

//Note: withSteem(HOC) is responsible of the **steem** prop. 
const Dashboard = withSteem(({steem})=>{
  const {
    loginUrl,
    auth,
    loading
    } = steem;

  if(loading) return (<h1>Loading, please wait...</h1>);

  return( 
    <React.Fragment>
      {auth?<h1 >You are logged</h1>:<a href={loginUrl}>Log in</a>}
    </React.Fragment>
    )
});


export default Dashboard;


/*
NOTE:

Instead of using withSteem (HOC), you can import the **SteemContext** as well to use it's Consumer .
import {SteemContext} from 'react-steemlogin';

<SteemContext.Consumer>
{(steem)=>{
    return <h1><SteemContext.Consumer></h1>
}}
</SteemContext.Consumer>

*/

```

---

<a name="steemlogin-3"/>

### What is in the *steem* instance?


**List of instances from SteemContext (steem)**

```javascript
    {
        loginUrl,//SteemLogin loginUrl 
        auth, //steem user or null
        steemLogin,//steemLogin original instance (client)
        logout, //logout function
        loading, //true when auth is loading
        actions //Set of writtig functions
    }
```

---


**List of actions from SteemContext (steem.actions)**


*Note: You MUST be logged to use some actions*


- Get logged user
```javascript
await steem.actions.me()
```

- Publish a post
```javascript
await steem.actions.post(post_params, advanced = [])
```
**post_params**
 ```javascript
post_params = {
    permlink, /*This is not required an uuidv4 id is replace in case if npt pasing this argument*/
    title,
    body,
    category,
    parent_permlink,
    jsonmetadata = {}
}
```

**advanced (optional)**
 ```javascript
advanced = [["comment_options", {...options }], ["vote", {...voteOptions }], ...otherOperations]
```

 
- Reply post
```javascript
await steem.actions.reply(reply_params, advanced=[])
```

**reply_params**
 ```javascript
reply_params = {
    author, 
    post, 
    body,  
    jsonmetadata = {}
}
```
**advanced (optional)**
 ```javascript
advanced = [["comment_options", {...options }], ["vote", {...voteOptions }], ...otherOperations]
```


- Remove post
```javascript
await steem.actions.remove(permlink)
```

- Create regular post
```javascript
await steem.actions.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
```

- Reblog Post
```javascript
await steem.actions.reblog(account, author, permlink)
```
- Follow account
```javascript
await steem.actions.follow(following)
```
- Unfollow account
```javascript
await steem.actions.unfollow(unfollower, unfollowing)
```
- Claim Reward Balance
```javascript
await steem.actions.claimRewardBalance(account, rewardSteem, rewardSbd, rewardVests)
```
- Update User Metadata
```javascript
await steem.actions.updateUserMetadata(metadata)
```
- Remove token
```javascript
await steem.actions.revokeToken()
```


***
<a name="steem"/>

## 3.Async Steem functions:





A simplificated set of async steem functions.

*Note: you dont need to use the SteemContext to implement this functions*



```javascript
import SteemAsync from 'react-steemlogin/SteemAsync';
```
- List of posts in the platform.
```javascript
// getBy: "Trending | Created | Hot | Promoted"
 SteemAsync.readPostGeneral(tag, getBy, limit).then(
    (response)=>{ console.log(response) }).catch(
    (err)=>console.error(err));
```

- Get full post 

```javascript
 SteemAsync.getPost(author, permlink).then(
    (response)=>{ console.log(response) }).catch(
    (err)=>console.error(err));

```
- Get user by username

```javascript

const user =  await SteemAsync.getUserAccount(username);

```


- List of posts in an account
```javascript
const post = await SteemAsync.getDiscussionsByBlog(username, limit);
```

- Get Follows Count in an account
```javascript
 SteemAsync.getFollowCount(username).then(
    (response)=>{ console.log(response) }).catch(
    (err)=>console.error(err));
```
- Get following 
```javascript
  await SteemAsync.getFollowing(username, limit, startAtSting = "a"); 
```


- Get Followers

```javascript
const followers =  SteemAsync.getFollowers(username, limit,  startAtSting = "a").then(
    (response)=>{ console.log(response) }).catch(
    (err)=>console.error(err));

```

---

### You can access to the steem.js package:
```javascript
import {steem} from 'react-steemlogin/SteemAsync';
```


***

<a name="helper"/>

## 4.Helpers

Useful functions for your steem project.


- Parse reputation
```javascript
import {parserSteemRep, parserSteemSimpleRep} from 'react-steemlogin/Helpers';
parserSteemRep("<<reputation>>") 
parserSteemSimpleRep("<<reputation>>")
```
- Parse Steem markdown  
```javascript
import {parseSteemMarkdown} from 'react-steemlogin/Helpers';
parseSteemMarkdown("<<post.body>>")
```

***

<a name="expamle"/>

## 5.Example

**Dahsboard.js**

*Note: Remember to implement the context provider as parent component.*

```javascript
import React, { useEffect, useContext } from "react";
import SteemAsync from "react-steemlogin/SteemAsync";
import { SteemContext } from "react-steemlogin";

const PrintPost = props => {
  const { actions, auth } = useContext(SteemContext);

  useEffect(async () => {
    let post = await SteemAsync.readPostGeneral("", "Trending", 10);
    console.log(post);
  });

  const makeANewPost = () => {
    actions
      .post({
        title: "_react-steemlogin",
        body: "### npm install react-steemlogin",
        category: "developer"
      })
      .then(() => {
        alert("Post created");
      })
      .catch(error => {
        alert("UPS, there is an error");
      });
  };

  if (!auth) throw "User not logged";
  return (
    <React.Fragment>
      <h1>
        This button create a post in your blog, be wise when you click on it{" "}
      </h1>
      <button onClick={makeANewPost}>Make a new post</button>
    </React.Fragment>
  );
};

const Dashboard = props => {
  const { auth, loginUrl } = useContext(SteemContext);
  return (
    <React.Fragment>
      {auth ? <PrintPost /> : <a href={loginUrl}>Log in</a>}
    </React.Fragment>
  );
};

export default Dashboard;

```

## Contribute
Help us to make of this an epic package.

## License
Licensed under MIT
