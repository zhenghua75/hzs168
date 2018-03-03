"use strict";

var App = React.createClass({
  displayName: 'App',

  render: function render() {
    return React.createElement('div', { className: 'app' });
  }
});

var Page = React.createClass({
  displayName: 'Page',

  render: function render() {
    return React.createElement(
      'div',
      { 'data-role': 'page' },
      React.createElement(Header, null),
      React.createElement(Main, null),
      React.createElement(Footer, null)
    );
  }
});

var Header = React.createClass({
  displayName: 'Header',

  render: function render() {
    return React.createElement(
      'div',
      { 'data-role': 'header' },
      'header'
    );
  }
});

var Main = React.createClass({
  displayName: 'Main',

  render: function render() {
    return React.createElement(
      'div',
      { 'data-role': 'main' },
      'main'
    );
  }
});

var Footer = React.createClass({
  displayName: 'Footer',

  render: (function (_render) {
    function render() {
      return _render.apply(this, arguments);
    }

    render.toString = function () {
      return _render.toString();
    };

    return render;
  })(function () {
    render(React.createElement(
      'div',
      { 'data-role': 'footer' },
      'footer'
    ));
  })
});

React.render(React.createElement(App, null), document.getElementById('content'));