
var CommentsBox = React.createClass({displayName: "CommentsBox",

  getInitialState: function(){
  
    return {data: []};
  },
  
  componentDidMount: function(){
  
    this.setState({data:this.props.data});
  },

  submitCommentHandler: function(name, text){ //the example uses a json object here as param
    
    var newData = this.state.data.concat({author:name, text:text});
    this.setState({data:newData}); //optimistic update
    
    console.log("Yawwn! Will submit later. Go away.");
    
    //how does the example code remove the new comment from state on failure of submitting?
  
  },
  
  render: function(){
  
    return(
      React.createElement("div", null, 
        React.createElement("h1", null, "Comments Box!"), 
        React.createElement(CommentsList, {data: this.state.data}), 
        React.createElement(CommentForm, {submitComment: this.submitCommentHandler})
      )
    );
    
  }

});

var CommentsList = React.createClass({displayName: "CommentsList",
  
  render: function(){
  
    var i=0; //used to fill alternate <Comment/> with color
  
    var comments = this.props.data.map( function(comment){
          
          i++;
          
          return(
            React.createElement(Comment, {fill: i%2, author: comment.author}, comment.text)
          );
    });
  
    return(

      React.createElement("div", null, 
        comments
      )
    );
  }

});

var Comment = React.createClass({displayName: "Comment",
  
  render: function(){
    
    //name and text should be seperate elements so I can style them seperately
    //and I have to add a profile picture aswell
    
    var cssClasses = "comment";
    
    if(this.props.fill){
      
      cssClasses += " fillcomment";
    }
    
    return(
      React.createElement("div", {className: cssClasses}, 
        React.createElement("p", null, this.props.author, ":"), React.createElement("p", null, this.props.children)
      ) 
    );
  }

});

var CommentForm = React.createClass({displayName: "CommentForm",

  getInitialState: function(){
    
    return {cantSubmit: false};
  },

  handleSubmit: function(e){
  
    e.preventDefault();
    
    var name = this.refs.name.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    
    if(!name || !text){
      
      //unhide a error text in the form to show this error to user
      //this.refs.errorText.className = "errortext";//getDOMNode().style.visibility = "visible";
      this.setState({cantSubmit: true});
      
      return;
    
    }/*else{
    
      this.refs.errorText.getDOMNode().style.removeProperty("visibility"); //I shouldn't need to do this
    }*/
    //this.forceUpdate(); //not the best way to do this
    this.setState({cantSubmit: false}); //will there be a performance hit if cantSubmit was false before this also?
    
    
    //send name and text to callback of parent so it can send to server
    this.props.submitComment(name,text);
    
    //user's commnet should be highlighted when it is shown. but that is supposed to be done elsewhere
    
    this.refs.name.getDOMNode().value = "";
    this.refs.text.getDOMNode().value = "";
  },
  
  render: function(){
  
    return(
      React.createElement("div", null, 
        React.createElement("form", {onSubmit: this.handleSubmit}, 
          React.createElement("input", {type: "text", placeholder: "Your name", ref: "name"}), 
          React.createElement("input", {type: "text", placeholder: "Say something...", ref: "text"}), 
          React.createElement("input", {type: "submit", value: "Post"})
        ), 
        React.createElement("p", {className: this.state.cantSubmit ? "errortext":"errortexthidden", ref: "errorText"}, "Name or comment field cannot be empty")
      )
    );
  }

});



var json = [{author:"Jak", text:"This is a comment"},
{author:"Jill", text:"This is the comment"},
{author: "third commenter", text:"3 comments work too!"}];


React.render(
  React.createElement(CommentsBox, {data: json}),
  document.getElementById("comment-system")
);
