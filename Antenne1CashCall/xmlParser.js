function SimpleXmlParser(xmlDoc) { // (1) pass in the DOMDocument (either created manually or from an XMLHttpRequest.responseXML)
  this.xmlDoc = xmlDoc; 
  this.parseError = xmlDoc.parseError;   // (2) output any parse errors and make them available to client
  if (this.parseError.errorCode != 0)
     debug.error("SimpleXmlParser ERROR: " + this.parseError.reason);
}

SimpleXmlParser.prototype.getItems = function(key) {
  var xmlDoc = this.xmlDoc;
  var items = [];
  if (this.parseError.errorCode != 0) {
     debug.error("SimpleXmlParser ERROR: " + this.parseError.reason);
  } else {
     var objNodeList = xmlDoc.getElementsByTagName(key); // (3) get the specific tags the user wants
     gadget.debug.trace("found num "+objNodeList.length);
     for (var i = 0; i < objNodeList.length; ++i) {
       var xmlItem = objNodeList.item(i);
       var item = {};
       var added = false;
       for (var j = 0; j < xmlItem.childNodes.length; ++j) {
         var child = xmlItem.childNodes.item(j);
         var name = child.nodeName;
         if (child.childNodes.length > 0) { // (4) pull out the text for the children of the main tag
           var value = child.childNodes[0].nodeValue;
           item[name] = value;
           added = true;
         }
         if (child.attributes.length > 0) {
           for (var a = 0; a < child.attributes.length; a++) {
             var attr = child.attributes[a];
             var attrName = attr.name;
             item[name+"@"+attrName] = attr.value;
           }
           added = true;
         }
       }
       if (added) {
         items.push(item);
       }
     }
  }
  return items;
}