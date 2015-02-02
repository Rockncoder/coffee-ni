angular.module('starter.controllers', [])
    .service('ListingsService', function ($http, $q) {
        return {
            get: get
        };

        function filterOutMetaData(data) {
            var meta, listings;

            if (data && data.searchResult && data.searchResult.metaProperties) {
                meta = data.searchResult.metaProperties;

                if (meta.resultCode === "Success") {
                    listings = data.searchResult.searchListings.searchListing;
                    if (!listings) {
                        listings = [];
                        listings.totalAvailable = 0;
                        listings.totalPages = 0;
                        return listings;
                    }

                    listings.totalAvailable = meta.totalAvailable;
                    listings.totalPages = Math.ceil(listings.totalAvailable / 20);
                    return listings;
                }
            }
        }

        function get(pageNum) {
            var deferred = $q.defer();

            $http.get('data/page' + pageNum + '.json')
                .then(function (res) {
                    var listings = filterOutMetaData(res.data);
                    deferred.resolve(listings);
                });

            return deferred.promise;
        }
    })

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('ListingsController', function ($scope, ListingsService) {
        $scope.message = "Hello San Francisco";
        //$scope.listings = [
        //    {businessName: "alpha"},
        //    {businessName: "beta"},
        //    {businessName: "gamma"},
        //    {businessName: "delta"},
        //    {businessName: "epsilon"},
        //    {businessName: "iota"}
        //];
        $scope.listings = [];

        ListingsService.get(1).then(function (listings) {
            $scope.listings = listings;
        });
    });
