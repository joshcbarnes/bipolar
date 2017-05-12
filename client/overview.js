"use strict";

var module = angular.module("biPolarApp", ["chart.js"]);

module.component("overview", {
    templateUrl: "overview.html",
    controller: OverviewController,
    controllerAs: "ctrl",
    bindings: {
    }
});

function OverviewController($scope, $element) {
    this.organizations = fetchOrganizations();

    this.chartSeries = ['Series A', 'Series B'];

    this.chartData = this.organizations.map(function(org) {
       return [{
           x: org.happiness,
           y: org.arr,
           r: 15
       }];
    });

    this.chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    min: 0,
                    max: 1,
                    stepSize: 0.1
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
        return [
            {name: "Microsoft", logo: null, arr: 1000000, happiness: 0.8},
            {name: "Netflix", logo: null, arr: 500000, happiness: 0.6},
            {name: "Red Hat", logo: null, arr: 100000, happiness: 0.2},
            {name: "Foobar", logo: null, arr: 200000, happiness: 0.5}
        ];
    }
}
