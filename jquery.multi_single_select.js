// Convert a multi-select into a single_select which keeps
// track of choices in an external list with hidden fields
// The hidden fields have the same field name as the
// multi select.
// list_class defaults to the select id + "_data"
// Chosen options are moved
// from the 'Add' option group to the 'Remove' option group,
// Each suffixed by the given 'title' or the string "Option"
// The select header is extracted from the select's label
// for - if it exists. Otherwise it just prints 'Options...'
(function(){
  var multi_single_select_data = {};
  
  multi_single_select_remove = function(scccis_id, list_class_name, name, val) {
    jQuery("#"+scccis_id+" optgroup.remove option").each(function(i, opt) {
      var selected = jQuery(opt);
      if( selected.val() == val) {
        selected.removeAttr('selected');
        selected.removeAttr('class');
        var add_group = jQuery("#"+scccis_id+" optgroup.add");
        
        // paste the selected option in the correct location
        // iterate through the data and find the current match.
        // find the next add_group item and prepend
        var found_val = false;
        var next_add_group_val = null;
        var data = multi_single_select_data[scccis_id];
        for(var i=0; i < data.length; i++) {
          if(found_val && !next_add_group_val) {
            next_add_group_val = add_group.find("option[value='"+data[i]+"']");
            if(next_add_group_val.length != 0) break;
          } else {
            if(data[i] == val) {
              found_val = true;
            }
          }
        }
        if(!next_add_group_val || next_add_group_val.length == 0) {
          add_group.append(selected);
        } else {
          next_add_group_val.before(selected);
        }
      }
    });
    
    jQuery("#"+scccis_id + "~ ul."+list_class_name+" li").each(function(i, li) {
      li = jQuery(li);
      var span = li.find('span');
      if( span.html() == name) {
        li.remove();
      }
    });
    
    jQuery("#"+scccis_id + "~ span."+list_class_name+" input").each(function(i, input) {
      input = jQuery(input);
      if( input.val() == val) {
        input.remove();
      }
    });
  }
  
  jQuery.fn.multi_single_select = function(settings) {
    
    this.each(function() {
      if(!settings) settings = {};
      var list_class_name = settings.list_class;
      var title = settings.title;
      
      var scccis = $(this);
      
      if(!title) title = "Option";
      
      var scccis_id = scccis.attr("id");
      
      if(!list_class_name) list_class_name = scccis_id + "_data";
      
      var option_name = jQuery("label[for=" + scccis_id + "]").text();
      if(!option_name) option_name = title + "s";
      option_name += "...";
      
      // Grab the name of the select, and give that name to all hidden fields
      var scccis_name = scccis.attr('name');
      scccis.removeAttr('name');
      
      var add_group = jQuery("<optgroup class='add'></optgroup>").attr('label', 'Add ' + title);
      var remove_group = jQuery("<optgroup class='remove'></optgroup>").attr('label', 'Remove ' + title);
      scccis.append(add_group);
      scccis.append(remove_group);
      
      var category_list = jQuery("<ul />").attr('class', list_class_name);
      var category_data = jQuery("<span />").attr('class', list_class_name);
      scccis.after(category_list)
      scccis.after(category_data)
      
      multi_single_select_data[scccis_id] = [];
      
      // remove each selected and push to end
      scccis.find('option').each(function(i,selected){
        selected = jQuery(selected)
        multi_single_select_data[scccis_id].push(selected.val());
        if( !selected.attr('selected') ) {
          add_group.append(selected);
        } else {
          remove_group.append(selected);
          selected.removeAttr('selected');
          selected.attr('class', 'removable');
          
          category_list.append("<li><span>"+selected.html()+"</span><a href=\"javascript:multi_single_select_remove('"+scccis_id+"','"+list_class_name+"','"+selected.html()+"','"+selected.val()+"')\">x</a></li>");
          category_data.append("<input type='hidden' name='"+scccis_name+"' value='"+selected.val()+"' />");
        }
      });
      
      scccis.prepend(jQuery("<option>"+option_name+"</option>").attr('class', 'directive').attr('value', '0'));
      
      scccis.change(function(e){
        var selected = jQuery(this).find(":selected");
        
        if( selected.val() == "0" ) return;
        
        if( selected.attr('class') == 'removable' )
        {
          var name = selected.html();
          var val = selected.val();
          
          multi_single_select_remove(scccis_id, list_class_name, name, val);
        }
        else
        {
          selected.removeAttr('selected');
          selected.attr('class', 'removable');
          remove_group.append(selected);
          
          category_list.append("<li><span>"+selected.html()+"</span><a href=\"javascript:multi_single_select_remove('"+scccis_id+"','"+list_class_name+"','"+selected.html()+"','"+selected.val()+"')\">x</a></li>");
          category_data.append("<input type='hidden' name='"+scccis_name+"' value='"+selected.val()+"' />");
        }
        
        this.selectedIndex = 0;
      });
      
      scccis.removeAttr('multiple');
      scccis.removeAttr('size');
    });
    
    return this;
  }
})();
