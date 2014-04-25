/* ************************************************************************

   Copyrigtht: OETIKER+PARTNER AG
   License:    GPL
   Authors:    Tobias Oetiker
               Fritz Zaucker

   Utf8Check:  äöü

   $Id: ViewRecord.js 1 2013-01-26 20:20:52Z zaucker $

************************************************************************ */

/* ************************************************************************
#asset(qx/icon/${qx.icontheme}/16/apps/utilities-text-editor.png)
#asset(qx/icon/${qx.icontheme}/16/actions/dialog-cancel.png)
************************************************************************ */

/**
 * Popup window for editing a database record.
 */
qx.Class.define("dbtoria.module.database.ViewRecord", {
    extend : dbtoria.module.database.AbstractRecord,

    construct : function(tableId, tableName) {
        this.base(arguments);

        this.set(
            {
                icon    : 'icon/16/apps/utilities-text-editor.png',
                caption : this.tr(
                'Edit record : %1', tableName)
            }
        );
    },

    events: {
        "saveRecord" : "qx.event.type.Data",
        "navigation"  : "qx.event.type.Data",
        "refresh"     : "qx.event.type.Data"
    },

    members : {
        cancel: function() {
            this.close();
        },

        _createActions: function() {
            var btnCnl = new dbtoria.ui.form.Button(
                this.tr("Cancel"),
                "icon/16/actions/dialog-cancel.png",
                this.tr('Abort editing without saving')
            );
            btnCnl.addListener(
                "execute",
                this.cancel,
                this
            );

            var btnRow = new qx.ui.container.Composite(
                new qx.ui.layout.HBox(5)
            );
            btnRow.add(btnCnl);
            return btnRow;
        },

        /* TODO
         *
         * @param record {var} TODO
         * @return {void}
         */
        viewRecord : function(recordId) {
            this.debug("viewRecord(): recordId="+recordId);
            this.__setFormData(recordId, 'edit');
            this.setCaption("View record: "+this.__tableName);
            if (!this.isVisible()) {
                this.open();
            }
        }

    }
});
