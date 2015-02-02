angular.module('starter.controllers', [])
    .service('ListingsService', function ($http, $q) {
        var dictionary = {};
        return {
            get: get,
            getById: getById
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

        function convertListingsToDictionary(listings){
            var ndx, biz;
            for(ndx=0; ndx < listings.length; ndx +=1){
                biz = listings[ndx];
                if(!dictionary[biz.listingId]){
                    dictionary[biz.listingId] = biz;
                }
            }
        }

        function get(pageNum) {
            var deferred = $q.defer(),
                page = 'data/page' + pageNum + '.json';

            console.log(page);
            $http.get(page)
                .then(function (res) {
                    var listings = filterOutMetaData(res.data);
                    convertListingsToDictionary(listings);
                    deferred.resolve(listings);
                });

            return deferred.promise;
        }

        function getById(id) {
            if(dictionary[id]){
                return dictionary[id];
            }
            return null;
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
        $scope.canShowMore = true;
        var currentPage = 1;
        var maxPage = 3;
        $scope.loadMore = function () {
            console.log("Need to load more: " + currentPage);

            if ($scope.canShowMore) {
                ListingsService.get(currentPage).then(function (listings) {
                    // add the listings to current listings
                    $scope.listings = $scope.listings.concat(listings);
                    // let ionic know we've fetched the data
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
                currentPage++;
            }
            // check to see if any more to show
            if (currentPage >= maxPage) {
                $scope.canShowMore = false;
            }
        };

        //ListingsService.get(currentPage).then(function (listings) {
        //    $scope.listings = listings;
        //});
    })
    .controller('DetailsController', function ($scope, $stateParams, ListingsService) {
        $scope.id = $stateParams.id;
        $scope.biz = ListingsService.getById($stateParams.id)
    });
