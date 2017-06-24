angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PlaylistsCtrl', function($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })
    .controller('LoginCtrl', function($scope) {

        $scope.getToken = function() {

            if (FCMPlugin !== undefined) {

                //FCMPlugin.onTokenRefresh( onTokenRefreshCallback(token) );
                //Note that this callback will be fired everytime a new token is generated, including the first time.
                FCMPlugin.onTokenRefresh(function(token) {
                    console.log(token);
                });

                FCMPlugin.getToken(function(token) {
                    console.log(token);
                });

                FCMPlugin.subscribeToTopic('vanhck');
            }
        }

        // if (FCMPlugin !== undefined) {

        //     FCMPlugin.onNotification(function(data) {
        //         if (data.wasTapped) {
        //             //Notification was received on device tray and tapped by the user.
        //             alert(JSON.stringify(data));
        //         } else {
        //             //Notification was received in foreground. Maybe the user needs to be notified.
        //             alert(JSON.stringify(data));
        //         }
        //     });
        // }
    })

.controller('RouteController', function($scope) {

    $scope.packages_available = 0

    $scope.date = {
        startTime: null,
        endTime: null
    }

    $scope.addNewOrder = function() {


        var today = new Date()

        var startDate = new Date($scope.date.startTime)
        var endDate = new Date($scope.date.endTime)

        startDate.setDate(today.getDate())
        startDate.setMonth(today.getMonth())
        startDate.setYear(today.getFullYear())

        endDate.setDate(today.getDate())
        endDate.setMonth(today.getMonth())
        endDate.setYear(today.getFullYear())

        var data = {
            userID: 14,
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
            state: "pending"
        }

        console.log(data)
        $.ajax({
            type: "POST",
            url: "http://52.58.76.156:8080/addNewOrder",
            data: data,
            success: function(data) {
                console.log(data)
            },
            dataType: "text"
        });
    }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {});
