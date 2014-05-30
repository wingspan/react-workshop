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

        pendingState: function () {
            return this._pendingState || this.state;
        },

        componentWillMount: function () {
            window.App = this;
        },

        render: function () {
            var cursor = Cursor.build(this.state, this.pendingState, this.setState.bind(this), util.deepClone);
            var counts = cursor.refine('counts');

            var fun = counts.value.map(function (count, index) {
                return (<Clicker key={index} cursor={counts.refine(index)} />);
            }.bind(this));
            return (
                <div className="App">
                  <div className="MasterDetailDemo">{fun}</div>
                  <JsonEditor targetCursor={cursor} />
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

        onInputChange: function (e) {
            this.props.cursor.onChange(parseInt(e.target.value, 10));
        },

        inc2: function () {
            this.props.cursor.onChange(this.props.cursor.pendingValue() + 1);
            this.props.cursor.onChange(this.props.cursor.pendingValue() + 1);
        },

        inc10: function () {
            this.props.cursor.onChange(this.props.cursor.pendingValue() + 10);
        },

        shouldComponentUpdate: function (nextProps) {
            //return true;
            return this.props.cursor.value !== nextProps.cursor.value;
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