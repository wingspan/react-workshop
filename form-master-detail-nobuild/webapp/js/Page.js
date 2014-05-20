/** @jsx React.DOM */
define([
    'underscore', 'react', 'jquery', 'wingspan-forms', 'wingspan-cursor', 'wingspan-contrib', 'react-json-editor',
    'util',
    'text!textassets/types/Contact.json',
    'text!textassets/contacts.json'
], function (_, React, $, Forms, Cursor, Contrib, JsonEditor,
             util, ContactModel, contacts) {
    'use strict';

    var ContactModel = JSON.parse(ContactModel).data;
    var contacts = JSON.parse(contacts).data;


    var App = React.createClass({
        getInitialState: function () {
            return {
                MasterDetail: {
                    database: contacts,
                    form: contacts[0]
                }
            };
        },

        render: function () {
            var cursor = Cursor.build(this.state, this.setState.bind(this), util.deepClone);

            window.App = this;

            return (
                <div className="App">
                    <MasterDetail
                        metadata={ContactModel.properties}
                        cursor={cursor.refine('MasterDetail')} />
                    <pre>{JSON.stringify(cursor.value, undefined, 2)}</pre>
                </div>
            );
        }
    });

    var MasterDetail = React.createClass({
        getDefaultProps: function () {
            return {
                metadata: undefined,
                cursor: undefined // database and form
            };
        },
        render: function () {
            var databaseCursor = this.props.cursor.refine('database');
            var formCursor = this.props.cursor.refine('form')
            var allRecords = _.map(databaseCursor.value, function (record) {

                var onClick = _.partial(formCursor.onChange, record);

                return (
                    <li>
                        <a href="javascript:void(0)" onClick={onClick}>{record.lastName}</a>
                    </li>
                );
            });
            return (
                <div>
                    <ol>{allRecords}</ol>
                    <AutoForm
                        metadata={ContactModel.properties}
                        cursor={formCursor} />
                    <button onClick={this.onSave} />
                </div>
            );
        },
        onSave: function () {
            var form = this.props.cursor.refine('form').value;
            var database = this.props.cursor.refine('database').value;

            var record = _.findWhere(database, { id: form.id });
            var newRecord = Contrib.merge(record, { revision: record.revision + 1 });
            var nextDatabase = util.differenceDeep(database, [record]);
            nextDatabase = util.unionDeep(nextDatabase, [newRecord]);

            this.props.cursor.onChange({
                form: newRecord,
                database: nextDatabase
            });
        }
    });


    var AutoForm = React.createClass({
        getDefaultProps: function () {
            return {
                cursor: undefined,
                metadata: undefined
            };
        },
        render: function () {
            var controls = _.map(this.props.metadata, function (fieldInfo) {
                var cursor = this.props.cursor.refine(fieldInfo.name);
                return (
                    <AutoField
                        value={cursor.value}
                        onChange={cursor.onChange}
                        fieldInfo={fieldInfo}
                        key={fieldInfo.name} />);
            }.bind(this));
            return (
                <div>{controls}</div>
            );
        }
    });




    var AutoField = Forms.AutoField;

    window.Cursor = Cursor;
    window.util = util;



    function entrypoint(rootEl) {
        React.renderComponent(<App/>, rootEl);
    }

    return {
        entrypoint: entrypoint
    };
});