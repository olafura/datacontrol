enyo.kind({
	name: "DataControl",
	kind: "enyo.Control",
        published: {
              dataStore: "PouchDB",
              databaseName: "test",
              dataCommit: "manual",
              dataId: ""
        },
        handlers: {
               onchange: "controlchanged",
               ontap: "ontap"
        },
        components: [
               {kind: "Signals", onCommit: "commit"}
        ],
        dataaware: {},
        datavalue: {},
        datamapper: {},
        suppresscommit: false,
        create: function() {
               this.inherited(arguments);
               console.log("create:databaseName",this.databaseName); 
               console.log("create:dataCommit",this.dataCommit); 
               this.dataStoreChanged();
               this.dataaware = {}; 
               this.refreshDataIndex(this.children);
        },
        commit: function(inSender, inEvent) {
               console.log("DataControl commit:", inEvent);
               if(this.syncWith !== ""){
                 this.syncTo(enyo.bind(this, "synced"));
               }
        },
        synced: function(err, changes){
               console.log("synced err", err);
               console.log("synced changes", changes);
        },
        unfoldName: function(dName, dValue, d){
               console.log("unfold d: ", d);
               dNameArray = dName.split(".");
               if(dNameArray.length>1){
                 var oldDName = dNameArray[0];
                 var oldd = d[dNameArray[0]];
                 console.log("unfold name:", dNameArray[0]);
                 if(oldd === undefined){
                   oldd = Object();
                 }
                 var newd = this.unfoldName(dNameArray.slice(1).join("."),dValue, oldd);
                 d[oldDName] = newd;
                 return d
               }
               else{ 
                 d[dName] = dValue;
                 return d
               }
        },
        autoCreateDoc: function(e, d){
               console.log("auto createDoc error:",e); 
               console.log("auto createDoc doc:",d); 
               console.log("auto createDoc id:", this.dataId);
               this.dataId = d.id;
               this.datavalue._id = d.id;
               this.datavalue._rev = d.rev;
               console.log(this.datavalue);
               enyo.Signals.send("onCommit", {status:"created", id: d.id, sender:this.id, database: this.databaseName}); 
        },
        autoChangeDoc: function(dName, dValue, e, d){
               console.log("auto changeDoc error:",e); 
               console.log("auto changeDoc doc:",d); 
               this.setDoc(this.datavalue,enyo.bind(this, "autoSetDoc"));
        },
        autoSetDoc: function(e, d){
               console.log("auto setDoc error:",e); 
               console.log("auto setDoc doc:",d)
               enyo.Signals.send("onCommit", {status:"changed", id: d.id, sender:this.id, database: this.databaseName}); 
        },
        controlchanged: function(inSender, inEvent) {
               var dtarget = inEvent.dispatchTarget;
               console.log("dtarget.id:",dtarget.id);
               if(this.dataaware[dtarget.id] === true && !this.suppresscommit){
                   console.log("DataControl",inSender);
                   console.log("DataControl",inEvent);
                   var dName = dtarget.dataName;
                   console.log("DataControl",dName);
                   var dValue = dtarget.getValue();
                   console.log("DataControl",dValue);
                   this.datavalue = this.unfoldName(dName, dValue, this.datavalue);
                   if(this.dataCommit === "auto"){
                     if(this.dataId === ""){
                       this.createDoc(this.datavalue, enyo.bind(this, "autoCreateDoc"));
                     } else { 
                       //this.getDoc(this.dataId, enyo.bind(this, "autoChangeDoc", dName, dValue));
                       this.setDoc(this.datavalue,enyo.bind(this, "autoSetDoc"));
                     }
                   }
               }
        },
        ontap: function(inSender, inEvent) {
               var dtarget = inEvent.dispatchTarget;
               if(dtarget.dataSubmit === true && this.dataCommit === "manual"){
                   console.log("dtarget:",dtarget);
                   if(this.dataId === ""){
                     this.createDoc(this.datavalue, enyo.bind(this, "autoCreateDoc"));
                   } else { 
                     this.setDoc(this.datavalue,enyo.bind(this, "autoSetDoc"));
                   }
               }
        },
        dataNameChanged: function() {
               console.log("dataNameChanged",this.dataName);
        },
        changeDocValues: function(e, d) {
               this.datavalue = d;
               this.changeDocVal(d,"");
               this.suppresscommit = false;
        },
        changeDocVal: function(d, prefix) {
               for(i in d){
                 console.log("type", typeof d[i]);
                 console.log("i", i);
                 console.log("di", d[i]);
                 console.log("prefix", prefix);
                 if(typeof d[i] === "object"){
                   this.changeDocVal(d[i],prefix+i+"."); 
                 }
                 else{
                   var mapped = this.datamapper[prefix+i];
                   console.log("mapped", mapped);
                   if(mapped != undefined){
                     enyo.$[mapped].setValue(d[i]);
                   }
                 }
               }
        },
        dataIdChanged: function(){
               this.suppresscommit = true;
               console.log("dataId", this.dataId);
               this.getDoc(this.dataId, enyo.bind(this, "changeDocValues"));
        },
        dataStoreChanged: function() {
                if (this.data) {
                        this.data.destroy();
                }
                this.data = enyo.createFromKind(this.dataStore, this);
                console.log("dataStoreChanged",this.data);
                if (this.generated) {
                        this.render();
                }
        },
        refreshDataIndex: function(children) {
                console.log("refreshDataIndex",children);
                var length = children.length;
                for (var i=0; i<length; i++) {
                        c = children[i];
                        if (c.dataName !== undefined){ 
                          console.log("child",c); 
                          this.dataaware[c.id] = true;
                          var dValue = c.getValue();
                          var dName = c.dataName;
                          this.datavalue = this.unfoldName(dName, dValue, this.datavalue);
                          this.datamapper[dName] = c.id;
                        } else 
                        if (c.dataContainer){
                          console.log("container",c); 
                          this.refreshDataIndex(c.children);
                        }
                }
        }, 
        createDoc: function(doc, callback) {
               this.data.createDoc(doc, callback);
        },
        setDoc: function(doc, callback) {
               this.data.setDoc(doc, callback);
        },
        getDoc: function(docid, callback) {
               this.data.getDoc(docid, callback);
        }, 
        deleteDoc: function(docid, callback) {
               this.data.deleteDoc(docid, callback);
        },
        syncTo: function(callback) {
               this.data.syncTo(callback);
        },
        syncFrom: function(callback) {
               this.data.syncFrom(callback);
        }
        
});

enyo.kind({
        name: "DataEvents",
        components: [
          {kind: "Signals", onCommit: "commit"}
        ],
        commit: function(inSender, inEvent) {
          console.log("signal sender:", inSender);
          console.log("signal event:", inEvent);
        }
});

enyo.createFromKind = function(inKind, inParam) {
        var ctor = inKind && enyo.constructorForKind(inKind);
        if (ctor) {
                return new ctor(inParam);
        }
};

