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

    var App = React.createClass({
        getInitialState: function () {
            return { counts: _.range(1000).map(function () { return ''+0; }) };
        },

        componentWillMount: function () {
            this.cursor = Cursor.build(this.state, this.setState.bind(this), util.deepClone);
        },

        render: function () {
            var fun = this.state.counts.map(function (count, index) {
                return (<Clicker key={index} cursor={this.cursor.refine('counts', index)} />);
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
                    <input type="text" value={this.props.cursor.value()} onChange={this.onInputChange} />
                    <span>{this.props.cursor.value()}</span>
                    <button onClick={this.inc2}>+2</button>
                    <button onClick={this.inc10}>+10</button>
                </div>
            );
        },

        onInputChange: function (e) {
            this.props.cursor.onChange(e.target.value);
        },

        inc2: function () {
            var countCursor = this.props.cursor;
            countCursor.onChange(countCursor.value() + 1);
            countCursor.onChange(countCursor.value() + 1);
        },

        inc10: function () {
            var countCursor = this.props.cursor;
            countCursor.onChange(countCursor.value() + 10);
        },

        shouldComponentUpdate: function (nextProps) {
            return this.props.cursor.value() != nextProps.cursor.value();
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