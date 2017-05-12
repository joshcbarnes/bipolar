"use strict";

var module = angular.module("biPolarApp", ["chart.js"]);

module.component("overview", {
    templateUrl: "overview.html",
    controller: ["$http", OverviewController],
    controllerAs: "ctrl",
    bindings: {
    }
});

function OverviewController($http) {
    fetchOrganizations();

    this.chartSeries = ['Series A', 'Series B'];

    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    display: false,
                    min: 0,
                    max: 1,
                    stepSize: 0.25
                },
                gridLines: {
                    display: true
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    min: 0,
                    max: 1000000,
                    stepSize: 100000
                }
            }]
        },
        title: {
            text: "Account Pulse",
            display: true,
            fontFamily: "Open Sans",
            fontStyle: "bold",
            fontSize: 28,
            fontColor: "#555"
        }
    };


    function fetchOrganizations() {
        $http({method: "GET", url: "/organizations"}).then(function(response) {

            this.chartData = response.data.map(function(org) {
               return [{
                   x: org.happiness,
                   y: org.arr,
                   r: 15
               }];
            });

        }, function(response) {
            console.log("lolz we dun goofed");
        });
    }
}
