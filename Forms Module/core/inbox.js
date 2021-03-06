﻿

// templateids is an optional multivalue string
Forms.getInbox = function (templateids) {
    var myStateMap = [];
    var states = Query.select("Forms.states", "templateid;status;action", "staff CONTAINS {User.getName()} AND action != ''");
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        var key = state.templateid + ":" + state.status;
        myStateMap[key] = state;
    }
    var initiatorStateMap = [];
    var states = Query.select("Forms.states", "templateid;status;action", "staff CONTAINS 'Initiator' AND action != ''");
    for (var i = 0; i < states.length; i++) {
        var state = states[i];
        var key = state.templateid + ":" + state.status;
        initiatorStateMap[key] = state;
    }

    var me = User.getName();
    var forms = [];
    var where = "";
    if (templateids) where = "id IN " + list(templateids);
    var allForms = Query.select("Forms.forms", "id;templateid;status;name;date;owner", where, "date DESC");
    for (var i = 0; i < allForms.length; i++) {
        var form = allForms[i];
        var key = form.templateid + ":" + form.status;
        if (myStateMap[key] != null) forms.push(form);
        else if (initiatorStateMap[key] != null && form.owner == me) forms.push(form);
    }

    // Finaly filter with User role.
    forms = FormUtils.filterRoleForms(forms, User.getRole());

    return forms;
}