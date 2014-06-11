/** @jsx React.DOM */
define(['underscore', 'react', 'wingspan-forms', 'text!./fieldInfos.json', 'Cursor'],
function (_, React, Forms, fieldInfosJson, Cursor) {
    'use strict';

    var KendoText = Forms.KendoText;
    var KendoComboBox = Forms.KendoComboBox;
    var FormField = Forms.FormField;
    var AutoControl = Forms.AutoControl;
    var fieldInfos = JSON.parse(fieldInfosJson);

    var PrettyJson = React.createClass({
        render: function () {
            return (
                <pre>{JSON.stringify(this.props.value, undefined, 2)}</pre>
            );
        }
    });

    var AutoField = React.createClass({
        render: function () {
            return (
                <FormField fieldInfo={this.props.fieldInfo} isValid={this.props.isValid}>
                    <AutoControl
                    value={this.props.value}
                    onChange={this.props.onChange}
                    fieldInfo={this.props.fieldInfo} />
                </FormField>
            );
        }
    });

    var Form = React.createClass({
        render: function () {
            var controls = _.map(fieldInfos, function (fieldInfo) {
                var fieldCursor = this.props.cursor.refine(fieldInfo.name);
                return (
                    <AutoField
                    fieldInfo={fieldInfo}
                    value={fieldCursor.value}
                    onChange={fieldCursor.onChange} />
                );
            }.bind(this));

            return (
                <div>
                    {controls}
                </div>
            );
        }
    });

    var App = React.createClass({
        componentWillMount: function () {
            window.app = this;
        },
        getInitialState: function () {
            return {
                form: { firstName: '', lastName: '', gender: '', age: null, birthday: null },
                list: [
                    { firstName: 'Alice', lastName: '', gender: '', age: null, birthday: null },
                    { firstName: 'Bob', lastName: '', gender: '', age: null, birthday: null },
                    { firstName: 'Charlie', lastName: '', gender: '', age: null, birthday: null }
                ]
            }
        },
        componentDidUpdate: function(prevProps, prevState) {
            // compare prevState to this.state?
            // compare prevProps to this.props?
        },
        render: function () {
            var cursor = Cursor.build(this.state, this.setState.bind(this));
            var list = _.map(this.state.list, function (record) {
                return (
                    <li>
                        <button onClick={_.partial(cursor.refine('form').onChange, record)}>
                        {record.firstName}
                        </button>
                    </li>
                    );
            }.bind(this));
            return (
                <div className="App">
                    <ol>{list}</ol>
                    <Form cursor={cursor.refine('form')} />
                    <PrettyJson value={this.state} />
                </div>
            );
        },
        onChange: function (fieldName, fieldValue) {
            var nextState = {};
            nextState[fieldName] = fieldValue;
            this.setState(nextState);
        },
        isFieldValid: function (fieldName) {
            return !!this.state[fieldName] ? [true, ''] : [false, 'You must fill this in'];
        }
    });

    function entrypoint() {
        window.App = App;
        window.React = React;
        window.Cursor = Cursor;
        React.renderComponent(<App />, document.getElementById('root'));
        Forms.ControlCommon.attachFormTooltips($('body'));
    }

    return { entrypoint: entrypoint };
});