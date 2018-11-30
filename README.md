# NgFileExplorer
  FileExplorer angular app for cordova integration.
  
Dependency
==========
&emsp;<a href="http://github.com/apache/cordova-plugin-file">cordova-plugin-file</a>

Usage
=======
Make sure to load cordova.js, AngularJS first, and then `NgFileExplorer.min.js`.

  The module is named `ngfileexplorer`. To enable it, you must simply list it as a dependency in your app. Example:

    var app = angular.module('Demo', ['ngfileexplorer', ...]);
	

  In corresponding controller in which you want to have File Explorer, insert a dependency `$explore` like:
  
  
	  app.controller('exploreCtrl',['$scope','$explorer', function($scope,explorer){......});
	
	
  In the body of controller first Register a Callback:
  
	  explorer.registorCallBack( function(DirectoryCollection,FileCollection,OpenedFile){ 
		  if(DirectoryCollection && FileCollection){
				// if a directive is opened
			}
			if(OpenedFile)
			{
				// if a file is opened
			}
		});
		
this Callback will be fired every time when file system is being used.

  Register for the `deviceready` event with an eventhandler and in that call
	`	explorer.getFileSystem();`
   once file system is ready, call back will be fired with Directory Object Collection and File object Collection of the root directory as arguments.
   
   To Open a Particular File or Directive call
   
	explorer.getActiveItem(name, explorer.itemType[type]);
	
	where
	  name--> file or directive name 
	  type--> 'Directive' for directive and 'File' for file
	  once the process is completed call back is fired 
	  if it is a directive then Directory Object Collection and File object Collection will be its arguments
	  if it is a file then null,null, fileObject will be its arguments
  
  
  To navigate to previous Directory	call
	
	explorer.back();
	
callback will be fired with parent directory's Directory Object Collection and File object Collection
	
  `explore.getParentDirectory()` will return parent directory object
  
  `explore.getcurrentDirectory()` will return current directory object

  For more detatils see <a href="https://github.com/hrhrprasath/NgFileExplorer/blob/master/www/js/Demo.js"> demo </a>
  
  Note: this app is restricted to use phone memory only for now
Download
========
<ul>
<li> <a href="https://github.com/hrhrprasath/NgFileExplorer/blob/master/dist/FileExplorer.apk?raw=true">FileExplorer App </a></li>
<li> <a href="https://github.com/hrhrprasath/NgFileExplorer/blob/master/dist/NgFileExplorer.js?raw=true">NgFileExplorer.min.js</a></li>
<li> <a href="https://github.com/hrhrprasath/NgFileExplorer/blob/master/dist/NgFileExplorer.min.js?raw=true">NgFileExplorer.js</a></li>
</ul>

Released under <a href="http://github.com/hrhrprasath/NgFileExplorer/blob/master/LICENSE">MIT licence</a> 
