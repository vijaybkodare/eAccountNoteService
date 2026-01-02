var Alert = React.createClass({
    render: function() {
        return (
            <div ref={function(node){this.Alert = node;}.bind(this)} 
                style={{display:"none",position:"fixed",top:3,left:"50%",marginLeft:-150,width:300,zIndex:100}}>
            </div>
      );
    },
    showInfo: function(msg, timeSpan){
        if(timeSpan == null)
            timeSpan = 2000;
        this.Alert.style.display = "block";
        this.Alert.className  = "alert alert-info text-center";
        this.Alert.innerText = msg; 
        setTimeout(function(){
            this.hide();
        }.bind(this),timeSpan);
    },
    showWarning: function(msg, timeSpan){
        if(timeSpan == null)
            timeSpan = 2000;
        this.Alert.style.display = "block";
        this.Alert.className  = "alert alert-danger text-center";
        this.Alert.innerText = msg; 
        setTimeout(function(){
            this.hide();
        }.bind(this),timeSpan);
    },
    hide: function(){
        this.Alert.style.display = "none";
    }
});    
