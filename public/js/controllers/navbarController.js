//declare open register/login function outside of cntrl's so we can re-use it
function openRegister(ngDialog) {
    ngDialog.open({
        template: 'registerDialog',
        controller: 'RegisterController',
        className: 'ngdialog-theme-default'
    });
}

function openLogin(ngDialog) {
    ngDialog.open({
        template: 'loginDialog',
        controller: 'LoginController',
        className: 'ngdialog-theme-default'
    });
}

//Login Controller-----------------------------------------------------------------------------
app.controller('LoginController', ['$scope', 'ngDialog', 'AuthenticationService', 'FlashService', function($scope, ngDialog, AuthenticationService, FlashService){
    (function initController() {
        $scope.dataLoading = false;

        // reset login status
        AuthenticationService.ClearCredentials();
    })();
    
    $scope.login = function() {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.data.success) {
                AuthenticationService.SetCredentials($scope.username, $scope.password);
            } else {
                FlashService.Error(response.data.message);
                $scope.dataLoading = false;
            }
        });
    };
    
    $scope.switchToRegister = function () {
        ngDialog.close('loginDialog');
        openRegister(ngDialog);
    };
}]);  

//Register Controller-----------------------------------------------------------------------------
app.controller('RegisterController', ['$scope', 'ngDialog', 'UserService', 'FlashService',
function($scope, ngDialog, UserService, FlashService) {
    $scope.dataLoading = false;      
    
    $scope.register = function() {
        $scope.dataLoading = true;
        UserService.create($scope.user, function(response){
            if (response.data.success) {
                FlashService.Success('Registration successful', true);
                openLogin(ngDialog);
            } else {
                console.log(response.data.message);
                FlashService.Error(response.data.message);
                $scope.dataLoading = false;
            }
        });
    }
    
    $scope.switchToRegister = function () {
        ngDialog.close('registerDialog');
        openLogin(ngDialog);
    };
}]);

//NavBar Controller-----------------------------------------------------------------------------
app.controller('NavbarController', ['$scope', '$timeout', 'ngDialog', function($scope, $timeout, ngDialog){
    $scope.openRegister = function() {
        openRegister(ngDialog);
    };
    
    $scope.openLogin = function() {
        openLogin(ngDialog);
    };
}]);