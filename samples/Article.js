enyo.kind({
    name: "DataControl.sample.ArticleSample",
    classes: "onyx onyx-sample",
    fit: 1,
    components: [
         {name: "datacontrol", kind: "DataControl", databaseName: "articles", dataCommit: "manual", 
         components: [
           {kind: "FittableRows", components: [ 
             {classes: "onyx-sample-label", content: "Article"},
             {tag: "br"},
             {classes: "onyx-sample-divider", content: "Title"},
           ]},
           {dataContainer: true, kind: "FittableRows", components: [ 
             {dataContainer: true, kind: "onyx.InputDecorator", width: "100%", components: [
                {name: "title", dataName: "data.title", kind: "onyx.Input"}
             ]},
             {tag: "br"},
             {tag: "br"},
             {dataContainer: true, kind: "onyx.InputDecorator", classes: "bigbody", components: [
                {name: "body", dataName: "data.body", kind: "onyx.TextArea"}
             ]},
             {tag: "br"},
             {tag: "br"},
             {kind: "onyx.Button", classes: "onyx-dark", content: "Submit", dataSubmit: true}
           ]},
         ]},
         {kind: "DataEvents"},
    ],
});

