$(document).ready(function(){
 
 $('#item-form').validate(
 {
  rules: {
    name: {
      minlength: 2,
      required: true
    },
    description: {
      required: true,
      minlength: 2
    },
    quantity: {
      minlength: 1,
      required: true
    }
  },
  highlight: function(element) {
    $(element).closest('.control-group').removeClass('success').addClass('error');
  },
  success: function(element) {
    element
    .text('OK!').addClass('valid')
    .closest('.control-group').removeClass('error').addClass('success');
  }
 });
}); // end document.ready