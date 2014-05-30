/** @jsx React.DOM */
define([
    'underscore', 'react', 'jquery', 'wingspan-forms', 'ReactCursor', 'wingspan-contrib', 'react-json-editor',
    'CustomBatchingStrategy',
    'util',
    'text!textassets/types/Contact.json',
    'text!textassets/contacts.json'
], function (_, React, $, Forms, Cursor, Contrib, JsonEditor,
             CustomBatchingStrategy,
             util, ContactModel, contacts) {
    'use strict';

    var App = React.createClass({
        getInitialState: function () {
            return { counts: _.range(100).map(function () { return 0; }) };
        },

        componentWillMount: function () {
            window.App = this;
        },

        render: function () {
            var cursor = Cursor.build(this.state, this.setState.bind(this), util.deepClone);
            var counts = cursor.refine('counts');

            var fun = counts.value.map(function (count, index) {
                return (<Clicker key={index} cursor={counts.refine(index)} />);
            }.bind(this));
            return (
                <div>
                    {fun}
                </div>
            );
        }
    });

    var KendoText = Forms.KendoText;

    var Clicker = React.createClass({
        render: function () {
            return (
                <div>
                    <input type="text" value={this.props.cursor.value} onChange={this.onInputChange} />
                    <span>{this.props.cursor.value}</span>
                    <button onClick={this.inc2}>+2</button>
                    <button onClick={this.inc10}>+10</button>
                </div>
            );
        },

        componentWillMount: function () {
            this.cursor = this.props.cursor;
        },

        componentWillUpdate: function (nextProps) {
            this.cursor = nextProps.cursor;
        },

        onInputChange: function (e) {
            this.cursor = this.cursor.onChange(parseInt(e.target.value, 10));
        },

        inc2: function () {
            this.cursor = this.cursor.onChange(this.cursor.value + 1);
            this.cursor = this.cursor.onChange(this.cursor.value + 1);
        },

        inc10: function () {
            this.cursor = this.cursor.onChange(this.cursor.value + 10);
        },

        shouldComponentUpdate: function (nextProps) {
            return true;
            //this.props.cursor.value !== nextProps.cursor.value;
        }
    });



    function entrypoint(rootEl) {
        React.ReactUpdates.injection.injectBatchingStrategy(CustomBatchingStrategy);
        React.renderComponent(<App />, rootEl);

        function tick() {
            React.ReactUpdates.flushBatchedUpdates();
            setTimeout(tick, 1000);
        }

        tick();
    }

    return {
        entrypoint: entrypoint
    };
});