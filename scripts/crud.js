$(document).ready(function(){
	var finderApp = angular.module('finderApp', []);

    finderApp.controller('formCtrl', function($scope, $http){
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	$scope.editing=false;
	$scope.buttontext="Add";
	$scope.showButton = false;
	$scope.errorlines=[];
	$scope.justsubmitted = false;

    	// clear variable / form values
		$scope.clearForm = function(){
			console.log("clear");
			$scope.id = null;
			$scope.name = null;
			$scope.year = null;
			$scope.gender = null;
			$scope.formadd.$setUntouched();
    		$scope.formadd.$setPristine();
		}

    	$scope.getAll = function(){
    		$http.post('http://localhost/crud/server',{
      			'request': 'getshows'
      		}).success(function(response){
      			console.log(response);
		        $scope.itens = response.values;
		    });
    	}

    	$scope.deleteShow = function(id){
    		$http.post('http://localhost/crud/server',{
      			'request': 'deleteshow',
      			'id': id
      		}).success(function(response){
      			$scope.getAll();
		    });
    	}

    	$scope.editShow = function(item){
    		$scope.editing=true;
    		$scope.id = parseInt(item.id);
    		$scope.name = item.name;
    		$scope.year = parseInt(item.year);
    		$scope.gender = item.gender;
    		$scope.buttontext="Atualizar";
    	}

    	$scope.addShow = function(form){
    		if($scope.editing){
    			$scope.updateShow();
    		}else{
	    		parameters={'id': $scope.id, 'name': $scope.name, 'year': $scope.year, 'gender': $scope.gender};
	    		if(form.$valid){
		    		parameters.request = 'newshow';

		    		$http.post('http://localhost/crud/server', parameters).success(
		    			function(response){
		    				$scope.clearForm($scope.formadd);
		    				$scope.getAll();
		    			});
		    		$scope.formadd.$submitted = false;
	    		}else{
	    		}
    		}
    	}

    	$scope.updateShow = function(){
			parameters={'id': $scope.id, 'name': $scope.name, 'year': $scope.year, 'gender': $scope.gender};
			parameters.request = 'updateshow';

			$http.post('http://localhost/crud/server', parameters).success(
				function(response){
					$scope.clearForm($scope.formadd);
					$scope.getAll();
					$scope.buttontext = "Add";
					if(response.error) alert("Não foi possível atualizar");
					$scope.editing = false;
				});
    	}

    	$scope.descartar = function(){
    		$scope.editing = false;
    		$scope.buttontext = "Add";
    		$scope.clearForm();
    	}
    });
});