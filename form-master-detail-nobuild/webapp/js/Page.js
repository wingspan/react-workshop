/** @jsx React.DOM */
define(['underscore', 'react'],
function (_, React) {
    'use strict';



    var Hello = React.createClass({
        render: function() {
            return (
                <div>Hello {this.props.name}</div>
                );
        }
    });

    function entrypoint() {
        React.renderComponent(<Hello name="World" />, document.getElementById('root'));
    }

    return { entrypoint: entrypoint };
});
