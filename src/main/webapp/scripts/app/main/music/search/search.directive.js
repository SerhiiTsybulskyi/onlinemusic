'use strict';

angular.module('onlinemusicApp')
    .directive('search', function () {

        var controller = function ($scope, $attrs, $injector) {
            var genreService = $injector.get($attrs.genreService);
            var albumService = $injector.get($attrs.albumService);
            var musicService = $injector.get($attrs.musicService);
            $scope.form = {};
            $scope.genres = [];
            $scope.albums = [];
            $scope.musics = [];
            $scope.predicate = 'id';
            $scope.reverse = true;
            $scope.page = 0;

            $scope.loadGenres = function () {
                if ($scope.genres.length == 0) {
                    genreService.query({page: $scope.page, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                        for (var i = 0; i < result.length; i++) {
                            $scope.genres.push(result[i]);
                        }
                    });
                }
            };

            $scope.loadAlbums = function () {
                if ($scope.albums.length == 0) {
                    albumService.query({page: $scope.page, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                        for (var i = 0; i < result.length; i++) {
                            $scope.albums.push(result[i]);
                        }
                    });
                }
            };

            $scope.search = function (form) {
                var album = _.isUndefined(form.album) ? '' : form.album.name;
                var genre = _.isUndefined(form.genre) ? '' : form.genre.name;
                var query = _.isUndefined(form.query) ? '' : form.query;
                musicService.search({query: query, album: album, genre: genre }, function (result, headers) {
                    $scope.musics = [];
                    _.forEach(result, function (value, key) {
                        $scope.musics.push({
                            title: value.title,
                            author: value.artist.name,
                            url: value.downloadUrl,
                            duration: moment.duration(value.duration),
                            pic: value.posterUrl != null ? value.posterUrl : 'https://www.googledrive.com/host/0B8ExDrngxZU8NzJ3dTN2aTR4RXc'
                        });
                    });

                    // dataService.musics = $scope.musics;
                })
            }
        };

        var link = function ($scope, $element) {

        };

        return {
            restrict: 'E',
            templateUrl: "/scripts/app/main/music/search/search.html",
            controller: controller,
            scope: false,
            link: link
        };
    });
