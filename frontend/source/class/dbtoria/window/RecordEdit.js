/* ************************************************************************

   Copyrigtht: OETIKER+PARTNER AG
   License:    GPL
   Authors:    Tobias Oetiker
   Utf8Check:  äöü

   $Id: AdminEditor.js 333 2010-10-05 20:07:53Z oetiker $

************************************************************************ */

/* ************************************************************************
#asset(qx/icon/${qx.icontheme}/16/apps/utilities-text-editor.png)
#asset(qx/icon/${qx.icontheme}/16/actions/dialog-apply.png)
#asset(qx/icon/${qx.icontheme}/16/actions/dialog-cancel.png)
************************************************************************ */

// FIX ME:
//   - documentation
//   - SVN ID

/**
 * Login Popup that performs authentication.
 */
 //?! Shouldn't it be 'Login Popo to edit new ebtry'? :m) 
qx.Class.define("dbtoria.window.RecordEdit", {
    extend : qx.ui.window.Window,

    construct : function(tableId, recordId, title) {
        this.base(arguments, title, 'icon/16/apps/utilities-text-editor.png');
        var grid = new qx.ui.layout.Grid(5, 5);

        this.set({
            showMinimize         : true,
            contentPaddingLeft   : 20,
            contentPaddingRight  : 20,
            contentPaddingTop    : 10,
            contentPaddingBottom : 10,
            layout               : grid,
            width                : 400,
            height               : 300
        });

        this.getLayout().setColumnFlex(0, 1);
        this.getLayout().setRowFlex(1, 1);
        var rpc = dbtoria.communication.Rpc.getInstance();
        rpc.callAsyncSmart(qx.lang.Function.bind(this._fillForm, this), 'getForm', tableId, recordId);
        dbtoria.window.Desktop.getInstance().add(this);
        this.moveTo(300, 40);
        this.open();

        // on clicking the minimize button a new button on the taskbar is
        // generated which allows to restore the window again
        this.addListener("minimize", function(e) {
            var taskbarButton = new qx.ui.toolbar.Button(title, "icon/16/mimetypes/text-plain.png");
            var tb = dbtoria.window.Taskbar.getInstance();
            tb.add(taskbarButton);
            taskbarButton.addListener("execute", function(e) {
                this.open();
                tb.remove(taskbarButton);
            },
            this);
        },
        this);

        var btnCnl = new qx.ui.form.Button(this.tr("Cancel"), "icon/16/actions/dialog-cancel.png").set({
            allowGrowX : false,
            alignX     : 'right',
            allowGrowY : false,
            alignY     : 'bottom'
        });

        btnCnl.addListener("execute", function(e) {
            this.close();
            this.destroy();
        },
        this);

        this.add(btnCnl, {
            row    : 1,
            column : 0
        });

        var btnApp = new qx.ui.form.Button(this.tr("Apply"), "icon/16/actions/dialog-apply.png").set({
            allowGrowX : false,
            allowGrowY : false,
            alignY     : 'bottom',
            marginTop  : 20
        });

        btnApp.addListener("execute", function(e) {
            if (this.__form.validate()){
                var that = this;

                rpc.callAsyncSmart(function(id) {
                    that.close();
                    that.destroy();
                },
                'insertTableData', tableId,  this.__formModel);
            }
           
            else {
                var msg = dbtoria.dialog.MsgBox.getInstance();
                msg.error(this.tr("Form Invalid"), this.tr('Make sure all your form input is valid. The invalid entries have been marked in red. Move the mouse over the marked entry to get more information about the problem.'));
            }
        },
        this);

        this.add(btnApp, {
            row    : 1,
            column : 1
        });
    },

    members : {
        __formModel : null,
        __form: null,
        /**
         * TODOC
         *
         * @param rules {var} TODOC
         * @return {void}
         */
        _fillForm : function(rules) {
            var form = new dbtoria.ui.form.AutoForm(rules);
            this.__formModel = form.getModel();
            var formControl = new dbtoria.ui.form.renderer.Monster(form);

            this.add(formControl, {
                row     : 0,
                column  : 0,
                colSpan : 2
            });
            this.__form = form;
        }
    }
});
