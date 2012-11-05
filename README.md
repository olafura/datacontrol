DataControl for Enyo
===========

DataControl container for Enyo.js both in browser and able to sync to Couchdb

It's currently Alpha software, so be aware that there might be changes to how it's structured and there is no guarantee that you data will be intact. It just needs more testing and a little bit of hardening.

It uses PouchDB but isn't tied to it in any way, it's designed to easily allow for more data connectors and they can happily coinsist and should be hotswapable though now that there is no syncing in the background to make that seamless.

So what does it look like:
```js
	{name: "datacontrol", kind: "DataControl", databaseName: "articles", dataCommit: "manual",
	         components: [
	           {dataContainer: true, kind: "onyx.InputDecorator", components: [
	                {name: "contactname", dataName: "contact.name", kind: "onyx.Input"}
	           ]},
	           {kind: "enyo.Button", content: "Submit", dataSubmit: true}
	]},
```

So what does it all mean, `DataControl` is a container in which you can put what ever you want. The field `databaseName` in datacontrol tells it which database it should be under. Then `dataCommit` tells it to do a `manual` commit to the database through the `dataSubmit` enabled button, you can set it to `auto` then it commits the change it self without a button.
If you have a container like the `InputDecorator` or something more complex you tell it that it's a `dataContainer` then it's children are watched for changes.
The `dataName` names the field which the data is saved under, if you want it to be saved under a parent field then you put the parent name and then a dot.  

Not shown is if you want to fetch a previously saved entry then you set the `docId` to the id of the entry.
