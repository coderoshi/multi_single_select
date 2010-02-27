// Convert a multi-select into a single_select which keeps
// track of choices in an external list with hidden fields
// The hidden fields have the same field name as the
// multi select.
// list_class_name defaults to the select id + "_data"
// Chosen options are moved
// from the 'Add' option group to the 'Remove' option group,
// Each suffixed by the given 'title' or the string "Option"
// The select header is extracted from the select's label
// for - if it exists. Otherwise it just prints 'Options...'
(function(){
  $.fn.multi_single_select = function(list_class_name, title) {
    var scccis = this;
    
    if(!title) title = "Option";
    
    var scccis_id = scccis.attr("id");
    
    if(!list_class_name) list_class_name = scccis_id + "_data";
    
    var option_name = $("label[for=" + scccis_id + "]").text();
    if(!option_name) option_name = title + "s";
    option_name += "...";
    
    // Grab the name of the select, and give that name to all hidden fields
    var scccis_name = scccis.attr('name');
    scccis.removeAttr('name');
    
    var add_group = $("<optgroup></optgroup>").attr('label', 'Add ' + title);
    var remove_group = $("<optgroup></optgroup>").attr('label', 'Remove ' + title);
    scccis.append(add_group);
    scccis.append(remove_group);
    
    var category_list = $("<ul />").attr('class', list_class_name);
    var category_data = $("<span />").attr('class', list_class_name);
    scccis.after(category_list)
    scccis.after(category_data)
    
    // remove each selected and push to end
    scccis.find('option').each(function(i,selected){
      selected = $(selected)
      if( !selected.attr('selected') ) {
        add_group.append(selected);
      } else {
        remove_group.append(selected);
        selected.removeAttr('selected');
        selected.attr('class', 'removable');
      
        category_list.append("<li>"+selected.html()+"</li>");
        category_data.append("<input type='hidden' name='"+scccis_name+"' value='"+selected.val()+"' />");
      }
    });
  
    scccis.prepend($("<option>"+option_name+"</option>").attr('class', 'directive').attr('value', '0'));
  
    scccis.click(function(e){
      var selected = scccis.find(':selected');
    
      if( selected.val() == "0" ) return;
    
      if( selected.attr('class') == 'removable' )
      {
        selected.removeAttr('selected');
        selected.removeAttr('class');
        add_group.append(selected);
      
        var name = selected.html();
        var val = selected.val();
      
        $("ul."+list_class_name+" li").each(function(i, li){
          li = $(li)
          if( li.html() == name) {
            li.remove();
          }
        });
        $("span."+list_class_name+" input").each(function(i, input){
          input = $(input)
          if( input.val() == val) {
            input.remove();
          }
        });
      }
      else
      {
        selected.removeAttr('selected');
        selected.attr('class', 'removable');
        remove_group.append(selected);
      
        category_list.append("<li>"+selected.html()+"</li>");
        category_data.append("<input type='hidden' name='"+scccis_name+"' value='"+selected.val()+"' />");
      }
    
      this.selectedIndex = 0;
    });

    scccis.removeAttr('multiple');
    scccis.removeAttr('size');
  }
})();
