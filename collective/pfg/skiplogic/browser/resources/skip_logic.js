<script type="text/javascript" src="jquery_required_fields.js"></script>
<script>

function driveFields(driver, receiver, type) {
	$('select[name="'+driver+'"]').change(function() {
		$(type+'[name="'+receiver+'"]').val($('select[name="'+driver+'"]').val());
	});
};

function makeRequired(vl) {
    for (var n=0; n<vl.length; n++) {
      $.each(vl[n], function(key, vu) {
        var ind = $.inArray(key, window.requiredFields);

        if( vu && (ind==-1) ) {
          window.requiredFields.push(key);
          $('#archetypes-fieldname-'+key).append('<span id="fieldname-'+key+'-required" class="required" title="Required" />');
          $('#'+key+'_help').before($('#fieldname-'+key+'-required'));
        };
      });
    };
};

function toggleFields(val, v) {
  var found = false;
  $.each(val, function(x, vl) {
    for (var n=0; n<vl.length; n++) {
      $.each(vl[n], function(key, vu) {
          $('#archetypes-fieldname-'+key).hideAndEmpty(key);
      });
    };
  });

  $.each(val, function(x, vl) {
    makeRequired(vl);
    if(v==x) { 
      for (var n=0; n<vl.length; n++) {
        $.each(vl[n], function(key, vu) {
          $('#archetypes-fieldname-'+key).show(); 
        });
      };
    };
  });
  
};

function loadFields(i, val, inType) {
  if (inType=='radio' || inType=='checkbox') {
    var v = $('input[name="'+i+'"]:checked').val();
  }
  else {
    var v = $('[name="'+i+'"]').val();
  };
  $.each(val, function(x, vl) {
    for (var n=0; n<vl.length; n++) {
      $.each(vl[n], function(key, vu) {
        $('#archetypes-fieldname-'+key).hide();
      });
    };
  });

  $.each(val, function(x, vl) {
    makeRequired(vl);
    if(v==x) { 
      for (var n=0; n<vl.length; n++) {
        $.each(vl[n], function(key, vu) {
          $('#archetypes-fieldname-'+key).show(); 
        });
      };
    };
  });
  
  $.each(val, function(x, vl) {
    if(v==x) { 
      for (var n=0; n<vl.length; n++) {
        $.each(vl[n], function(key, vu) {
          if ($('#archetypes-fieldname-'+key).is(':hidden'))
              $('#archetypes-fieldname-'+key).hideAndEmpty(key)
        });
      };
    };
  });
};

jQuery(document).ready(function($){ 

 if ($('input[name="controllers"]').length>0 || $('textarea[name="controllers"]').length>0 || $('#form-controllers').text().length>0) {
  window.requiredFields = new Array();

  var dict = $.parseJSON( $('input[name="controllers"]').val() );
  if (!dict)
    dict = $.parseJSON( $('textarea[name="controllers"]').val() );
  if (!dict)
    dict = $.parseJSON( $('#form-controllers').text() );

  $.each(dict, function(i, val) {
    var isInput = $('[name="'+i+'"]').is('input');
    var isSelect = $('[name="'+i+'"]').is('select');
    window.thisType =  $('[name="'+i+'"]').attr('type');
    var isMSF = $('[name="'+i+':list"]').is('input');


    if (isInput) { 
      loadFields(i, val, thisType);
      $('[name="'+i+'"]').change(function() {
         var v = this.value;
         toggleFields(val, v);
      });
    }
    else if (isSelect) { 
      loadFields(i, val, 'select');
      $('select[name="'+i+'"]').change(function() {
         var v = this.value;
         toggleFields(val, v);
      });
    }
    else if (isMSF) { 
      //i += ':list';
      window.thisType = $('[name="'+i+':list"]').attr('type');
      loadFields(i+':list', val, thisType);
      /*$('[name="'+i+'"]').change(function() {
        var v = $(this).val();
        var chkd = $(this).is(':checked');
        $.each(val, function(ky, va) {
          if ( v == ky) {
            if (!chkd)
              v = chkd;
            toggleFields(val, v);
          };
        });
      });*/
    $('[name="'+i+':list"]').change(function() {
        toShow = val[$(this).val()];
		isChecked = $(this).is(':checked');
		if (toShow) {
          for (var n=0; n<toShow.length; n++) {
			  $.each(toShow[n], function(k,v) {
                /*if (v && !$('label[for="'+k+'"]').children('span.required').length) {
					$('#archetypes-fieldname-'+k).append('<span id="fieldname-'+k+'-required" class="required" title="Required" />');
                    $('#'+k+'_help').before($('#fieldname-'+k+'-required'));
				}*/
			    if (isChecked){
				    $('#archetypes-fieldname-'+k).show();
				}
			    else {
					$('#archetypes-fieldname-'+k).hide();
					$('[name="'+k+'"]').val('');
				};
			  });
		  };
		};
    });
    };
  });


  /*jQuery('#fg-base-edit').submit(function(e){   
    var missing = false;

    for(var i=0; i<window.requiredFields.length; i++) {
      var k = window.requiredFields[i];
      if( $('#archetypes-fieldname-'+k).is(':visible') ) {
        var isInput = $('[id='+k+']').is('input');
        var isRadio = $('[name="'+k+'"]').attr('type');
        var isSelect = $('select[id='+k+']').is('select');
        var isText = $('[name="'+k+'"]').is('textarea');
        if (isInput) {
          var thisType =  $('[name="'+k+'"]').attr('type') || $('[id='+k+']').attr('type');
          var inType = 'input';
        }
        else if (isText) {
          var thisType = 'textarea';
          var inType = 'textarea';
        }
        else {
          var thisType = false; 
          var inType = 'select';
        };
        if (isRadio=='radio') {
          var thisVal = $('[name="'+k+'"]:checked').val();
        }
        else if (thisType=='checkbox') {
          var thisVal = $('[id='+k+']:checked').val();
        }
        else {
          var thisVal = $('[id='+k+']').val();
        };
        if(thisVal=='undefined' || thisVal==null || !thisVal) {
          $('#'+k+'_help').before($('#fieldname-'+k+'-required'))
          $('#'+k+'_help').text('This field is required.').addClass('fieldErrorBox');
          $('#archetypes-fieldname-'+k).addClass('error');
          missing = true; 
        }
      };
    };

    if(missing)
      e.returnValue=false;  

  });*/
 };

 if ($('input[name="field-driver"]').length>0 || $('textarea[name="field-driver"]').length>0 || $('#form-field-driver').text().length>0 ) {
  
  var dict = $.parseJSON( $('input[name="field-driver"]').val() );
  if (!dict)
    dict = $.parseJSON( $('textarea[name="field-driver"]').val() );
  if (!dict)
    dict = $.parseJSON( $('#form-field-driver').text() );
  var receiver = dict.Receiver;

  $.each(dict.Drivers, function(i) {

        driver = dict.Drivers[i];
      
        type = $('#'+receiver).attr('type');
        if (type=='text')
          type = 'input'
        if (!type) {
          if ($('#'+receiver).is('textarea')) { type = 'textarea' }
        };

        driveFields(driver, receiver, type);
  });
  
 };
});

</script>
