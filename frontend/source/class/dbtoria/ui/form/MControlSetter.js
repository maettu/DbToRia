/* ************************************************************************
   Copyright: 2009 OETIKER+PARTNER AG
   License:   GPLv3 or later
   Authors:   Tobi Oetiker <tobi@oetiker.ch>
              Fritz Zaucker <fritz.zaucker@oetiker.ch?
   Utf8Check: äöü
************************************************************************ */

qx.Mixin.define("dbtoria.ui.form.MControlSetter", {

    members : {
    /**
     * @param value {var}.
     *
     * Provide a default setter.
     *
     */
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
                this.setValue(String(value));
            }
        },

        clear: function() {
            this.setValue(null);
        }
    }

});
