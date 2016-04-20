///<reference path="../../services/security/ErrorService.ts" />
///<reference path="../../services/security/DataService.ts" />
///<reference path="../../services/security/TranslateService.ts" />
'use strict';
var monitor;
(function (monitor) {
    var controllers;
    (function (controllers) {
        var RegistrationCtrl = (function () {
            function RegistrationCtrl(errorService, dataService, translate, $http, $location) {
                var _this = this;
                this.errorService = errorService;
                this.dataService = dataService;
                this.translate = translate;
                this.$http = $http;
                this.$location = $location;
                this.PROFILE = 'saferesources/profile';
                this.UPDATE_PROFILE = 'saferesources/updateProfile';
                this.ADD_USER = 'resources/addUser';
                this.USER_FIELDS = 'resources/getUserFields';
                this.createTable = false;
                this.isProfile = $location.path() !== '/registration';
                if (this.isProfile) {
                    $http.get(this.PROFILE)
                        .success(function (data) {
                        delete data.password;
                        _this.newUser = data;
                        _this.newUser.password1 = '';
                        _this.newUser.password2 = '';
                        _this.setCustomFildsProfile(data);
                    });
                }
                else {
                    $http.get(this.USER_FIELDS)
                        .success(function (data) {
                        _this.newUser = data.length > 0 ?
                            data : new Object(null);
                        _this.newUser.password2 = '';
                        _this.createTable =
                            typeof (data) === 'object' ? false : true;
                        if (!_this.createTable) {
                            _this.setCustomFildsProfile(data);
                        }
                    });
                }
                this.translateUpdate();
            }
            RegistrationCtrl.prototype.submit = function () {
                var _this = this;
                var u = this.newUser;
                var customFields = $('#customFields > div');
                var cp = [];
                customFields.each(function (id, cf) {
                    var inputs = $(cf).find('input');
                    var select = $(cf).find('select');
                    var name = inputs[0];
                    var value = inputs.length > 1 ? inputs[1] : select[0];
                    var type = inputs.length > 1 ? select[0] : select[1];
                    var val = value.value;
                    if (type.value === 'Timestamp') {
                        val = _this.date2timestamp(value.value);
                    }
                    if (name.value.length > 0) {
                        cp.push({
                            name: name.value,
                            value: val,
                            type: type.value
                        });
                    }
                });
                if (cp.length > 0)
                    u.customFields = cp;
                if (!this.createTable) {
                    cp.forEach(function (p) {
                        if (p.type === 'String') {
                            u[p.name] = p.value;
                        }
                        else if (p.type === 'Boolean') {
                            u[p.name] = p.value.toLowerCase() === 'true';
                        }
                        else {
                            u[p.name] = +p.value;
                        }
                    });
                    delete u.customFields;
                }
                if (!u.password1)
                    u.password1 = '';
                if (!u.password2)
                    u.password2 = '';
                if (this.isProfile) {
                    if (u.password1 !== u.password2) {
                        this.errorService.setError('Different passwords');
                        return;
                    }
                }
                else {
                    if (u.password !== u.password2) {
                        this.errorService.setError('Different passwords');
                        return;
                    }
                }
                delete u.password2;
                if (this.isProfile) {
                    this.updateUser();
                }
                else {
                    delete u.password1;
                    this.addUser();
                }
            };
            RegistrationCtrl.prototype.addUser = function () {
                var _this = this;
                this.$http.put(this.ADD_USER, this.newUser)
                    .success(function (data) {
                    console.log(data);
                    if (data.result === 'ok') {
                        _this.$location.path('/securityTest');
                    }
                    else {
                        _this.errorService.setError('keyBadAuthentication');
                    }
                });
            };
            RegistrationCtrl.prototype.updateUser = function () {
                var _this = this;
                console.log('updateUser');
                console.log(this.newUser);
                this.$http.post(this.UPDATE_PROFILE, this.newUser)
                    .success(function (data) {
                    console.log(data);
                    if (data.result === 'ok') {
                        _this.$location.path('/securityTest');
                    }
                    else {
                        _this.errorService.setError(data.result);
                    }
                });
            };
            RegistrationCtrl.prototype.setCustomFildsProfile = function (user) {
                var uClone = JSON.parse(JSON.stringify(user));
                this.deleteKey(uClone, 'id');
                this.deleteKey(uClone, 'login');
                this.deleteKey(uClone, 'password');
                this.deleteKey(uClone, 'password1');
                this.deleteKey(uClone, 'password2');
                this.deleteKey(uClone, 'email');
                this.deleteKey(uClone, 'active');
                this.deleteKey(uClone, 'attempts');
                this.deleteKey(uClone, 'maxAttempts');
                this.deleteKey(uClone, 'maxattempts');
                this.deleteKey(uClone, 'lastmodified');
                for (var k in uClone) {
                    var v = uClone[k];
                    var type = 'String';
                    if (!isNaN(v)) {
                        type = 'Integer';
                        if ((v + '').indexOf('.') != -1) {
                            type = 'Double';
                            if (v == 0.123456789)
                                v = 0;
                        }
                        if (v > 2147483647) {
                            type = 'Timestamp';
                        }
                    }
                    if (typeof (v) === 'boolean')
                        type = 'Boolean';
                    if (v === '')
                        type = 'String';
                    this.addUserField({
                        name: k,
                        value: v,
                        type: type
                    });
                }
            };
            RegistrationCtrl.prototype.deleteKey = function (obj, key) {
                delete obj[key];
                delete obj[key.toUpperCase()];
            };
            RegistrationCtrl.prototype.translateUpdate = function () {
                this.translate.translateAllByLocale(this.dataService.language());
            };
            RegistrationCtrl.prototype.fullNumber = function (n) { return n < 10 ? '0' + n : n; };
            RegistrationCtrl.prototype.timestamp2date = function (dateValue, fullNumber) {
                fullNumber = fullNumber ?
                    fullNumber : this.fullNumber;
                var a = dateValue;
                var year = a.getFullYear();
                var month = fullNumber(a.getMonth() + 1);
                var date = fullNumber(a.getDate());
                var hour = fullNumber(a.getHours());
                var min = fullNumber(a.getMinutes());
                var sec = fullNumber(a.getSeconds());
                var S = a.getMilliseconds();
                var SSS = S < 10 ? '00' + S :
                    S < 100 ? '0' + S : S;
                var time = year + '-' + month + '-' + date +
                    ' ' + hour + ':' + min + ':' + sec + '.' + SSS;
                return time;
            };
            RegistrationCtrl.prototype.date2timestamp = function (d) {
                var y = d.slice(0, 4);
                var m = d.slice(5, 7);
                var dd = d.slice(8, 10);
                var h = d.slice(11, 13);
                var M = d.slice(14, 16);
                var s = d.slice(17, 19);
                var S = d.slice(20, 23);
                return new Date(+y, +m, +dd, +h, +M, +s, +S);
            };
            RegistrationCtrl.prototype.addUserField = function (f) {
                var fullNumber = this.fullNumber;
                var timestamp2date = this.timestamp2date;
                var div = $('#customFields');
                var field = document.createElement('div');
                var nameField = document.createElement('div');
                var valueField = document.createElement('div');
                var typeField = document.createElement('div');
                var name = document.createElement('input');
                var value = document.createElement('input');
                var choose = document.createElement('select');
                var chTrue = document.createElement('option');
                var chFalse = document.createElement('option');
                var type = document.createElement('select');
                var oString = document.createElement('option');
                var oBoolean = document.createElement('option');
                var oInteger = document.createElement('option');
                var oDouble = document.createElement('option');
                var oTimestamp = document.createElement('option');
                field.className = 'col-xs-12';
                field.style.padding = '0';
                nameField.className = 'col-xs-4';
                nameField.style.padding = '0';
                nameField.style.paddingRight = '10px';
                valueField.className = 'col-xs-4';
                valueField.style.padding = '0';
                valueField.style.paddingRight = '10px';
                typeField.className = 'col-xs-4';
                typeField.style.padding = '0';
                name.className = 'form-control';
                name.style.marginBottom = '15px';
                name.setAttribute('placeholder', 'name');
                value.className = 'form-control';
                value.setAttribute('placeholder', 'value');
                choose.className = 'form-control';
                chTrue.appendChild(document.createTextNode('TRUE'));
                chFalse.appendChild(document.createTextNode('FALSE'));
                choose.appendChild(chTrue);
                choose.appendChild(chFalse);
                type.className = 'form-control';
                oString.setAttribute('value', 'String');
                oString.appendChild(document.createTextNode('String'));
                type.appendChild(oString);
                oInteger.setAttribute('value', 'Integer');
                oInteger.appendChild(document.createTextNode('Integer'));
                type.appendChild(oInteger);
                oDouble.setAttribute('value', 'Double');
                oDouble.appendChild(document.createTextNode('Double'));
                type.appendChild(oDouble);
                oBoolean.setAttribute('value', 'Boolean');
                oBoolean.appendChild(document.createTextNode('Boolean'));
                type.appendChild(oBoolean);
                oTimestamp.setAttribute('value', 'Timestamp');
                oTimestamp.appendChild(document.createTextNode('Timestamp'));
                type.appendChild(oTimestamp);
                typeField.appendChild(type);
                nameField.appendChild(name);
                valueField.appendChild(value);
                field.appendChild(nameField);
                field.appendChild(valueField);
                field.appendChild(typeField);
                div.append(field);
                if (f) {
                    name.value = f.name;
                    value.value = f.value;
                    type.value = f.type;
                    type.disabled = true;
                    name.readOnly = true;
                    onTypeChange();
                    if (typeof (f.value) === 'boolean') {
                        choose.value = ('' + f.value).toUpperCase();
                    }
                }
                function onTypeChange() {
                    if (type.value === 'Boolean') {
                        valueField.removeChild(value);
                        valueField.appendChild(choose);
                    }
                    else {
                        if (choose.parentNode == valueField) {
                            valueField.removeChild(choose);
                            valueField.appendChild(value);
                        }
                        if (!isNaN(+value.value)) {
                            if (type.value === 'Timestamp') {
                                var val = +value.value;
                                val = val == 0 ? new Date().getTime() : val;
                                value.value =
                                    timestamp2date(new Date(val), fullNumber);
                                value.pattern = '(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))\\s(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}.[0-9]{1}[0-9]{1}[0-9]{1}';
                            }
                        }
                        if (type.value === 'Integer')
                            value.type = 'number';
                        if (type.value === 'Double') {
                            value.type = 'number';
                            value.step = '0.001';
                        }
                    }
                }
                type.addEventListener('change', onTypeChange);
            };
            return RegistrationCtrl;
        }());
        controllers.RegistrationCtrl = RegistrationCtrl;
    })(controllers = monitor.controllers || (monitor.controllers = {}));
})(monitor || (monitor = {}));
