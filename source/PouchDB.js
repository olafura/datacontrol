enyo.kind({
	name: "PouchDB",
	kind: "DataLayout",
        constructor: function() {
	      this.inherited(arguments); 
              console.log("create");
              console.log("container:",this.container);
              console.log("databaseName", this.container.databaseName);
              this.preque = [];
              //this.container.setDatabaseName("test");
              var parent = this;
              Pouch('idb://'+this.container.databaseName, function(err, db){
                parent.db = db;
                parent.unrollpreque();
                if(parent.container.syncWith !== "") {
                  parent.syncFrom(function(err, changes){
                    console.log("syncFrom err", err);
                    console.log("syncFrom changes", changes);
                  });
                }
              });
        },
        unrollpreque: function(){
              pq = this.preque;
              console.log(pq);
              length = pq.length;
              for(var i = 0; i  < length; i++){
                 if(pq[i].type === "create"){
                   this.createDoc(pq[i].doc, pq[i].callback);
                 }else if(pq[i].type === "set"){
                   this.setDoc(pq[i].doc, pq[i].callback);
                 }else if(pq[i].type === "get"){
                   this.getDoc(pq[i].doc, pq[i].callback);
                 }else if(pq[i].type === "delete"){
                   this.deleteDoc(pq[i].doc, pq[i].callback);
                 }
              }
              this.preque = [];
        },
        createDoc: function(doc, callback) {
              if(this.db){
                this.db.post(doc, callback);
              }
              else {
                this.preque.push({type: "create", doc: doc, callback: callback}); 
              }
        },
        setDoc: function(doc, callback) {
              if(this.db){
                this.db.put(doc, callback);
              }
              else {
                this.preque.push({type: "set", doc: doc, callback: callback}); 
              }
        },
        getDoc: function(docid, callback) {
              if(this.db){
                console.log(docid);
                this.db.get(docid, callback);
              }
              else {
                this.preque.push({type: "get", doc: docid, callback: callback}); 
              }
        },
        deleteDoc: function(docid, callback) {
              if(this.db){
                parent = this;
                this.db.get(docid, function(err, doc) {
                  console.log("deleteDoc: ", doc);
                  parent.db.remove(doc, callback);
                });
              }
              else {
                this.preque.push({type: "delete", doc: docid, callback: callback}); 
              }
        },
        syncFrom: function(callback){
              if(this.db){
                Pouch.replicate(this.container.syncWith,'idb://'+this.container.databaseName, callback); 
              }
              else {
              }
        },
        syncTo: function(callback){
              if(this.db){
                Pouch.replicate('idb://'+this.container.databaseName,this.container.syncWith, callback); 
              }
              else {
              }
        }

});
