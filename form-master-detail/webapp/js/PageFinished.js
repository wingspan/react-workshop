/** @jsx React.DOM */
define([
    'underscore', 'react', 'jquery', 'wingspan-forms', 'Cursor', 'wingspan-contrib', 'react-json-editor',
    'CustomBatchingStrategy',
    'util',
    'text!textassets/types/Contact.json',
    'text!textassets/contacts.json'
], function (_, React, $, Forms, Cursor, Contrib, JsonEditor,
             CustomBatchingStrategy,
             util, ContactModel, contacts) {
    'use strict';

    var Root = React.createClass({
        render: function () {
            var fun = _.range(10).map(function () {
                return (<App />);
            });
            return (
                <div>
                    {fun}
                </div>
            );
        }
    });


    var App = React.createClass({
        getInitialState: function () {
            return {
                count: 0
            };
        },
        render: function() {
            console.log('App render');
            var cursor = Cursor.build(this.state, this.setState.bind(this), util.deepClone);
            return this.transferPropsTo(<Clicker cursor={cursor}/>);
        }
    });

    var Clicker = React.createClass({
        render: function () {
            console.log('Clicker render');
            return (
                <div>
                    <span>{this.props.cursor.refine('count').value()}</span>
                    <button onClick={this.inc2}>+2</button>
                    <button onClick={this.inc10}>+10</button>
                </div>
            );
        },

        inc2: function () {
            var countCursor = this.props.cursor.refine('count');
            countCursor.onChange(countCursor.value() + 1);
            countCursor.onChange(countCursor.value() + 1);
        },

        inc10: function () {
            var countCursor = this.props.cursor.refine('count');
            countCursor.onChange(countCursor.value() + 10);
        }
    });



    function entrypoint(rootEl) {
        React.ReactUpdates.injection.injectBatchingStrategy(CustomBatchingStrategy);
        React.renderComponent(<Root />, rootEl);

        function tick() {
            React.ReactUpdates.flushBatchedUpdates();
            setTimeout(tick, 5000);
        }

        tick();
    }

    return {
        entrypoint: entrypoint
    };
});