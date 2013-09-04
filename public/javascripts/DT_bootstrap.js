/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_ records per page"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( $.fn.DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}

var editor; 

/* Table initialization */
$(document).ready(function() {
	
	editor = new $.fn.dataTable.Editor( {
        "ajaxUrl": {
			"create": "POST /items",
			"edit": "PUT /items?id=_id_",
			"remove": "DELETE /items/_id_"
		},
        "domTable": "#items",
        "idSrc": "id",
        "fields": [ {
                "label": "Name:",
                "name": "name",
                "type": "text"
            }, {
                "label": "Description:",
                "name": "description",
                "type": "text"                	
            }, {
                "label": "Quantity:",
                "name": "quantity",
                "type": "text"
            }, {
                "label": "Unit:",
                "name": "unit",
                "type": "select",
                "ipOpts": [
							{ "label": "Units", "value": "U" },
							{ "label": "Gr",    "value": "Gr" },
							{ "label": "Kg",    "value": "Kg" },
							{ "label": "L",     "value": "L" }
						]
            }
        ],
        "events": {
			"onPreSubmit": function ( o ) {
				
				if (o.data.action == "create" || o.data.action == "edit") {
				
					if ( o.data.name === "" ) {
						this.error('name', 'A Name must be given');
						return false;
					}
					else if ( o.data.name.length >= 40 ) {
						this.error('name', 'The name value must be less that 40 characters');
						return false;
					}
	
					if ( o.data.description === "" ) {
						this.error('description', 'A description must be given');
						return false;
					}
					else if ( o.data.description.length >= 60 ) {
						this.error('description', 'The description value must be less that 60 characters');
						return false;
					}
	
					if ( o.data.quantity === "" ) {
						this.error('quantity', 'A quantity must be set');
						return false;
					}
					else if ( o.data.quantity.length >= 6 ) {
						this.error('quantity', 'The quantity value must be less that 6 characters');
						return false;
					}				
				}
			}
		},
		"ajax": function ( method, url, data, successCallback, errorCallback ) {
			$.ajax( {
		        "type": method,
		        "url":  url,
		        "data": data.data,
		        "dataType": "json",
		        "success": function (json) {
		          successCallback( json );
		        },
		        "error": function (xhr, error, thrown) {
		          errorCallback( xhr, error, thrown );
		        }
		      } );
		    }
    } );
	
	// Delete a record (without asking a user for confirmation)
	$('#items').on('click', 'a.editor_add', function (e) {
		alert('add');
		e.preventDefault();
		alert($(this).parents('tr')[0]);
		editor.edit(
				$(this).parents('tr')[0],
				'Edit record',
				{ "label": "Update", "fn": function () { editor.submit() } }
			);
		//editor.remove( $(this).parents('tr')[0], '123', false, false );
		//editor.submit();
	} );
	
	// Delete a record (without asking a user for confirmation)
	$('#items').on('click', 'a.editor_remove', function (e) {
		alert('remove');
		e.preventDefault();
		alert($(this).parents('tr')[0]);
		//editor.remove( $(this).parents('tr')[0], '123', false, false );
		//editor.submit();
	} );
	
	$('#items').dataTable( {
		//"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sDom": "<'row-fluid'<'span6'T><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
		"sPaginationType": "bootstrap",
		"bProcessing": true,
		"sAjaxSource": "/items",
		"oLanguage": {
			"sLengthMenu": "_MENU_ items per page"
			},
		"iDisplayLength": 25,
		"aoColumns":[
            {"mData":"name"},
            {"mData":"description"},
            {"mData":null, 
            	"mRender": function ( data, type, row ) {
            		return row.quantity + ' ' + row.unit;
            	}},
			{
				"mData": null, 
				"sClass": "center",
				"sDefaultContent": '<div nowrap><a href="#" class="editor_add btn btn-mini"><i class="icon-minus-sign"></i></a> <a href="#" class="editor_remove btn btn-mini"><i class="icon-plus-sign"></i></a></div>'
			}
          ],
      "oTableTools": {
    	"sRowSelect": "single",
        "aButtons": [
            { "sExtends": "editor_create", "editor": editor },
            { "sExtends": "editor_edit",   "editor": editor },
            { "sExtends": "editor_remove", "editor": editor }
      ]}
	});
	
});