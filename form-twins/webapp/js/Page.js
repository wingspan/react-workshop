/** @jsx React.DOM */
define([
    'underscore', 'react', 'jquery', 'wingspan-forms', 'wingspan-cursor', 'wingspan-contrib',
    'util',
    'text!textassets/types/Contact.json',
    'text!textassets/contacts.json'
], function (_, React, $, Forms, Cursor, Contrib,
             util, ContactModel, contacts) {
    'use strict';

    var ContactModel = JSON.parse(ContactModel).data;
    var contacts = JSON.parse(contacts).data;


    var App = React.createClass({
        getInitialState: function () {
            return {
                forms: contacts
            };
        },
        render: function () {
            var cursor = Cursor.build(this.state, this.setState.bind(this), util.deepClone);
            return (
                <div className="App">
                    <FormTwins cursor={cursor.refine('forms')} metadata={ContactModel} />
                    <pre>{JSON.stringify(cursor.value, undefined, 2)}</pre>
                </div>
            );
        }
    });


    var FormTwins = React.createClass({
        getDefaultProps: function () {
            return {
                cursor: undefined,
                metadata: undefined
            };
        },
        render: function () {
            var forms = _.map(this.props.cursor.value, function (form, i) {
                return (
                    <div>
                        <AutoForm metadata={ContactModel} cursor={this.props.cursor.refine(i)} />
                        <AutoForm metadata={ContactModel} cursor={this.props.cursor.refine(i)} />
                    </div>
                );
            }.bind(this));

            return (<div className="FormTwins">{forms}</div>);
        },

        shouldComponentUpdate: function (nextProps, nextState) {
            return (
                !_.isEqual(_.omit(this.props, 'cursor'), _.omit(nextProps, 'cursor')) ||
                !_.isEqual(this.props.cursor.value, nextProps.cursor.value));
        }
    });


    var AutoForm = React.createClass({
        getDefaultProps: function () {
            return {
                metadata: undefined,
                cursor: undefined
            };
        },
        render: function () {
            var controls = _.map(this.props.metadata.properties, function (fieldInfo) {
                var fieldCursor = this.props.cursor.refine(fieldInfo.name);
                return (
                    <AutoField
                        fieldInfo={fieldInfo}
                        value={fieldCursor.value}
                        onChange={fieldCursor.onChange} />);
            }.bind(this));

            return (<div className="AutoForm">{controls}</div>);
        },

        shouldComponentUpdate: function (nextProps, nextState) {
            return (
                !_.isEqual(_.omit(this.props, 'cursor'), _.omit(nextProps, 'cursor')) ||
                !_.isEqual(this.props.cursor.value, nextProps.cursor.value));
        }
    });


    var AutoField = Forms.AutoField;


    function entrypoint(rootEl) {
        React.renderComponent(<App/>, rootEl);
    }

    return {
        entrypoint: entrypoint
    };
});