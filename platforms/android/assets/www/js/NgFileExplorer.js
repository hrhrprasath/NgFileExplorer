angular.module('ngfileexplorer', [])
.factory('$explorer',function(){
		 var root = null; // File System root variable
		 var currentDir = null; // Current DirectoryEntry listed
		 var parentDir = null; // Parent of the current directory
		 var activeItem = null; // The clicked item
		 var activeItemType = null; // d-directory, f-file
		 var clipboardItem = null; // file or directory for copy or move 
		 var clipboardAction = null; // c-copy, m-move
		 var UpdateScope = null; 
		 var listDir = function (directoryEntry){
			try
			{
				if( !directoryEntry.isDirectory )
				console.log('listDir incorrect type');
				currentDir = directoryEntry; // set current directory
				
				var sucess = function(par){ // success get parent
					parentDir = par; // set parent directory
				}.bind(this);
				var error = function(error){ // error get parent
					console.log('Get parent error: '+error.code);
				};
				directoryEntry.getParent(sucess,error);
				var directoryReader = directoryEntry.createReader();
				var readSucess =function(entries){
					
					var dirArr = new Array();
					var fileArr = new Array();
					for(var i=0; i<entries.length; ++i){ // sort entries
						var entry = entries[i];
						if( entry.isDirectory && entry.name[0] != '.' ) dirArr.push(entry);
						else if( entry.isFile && entry.name[0] != '.' ) fileArr.push(entry);
					}
					UpdateScope(dirArr,fileArr);
				}.bind(this);
				var readError = function(error){
					console.log('listDir readEntries error: '+error.code);
				};
				directoryReader.readEntries(readSucess,readError);
			}
			catch(e)
			{
			 console.log("listDir :  "+e.message)
			}		
		};
		var openItem  = function (type){
		try{
				if( type == 'd' ){
					listDir(activeItem);
				} else if(type == 'f'){
					readFile(activeItem);
				}
				}
			catch(e)
			{
			 console.log("openItem :  "+e.message)
			}
		};
		var readFile = function (fileEntry){
		try{
				if( !fileEntry.isFile )
				console.log('readFile incorrect type');
				var sucess = function(file){
					UpdateScope(null,null,file);
				}.bind(this);
				var error = function(error){
					console.log("file read error:"+evt.target.error.code);
				};
				fileEntry.file(sucess,error);
			}
			catch(e)
			{
			 console.log("readFile :  "+e.message)
			}
		};
	return {
		getFileSystem :function (){
			try{
			var sucess = function(fileSystem){ // success get file system
					root = fileSystem.root;
					listDir(root);
				}.bind(this);
			var error = function(evt){ // error get file system
					console.log("File System Error: "+evt.target.error.code);
				};
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,sucess,error);
			}
			catch(e)
			{
			 console.log("listDir :  "+e.message)
			}	
		},
		readFile : readFile,
		openItem  : openItem,
		getActiveItem : function (name, type){
		try{
				var sucess =function(dir){ // success find directory
							activeItem = dir;
							activeItemType = type;
							openItem('d');
						}.bind(this);
				var error = function(error){ // error find directory
							console.log('Unable to find directory: '+error.code);
						};
				var fileSucess = function(file){ // success find file
							activeItem = file;
							activeItemType = type;
							openItem('f');
					}.bind(this);
				var fileError = function(error){ // error find file
							console.log('Unable to find file: '+error.code);
						};
				if( type == 'd' && currentDir != null ){
					currentDir.getDirectory(name, {create:false, exclusive: false},sucess,error);
				} else if(type == 'f' && currentDir != null){
					currentDir.getFile(name, {create:false, exclusive: false},fileSucess,fileError);
				}
			}
			catch(e)
			{
				console.log("getActiveItems :  "+e.message)
			}
		},
		getClipboardItem : function (action){
		try{
				if( activeItem != null) {
					clipboardItem = activeItem;
					clipboardAction = action;
				}
			}
			catch(e)
			{
				console.log("getClipboardItem : "+e.message)
			}
		},
		registorCallBack : function(callback){
			UpdateScope = callback;
		},
		getParentDirectory : function (){
			return parentDir;
		},
		getcurrentDirectory : function (){
			return currentDir;
		},
		back : function() {
			if(parentDir)
			listDir(parentDir);
		}
	};
 })
 .controller('exploreCtrl',['$scope','$explorer', function($scope,explorer) {
	$scope.dirs =[];
	$scope.files =[];
	$scope.exploreReady = false;
	$scope.currentDirPath="";
	$scope.openUrl =function(url)
	{
		navigator.app.loadUrl(url, { openExternal:true })
	}
	var callBack = function(dirs,files,file)
	{
	try{
			if(dirs && files){
				$scope.$apply(function(){
					$scope.dirs = dirs;
					$scope.files = files;
					$scope.currentDirPath=explorer.getcurrentDirectory().fullPath;
				});
			}
			if(file)
			{
			 window.plugins.fileOpener.open(explorer.getcurrentDirectory().nativeURL +file.name)
			}
			
		}
		catch(e)
		{
			console.log("Update error:"+e.message)
		}
	}.bind(this);
	explorer.registorCallBack( callBack);
	document.addEventListener("deviceready",function() {
		try{
			explorer.getFileSystem();
			$scope.exploreReady = true;
		}
		catch(e)
		{
			console.log("divicereade event Error :"+e.message);
		}
	}, false);
	$scope.OpenSelectedItem = function(name,type)
	{
		explorer.getActiveItem(name, type);
	};
	$scope.back = function()
	{
		explorer.back();
	};
}]);