var OkMustReadInfo = React.createClass({
    render: function() {
        return (
            <div ref={function(node){this.Confirm = node;}.bind(this)} 
                className="panel panel-EAccNoteThrd"
                style={{display:"none",position:"fixed",top:"50%",left:"50%",marginTop:-75,marginLeft:-150,width:300,zIndex:100}}>
                <div className="panel-heading">
                    Info
                </div>
                <div className="panel-body">
                    <span ref={function(node){this.Message = node;}.bind(this)}></span>
                </div>
                <div className="panel-footer" style={{textAlign:"right"}}>
                    <button className="btn btn-primary" onClick={this.hide}>Ok</button>
                </div>
            </div>
      );
    },
    show: function(msg, actionOnOk){
        this.Confirm.style.display = "block";
        this.Message.innerText = msg; 
        this.actionOnOk = actionOnOk;
    },
    hide: function(){
        this.Confirm.style.display = "none";
        if(this.actionOnOk != null)
            this.actionOnOk();
    }
});    
