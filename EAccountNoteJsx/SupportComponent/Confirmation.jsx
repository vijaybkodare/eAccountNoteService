var Confirmation = React.createClass({
    render: function() {
        return (
            <div ref={function(node){this.Confirm = node;}.bind(this)} 
                className="panel panel-EAccNoteThrd"
                style={{display:"none",position:"fixed",top:"50%",left:"50%",marginTop:-75,marginLeft:-150,width:300,zIndex:100}}>
                <div className="panel-heading">
                    Confirmation
                </div>
                <div className="panel-body">
                    <span ref={function(node){this.Message = node;}.bind(this)}></span>
                </div>
                <div className="panel-footer" style={{textAlign:"right"}}>
                    <button className="btn btn-primary" onClick={this.yesConfirm}>Yes</button>&nbsp;
                    <button className="btn btn-danger" onClick={this.notConfirm}>No</button>
                </div>
            </div>
      );
    },
    show: function(msg, actionOnConfirm, actionOnNo){
        this.Confirm.style.display = "block";
        this.Message.innerText = msg; 
        this.actionOnConfirm = actionOnConfirm;
        this.actionOnNo = actionOnNo;
    },
    notConfirm: function(){
        if(this.actionOnNo != null)
            this.actionOnNo();
        this.hide();
    },
    yesConfirm: function(){
        if(this.actionOnConfirm != null)
            this.actionOnConfirm();
        this.hide();
    },
    hide: function(){
        this.Confirm.style.display = "none";
    }
});
