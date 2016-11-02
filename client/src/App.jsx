import React, {Component} from 'react';
import Chatbar from './ChatBar.jsx';
import MessageList from './MessageList.jsx';

class App extends Component {
  //set initial state with constructor**
  constructor(props) {
    super(props);
    this.socket = new WebSocket("ws://localhost:4000");
    this.handleChatBar = this.handleChatBar.bind(this);
    this.postMessage = this.postMessage.bind(this);
    this.state = { data : {
        currentUser : {},
        messages : [],
      }
    }
  }

  postMessage (messageData) {

    const messageArray = this.state.data.messages;
    messageArray.push({
      username: messageData.data.username,
      content: messageData.data.content,
      id: messageData.data.id});

    this.setState( {data : {
      currentUser : messageData.data.username,
      messages : messageArray
    }});
    console.log(messageData);
  }

  componentWillMount() {
    console.log("app will mount")
  }

  componentDidMount() {
    this.socket.onopen = function() {
      console.log("connected to server");
    }
    this.socket.onmessage = (message) => {
      this.postMessage(JSON.parse(message.data));
    }
  }



  handleChatBar (messageObject) {
    if (!messageObject.username) {
      messageObject.username = "Anonymous";
    }
    this.socket.send(JSON.stringify(messageObject));
  }

  render() {

    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
        </nav>

          <MessageList messageData={this.state.data.messages}></MessageList>

        <Chatbar currentUser={this.state.data.currentUser.name} onEnter={this.handleChatBar}></Chatbar>
      </div>
    );
  }
}
export default App;

