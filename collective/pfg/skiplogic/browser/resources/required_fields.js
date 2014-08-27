/*  FORCES REQUIRED FIELD ERROR */
function throwReqErr(id) {
    if ( $('#fg-base-edit').find('div[name="fldErr"]').length <= 0 )
      $('#archetypes-fieldname-'+id).attr('name', 'fldErr');
    $('#'+id+'_help').text('This field is required.').addClass('fieldErrorBox');
    $('#archetypes-fieldname-'+id).addClass('error');
};

/*  CLEARS REQUIRED ERROR CLASSES - CALLED WHEN USER HAS RESOLVED AND RESUBMITTED   */
function clearErrClass(id) {
    $('#'+id+'_help').text('').removeClass('fieldErrorBox');
    $('#archetypes-fieldname-'+id).removeClass('error');
};

/*  SCROLLS TO FIRST FIELD WITH REQUIRED FIELD ERROR */
function scrollToAnchor(aid){
    var aTag = $("div[name='"+ aid +"']");
    $('html,body').animate({scrollTop: aTag.offset().top},'fast');
};

/*  LOOP THROUGH FORM AND GET ALL VISIBLE FIELDS WITH VALUES */
function getFormFields() {
    var formFields = '';
    var lbl='';
    var reqErr = false;
    $('div[name="fldErr"]').attr('name', '');
    $('#fg-base-edit *').filter(':input').filter(':visible').each(function(e, f) {
      /* RADIO SELECTION */
      if ( $(f).is(':radio') ) {
        if ( $(f).is(':checked') ) {
          lbl = $(f).siblings('div.label').clone().find('.formHelp').remove().end().text(); 
          formFields += '<span class="overlay_column"><label id="'+$(f).attr("name")+'">' + $.trim( lbl ) + '</label>';
          formFields += '<p>' + $(f).val() + '</p></span>';        
          clearErrClass($(f).attr('name'));
        }
        /* check if field is required and if it is the last option in the list */
        else if ( formFields.indexOf('<label id="'+$(f).attr("name")+'">') < 0 && ($('#'+$(f).attr("name")).children('input').last().attr('id') == $(f).attr('id') )
                  && $(f).siblings('div.label').children('.required').length>0 ) {
          throwReqErr($(f).attr('name'));
          reqErr = true;
        };
      }
      /* CHECKBOX MULTI-SELECTION */
      else if ( $(f).is(':checkbox') && $(f).parent('div').hasClass('ArchetypesMultiSelectionValue') ) {
        lbl = $(f).attr('name').replace(':list', '');
        if ( $(f).is(':checked') ) {
          /* check if label already exists for this input - if so appends to value */
          if ( formFields.indexOf('<label id="'+$(f).parent().parent().attr("id")+'">') >= 0 ) {
            formFields = formFields.slice(0,-11);
            formFields += ','+$(f).val() + '</p></span>';
          }
          else {
            lbl = $(f).parent('.ArchetypesMultiSelectionValue').siblings('div.label').clone().find('.formHelp').remove().end().text();
            formFields += '<span class="overlay_column"><label id="'+$(f).parent().parent().attr("id")+'">' + $.trim( lbl ) + '</label>';
            formFields += '<p>' + $(f).val() + '</p></span>';
          };
          clearErrClass($(f).parent().parent().attr("id"));
        }
        /* check if field is required and if it is the last option in the list */
        else if ( formFields.indexOf('<label id="'+$(f).parent().parent().attr("id")+'">') < 0 && ($('div#'+lbl+' div.label span.required').length > 0)
                  && ($('#'+$(f).parent().parent().attr("id")).children('.ArchetypesMultiSelectionValue').last().attr('id') == ("archetypes-value-"+$(f).attr('id')) ) ) {
          throwReqErr( $(f).parent().parent().attr("id") );
          reqErr = true;
        };
      }
      /* ALL OTHER INPUTS */
      else {
        if ( $(f).val()!='' && $(f).val()!=null ) {
          lbl = $('label[for="'+$(this).attr("id")+'"]').clone().find('.formHelp').remove().end().text(); 
          formFields += '<span class="overlay_column"><label id="'+$(f).attr("id")+'">' + $.trim( lbl ) + '</label>';
          formFields += '<p>' + $(f).val() + '</p></span>';
          clearErrClass($(f).attr('id'));
        }
        else if ($(f).siblings('label').children('.required').length>0) {
          throwReqErr( $(f).attr('id') );
          reqErr = true;
        };
      }
    });
    if (reqErr)
      return true;
    else
      return false;
};

/* On submit, check all visible fields that are required */
jQuery(document).ready(function($){
  jQuery('#fg-base-edit').submit(function(e){    
    var er = getFormFields();
    if (er) {
      scrollToAnchor('fldErr');
      e.returnValue=false;
      e.preventDefault();
      return false;
    }
  });
});