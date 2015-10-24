//declare open register/login function outside of cntrl's so we can re-use it
function openRegister(ngDialog) {
    ngDialog.open({
        template: 'dialogs/registerDialog.html',
        controller: 'RegisterController',
        className: 'ngdialog-theme-default'
    });
}

function openLogin(ngDialog) {
    ngDialog.open({
        template: 'dialogs/loginDialog.html',
        controller: 'LoginController',
        className: 'ngdialog-theme-default'
    });
}

//Login Controller-----------------------------------------------------------------------------
app.controller('LoginController', function($scope, $window, $location, $timeout, ngDialog, AuthenticationService, FlashService){
    (function initController() {
        $scope.dataLoading = false;
    })();
    
    $scope.login = function() {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.data.success) {
                $scope.dataLoading = false;
                //store our jwt token in local storage
                $window.localStorage['token'] = response.data.token;
                $window.localStorage['username'] = $scope.username;
                FlashService.Success('Login successful... Redirecting now', true);
                $timeout(function() {
                    FlashService.clearFlashMessage();
                    ngDialog.close();
                    $location.url('portal/' + $scope.username);
                }, 1000);
            } else {
                FlashService.Error(response.data.message);
                $scope.dataLoading = false;
            }
        });
    };
    
    $scope.switchToRegister = function () {
        ngDialog.close();
        openRegister(ngDialog);
    };
});  

//Register Controller-----------------------------------------------------------------------------
app.controller('RegisterController', ['$scope', 'ngDialog', 'UserService', 'FlashService',
function($scope, ngDialog, UserService, FlashService) {
    $scope.dataLoading = false;      
    
    $scope.register = function() {
        $scope.dataLoading = true;
        UserService.create($scope.user, function(response){
            if (response.data.success) {
                $scope.dataLoading = false;
                FlashService.Success('Registration successful', true);
            } else {
                console.log(response.data.message);
                FlashService.Error(response.data.message);
                $scope.dataLoading = false;
            }
        });
    }
    
    $scope.switchToLogin = function () {
        ngDialog.close();
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