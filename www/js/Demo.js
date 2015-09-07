angular.module('Demo', ['ngfileexplorer']).controller('exploreCtrl',['$scope','$explorer', function($scope,explorer) {
	$scope.dirs =[];
	$scope.files =[];
	$scope.exploreReady = false;
	$scope.currentDirPath="";
	
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
		explorer.getActiveItem(name, explorer.itemType[type]);
	};
	$scope.back = function()
	{
		explorer.back();
	};
}]);
