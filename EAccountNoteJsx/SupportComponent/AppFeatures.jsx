var AppFeatures = React.createClass({
    render: function() {
        return (
            <div className="alert alert-info"
                ref={function(node){this.Features = node;}.bind(this)}>
                eAccountNote
                <hr/>
                <ul style={{listStyleType:"square"}} className="primColor">
                    <li>This is your online Account Note, It is Free of Cost for managing your Persenol Accounts.</li>
                    <li>It is very easy & flexible solution for managing your Financial Transactions.</li>
                    <li>You can create as many Account-Groups as you want.</li>
                    <li>You can manage as many Accounts as you want within an Account-Group.</li>
                    <li>A real time Notification SMS is send to the Account owner under transaction entry.</li>
                    <li>A Notification SMS can be send on a Outstanding Balance to the Account user.</li>
                    <li>An Account level profile setting is given to Start or Stop the Notification SMS.</li>
                    <li>This is a conveniant solution to manage Financial Transaction among Group Users.</li>
                </ul>
            </div>
        );
    },
    show: function(){
        this.Features.style.display = "block";
    },
    hide: function(){
        this.Features.style.display = "none";
    }
});    
