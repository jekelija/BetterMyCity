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
app.controller('LoginController', function($scope, $window, $state, $timeout, ngDialog, AuthenticationService, FlashService){
    (function initController() {
        $scope.dataLoading = false;
    })();
        
    $scope.login = function() {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function (response) {
            if (response.data.success) {
                $scope.dataLoading = false;
                FlashService.Success('Login successful... Redirecting now', true);
                $timeout(function() {
                    FlashService.clearFlashMessage();
                    ngDialog.close();
                    $state.go('portal');
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
app.controller('RegisterController', function($scope, ngDialog, UserService, FlashService) {
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
});

//NavBar Controller-----------------------------------------------------------------------------
app.controller('NavbarController', function($scope, $timeout, $state, ngDialog, AuthenticationService){
    $scope.getButton1Text = function() {
        if(AuthenticationService.isLoggedIn()) {
            return "My Profile";
        }
        else {
            return "Log In";
        }
    }
    
    $scope.getButton2Text = function() {
        if(AuthenticationService.isLoggedIn()) {
            return "Log Out";
        }
        else {
            return "Register";
        }
    }

    $scope.button1 = function() {
        if(AuthenticationService.isLoggedIn()) {
            //TODO 
            console.log('Edit profile...');
        }
        else {
            openLogin(ngDialog);
        }
    };
    
    $scope.button2 = function() {
        if(AuthenticationService.isLoggedIn()) {
            $timeout(function() {
                $state.go('main');
            }, 1000);
            AuthenticationService.Logout();
            
        }
        else {
            openRegister(ngDialog);
        }
    };
});