var HelloWorld = React.createClass({
    render: function() {
        return (
            <div className="panel-success">
                <div className="panel-heading">
                    My Panel
                </div>
                <div className="panel-body">
                    
                </div>
                <div className="panel-footer">
                    <button className="btn btn-primary">Hello</button>
                </div>
            </div>
      );
    }
});

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('content')
);
