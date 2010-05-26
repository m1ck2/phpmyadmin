/* vim: set expandtab sw=4 ts=4 sts=4: */
/**
 * function used in server privilege pages
 *
 * @version $Id$
 */

/**
 * Validates the password field in a form
 *
 * @uses    PMA_messages['strPasswordEmpty']
 * @uses    PMA_messages['strPasswordNotSame']
 * @param   object   the form
 * @return  boolean  whether the field value is valid or not
 */
function checkPassword(the_form)
{
    // Did the user select 'no password'?
    if (typeof(the_form.elements['nopass']) != 'undefined'
     && the_form.elements['nopass'][0].checked) {
        return true;
    } else if (typeof(the_form.elements['pred_password']) != 'undefined'
     && (the_form.elements['pred_password'].value == 'none'
      || the_form.elements['pred_password'].value == 'keep')) {
        return true;
    }

    var password = the_form.elements['pma_pw'];
    var password_repeat = the_form.elements['pma_pw2'];
    var alert_msg = false;

    if (password.value == '') {
        alert_msg = PMA_messages['strPasswordEmpty'];
    } else if (password.value != password_repeat.value) {
        alert_msg = PMA_messages['strPasswordNotSame'];
    }

    if (alert_msg) {
        alert(alert_msg);
        password.value  = '';
        password_repeat.value = '';
        password.focus();
        return false;
    }

    return true;
} // end of the 'checkPassword()' function


/**
 * Validates the "add a user" form
 *
 * @return  boolean  whether the form is validated or not
 */
function checkAddUser(the_form)
{
    if (the_form.elements['pred_hostname'].value == 'userdefined' && the_form.elements['hostname'].value == '') {
        alert(PMA_messages['strHostEmpty']);
        the_form.elements['hostname'].focus();
        return false;
    }

    if (the_form.elements['pred_username'].value == 'userdefined' && the_form.elements['username'].value == '') {
        alert(PMA_messages['strUserEmpty']);
        the_form.elements['username'].focus();
        return false;
    }

    return checkPassword(the_form);
} // end of the 'checkAddUser()' function


/**
 * Generate a new password and copy it to the password input areas
 *
 * @param   object   the form that holds the password fields
 *
 * @return  boolean  always true
 */
function suggestPassword(passwd_form) {
    // restrict the password to just letters and numbers to avoid problems:
    // "editors and viewers regard the password as multiple words and
    // things like double click no longer work"
    var pwchars = "abcdefhjmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWYXZ";
    var passwordlength = 16;    // do we want that to be dynamic?  no, keep it simple :)
    var passwd = passwd_form.generated_pw;
    passwd.value = '';

    for ( i = 0; i < passwordlength; i++ ) {
        passwd.value += pwchars.charAt( Math.floor( Math.random() * pwchars.length ) )
    }
    passwd_form.text_pma_pw.value = passwd.value;
    passwd_form.text_pma_pw2.value = passwd.value;
    return true;
}

/**
 * Add all AJAX scripts for server_privileges page here.
 *
 * Actions to be ajaxified here:
 * Add a new user
 * Revoke a user (and also drop databases with same name as user)
 * Edit privileges
 * Export privileges
 * Paginate table of users
 * Flush privileges
 */
$(document).ready(function() {
    
    /**
     * Attach AJAX event handlers to 'Add a New User'
     *
     * @todo create standard options for dialog boxes
     */
    $("#fieldset_add_user a").click(function(event) {
        event.preventDefault();

        PMA_ajaxShowMessage();

        $(this).append('<div id="add_user_dialog"></div>');
        var add_user_url = $(this).attr("href");
        //add_user_url += "&ajax_request=true";
        $.get(add_user_url, {'ajax_request':true}, function(data) {
            $("#add_user_dialog").prepend(data).dialog({
                title: 'Add a New User',
                width: 800,
                modal: true,
                buttons: {"Create User": function() {
                        //code here to submit the form
                            },
                            "Cancel": function() {$(this).dialog("close")}
                        } //buttons end
            }); //dialog options end
        });

    });//end of Add New User AJAX event handler

}); //end $(document).ready()