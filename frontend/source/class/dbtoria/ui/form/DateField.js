/* ************************************************************************
   Copyright: 2009 OETIKER+PARTNER AG
   License:   GPLv3 or later
   Authors:   Tobi Oetiker <tobi@oetiker.ch>
              Fritz Zaucker <fritz.zaucker@oetiker.ch?
   Utf8Check: äöü
************************************************************************ */

qx.Class.define("dbtoria.ui.form.DateField", {
    extend : qx.ui.form.DateField,
    include : [ dbtoria.ui.form.MControlProperties, dbtoria.ui.form.MControlReadOnly ],

    /**
     * Create a customized DateField.
     *
     */
    construct : function() {
        this.base(arguments);
        this.set({allowGrowX : false});
    },

    members : {

        defaults: function(value) {
            if (this.getValue() != null) {
                return;
            }
            this.setter(value);
        },

        setter: function(value) {
            if (value == null) {
                this.setValue(value);
            }
            else {
                this.setValue(new Date(value));
            }
        },

        clear: function() {
            this.setValue(null);
        },

        setFormDataCallback: function(name, callback) {
            this.addListener(
                'changeValue',
                function(e) {
                    var date = e.getData();
                    var value = this.__date2string(date);
                    callback(name, value);
                },
                this
            );
        },

        validator: function(value,control) {
            if (value == null && !control.getRequired()) {
                control.setValid(true);
                return true;
            }
            var msg = qx.locale.Manager.tr('This field must be a date.');
            var valid = qx.lang.Type.isDate(value);
            if (!valid){
                control.setInvalidMessage(msg);
                control.setValid(valid);
            }
            return valid;
        },

        __date2string: function(date) {
            if (date == null) {
                return date;
            }
            var y = date.getFullYear();
            var m = date.getMonth()+1;
            if (m<10) {
                m ='0'+m;
            }
            var d = date.getDate();
            if (d<10) {
                d ='0'+d;
            }
            return y+'-'+m+'-'+d;
        }
    }
});
