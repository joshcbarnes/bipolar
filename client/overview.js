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
    var that = this;
    fetchOrganizations();
    //populateRandomData();

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
                type: 'logarithmic',
                ticks: {
                    min: 0,
                    max: 1000000,
                    callback: function(tick, index, ticks) {
                        return "$" + tick.toLocaleString();
                    }
                },
                afterBuildTicks: function(scale) {
                    scale.ticks = [
                        0, 10000, 100000, 1000000
                    ];
                }
            }]
        },
        title: {
            text: "Account Pulse",
            display: true,
            fontFamily: "Open Sans",
            fontStyle: "bold",
            fontSize: 28,
            padding: 25,
            fontColor: "#555"
        }
    };



    function fetchOrganizations() {
        $http({method: "GET", url: "/organizations"}).then(function(response) {

            that.chartData = response.data.map(function(org) {
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

    function populateRandomData() {
        that.chartData = [];
        for (var i = 0; i < 50; i++) {
            that.chartData.push([{
                x: Math.random(),
                y: Math.random() * 1000000,
                r: 15
            }])
        }
    }
}
