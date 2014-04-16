/* ************************************************************************

   Copyrigtht: OETIKER+PARTNER AG
   License:    GPL
   Authors:    Tobias Oetiker
   Utf8Check:  äöü

************************************************************************ */

/**
 * An {@link qx.ui.table.model.Remote} implementation for accessing
 * data on the server.
 */
qx.Class.define('dbtoria.data.RemoteTableModel', {
    extend : qx.ui.table.model.Remote,

    /**
     * Create an instance of Rpc.
     */
    construct : function(tableId,columnIdList,columnLabelMap, columnReferences) {
        this.__tableId = tableId;
        this.setTableId(tableId);
        this.__columnIdList = columnIdList;
        if (columnReferences) {
	    this.setColumnReferences(columnReferences);
	}
        this.base(arguments);
        this.setColumnIds(columnIdList);
        if (columnLabelMap){
            this.setColumnNamesById(columnLabelMap);
        }
        this.__filterOp = this.__getBestFilterOp();
        this.__rpc = dbtoria.data.Rpc.getInstance();
    },

    properties : {
        searchString : {
            init     : null,
            apply    : '_applySearchString',
            nullable : true,
            check    : "String"
        },

        filter : {
            nullable : true,
            apply    : '_applyFilter'
        },

        tableId : {
            nullable : true,
            check    : "String"
        },

	columnReferences : {
	    nullable: true
	}

    },

    members : {
        __rpc: null,
        __filterType: null,
        __tableId: null,
        __columnIdList: null,

        /**
         * Provide our implementation to make remote table work
         */
       _loadRowCount : function() {
            var that = this;
            var filter = this.getFilter();
            this.debug('table=', this.__tableId);
//            this.debug('filter=', filter);
            this.__rpc.callAsync(function(ret,exc) {
//                that.debug('getRowCount() returned', ret);
                if (exc) {
                    dbtoria.ui.dialog.MsgBox.getInstance().exc(exc);
                    ret = 0;
                }
                that._onRowCountLoaded(ret);
            }, 'getRowCount', this.__tableId, filter);
        },
        __getBestFilterOp: function(){
            var gotILIKE = false;
            var ops = dbtoria.data.Config.getInstance().getFilterOps();
            ops.map(function(filter){
                if (filter.op == 'ILIKE'){
                    gotILIKE = true;
                }
            });
            return gotILIKE ? 'ILIKE' : 'LIKE';
        },
        _applySearchString: function (newString,oldString){
            if (oldString == newString){
                return;
            }
            var filter = [];

            filter.push({
                field: String(this.__columnIdList[1]),
                op: this.__filterOp,
                value1: '%' + newString + '%'
            });
            this.setFilter(filter);
        },


        /**
         * Reload the table data when the tagId changes.
         *
         * @param newValue {Integer} New TagId
         * @param oldValue {Integer} Old TagId
         */
        _applyFilter : function(newValue, oldValue) {
//            this.debug('_applyFilter(): calling reloadData()');
            this.reloadData();
        },


        /**
         * Provide our own implementation of the row data loader.
         *
         * @param firstRow {Integer} first row to load
         * @param lastRow {Integer} last row to load
         */
        _loadRowData : function(firstRow, lastRow) {
//            this.debug('_loadRowData(): first=', firstRow, ', last=', lastRow);

            var rpcArgs = {
                filter   : this.getFilter()
            };

            if (!this.isSortAscending()) {
                rpcArgs.sortDesc = true;
            }

            var sc = this.getSortColumnIndex();

            if (sc >= 0) {
                rpcArgs.sortColumn = this.getColumnId(sc);
            }
            var filter = this.getFilter();
            if (filter){
                rpcArgs.filter = filter;
            }
            var that = this;
            this.__rpc.callAsync(function(ret,exc) {
                if (exc){
                    dbtoria.ui.dialog.MsgBox.getInstance().exc(exc);
                    ret = [];
                }
                var data = [];
                var col = that.__columnIdList;
                for (var i=0;i<ret.length;i++){
                    var row = {};
                    row.ROWINFO = ret[i][0];
                    for (var r=0;r<col.length;r++){
                        row[col[r]] = ret[i][r+1];
                    }
                    data.push(row);
                }
                that._onRowDataLoaded(data);
            },
            'getTableDataChunk', this.__tableId,firstRow,lastRow,this.__columnIdList,rpcArgs);
        }
    }
});
