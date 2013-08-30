$ ->
  $.get "/items", (data) ->
    $.each data, (index, item) ->
      $('#items tbody').append('<tr class="odd gradeX">' +
									'<td>' + item.name + '</td>' +
									'<td>' + item.description + '</td>' +									
									'<td>' + item.quantity + ' ' + item.unit + '</td>' +
								'</tr>')
      