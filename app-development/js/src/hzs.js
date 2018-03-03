"use strict";

var App = React.createClass({
  render:function(){
    return (<div className='app'></div>);
  }
});

var Page = React.createClass({
  render:function(){
    return(<div data-role='page'>
        <Header/>
        <Main/>
        <Footer/>
      </div>);
  }
});

var Header = React.createClass({
  render:function(){
    return(<div data-role='header'>header</div>);
  }
});

var Main = React.createClass({
  render:function(){
    return(<div data-role='main'>main</div>);
  }
});

var Footer = React.createClass({
  render:function(){
    render(<div data-role='footer'>footer</div>);
  }
});

React.render(<App />,document.getElementById('content'));