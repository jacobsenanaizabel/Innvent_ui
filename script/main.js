var app = angular.module('tutorialWebApp', [
  'ngRoute'
]);

/** Router pages **/
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider

    .when("/", {templateUrl: "partials/home.html", controller: "PageCtrl"})
    .when("/about", {templateUrl: "partials/about.html", controller: "PageCtrl"})
    .when("/faq", {templateUrl: "partials/faq.html", controller: "PageCtrl"})
    .when("/pricing", {templateUrl: "partials/pricing.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "partials/services.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "partials/contact.html", controller: "PageCtrl"})
    .otherwise("/404", {templateUrl: "partials/404.html", controller: "PageCtrl"});
}]);

/** Services **/
app.service('pageService', function($http) {

    this.getCurrencies = function() {
        /** 
        var req = $http.get('http://apilayer.net/api/live?access_key=bfbb3baa3a9fa924ef69d83cebb2111a&currencies=ARS').then(function(result) {
            
            console.log("deu certo")
            console.log(result)
            //return onRequestEnd(result);

        })["catch"](function(result) {

            console.log("deu errado")
            //return onRequestEnd(result);
        }); **/
    };
});

/*Controler**/
app.controller('PageCtrl', function ( $scope, $location, $http, pageService) {

    $scope.currencies ="";
    $scope.cambioCurrencies ="";
    $scope.currenciesArray = ["Euro", "Real", "Peso"];
    $scope.currenciesChoose = {};

    pageService.getCurrencies();   
    

    $http({
    method : "GET",
    url : "http://apilayer.net/api/live?access_key=bfbb3baa3a9fa924ef69d83cebb2111a&currencies=EUR,BRL,ARS&source=USD&format=1"
    }).then(function mySucces(response) {
        $scope.currencies = response.data;

        getCurrencies($scope.currencies.quotes.USDARS,$scope.currencies.quotes.USDBRL,$scope.currencies.quotes.USDEUR);
        getDayliCurrencyDefault("default");

        }, function myError(response) {      
        console.log(response.statusText);
    });


    var getDateNow = function(){
        return new Date().toLocaleString();
    }
        
    var conversao = function(val){

        if(val == "Real")
            return "BRL";

        if(val == "Euro")
            return "EUR";
        
        if(val == "Peso")
            return "ARS";
        
    }

      
  $scope.changeInput = function(val){

    var convertido = conversao(val);  
    $http({
    method : "GET",
    url : "http://localhost:1337/api/currencies/exchange/"+convertido
    }).then(function mySucces(response) {
        console.log("http://localhost:1337/api/currencies/exchange/"+convertido)
               
        if(!response.data.success){
            var get = $http.get('http://apilayer.net/api/live?access_key=bfbb3baa3a9fa924ef69d83cebb2111a&currencies='+convertido).then(function(result) {
                $scope.cambioCurrencies = result.data;
                getDayliCurrency($scope.cambioCurrencies, val);
            });
        }else{             
            $scope.cambioCurrencies = response.data;
            console.log($scope.cambioCurrencies)
        }
    })["catch"](function(result) {
        var get = $http.get('http://apilayer.net/api/live?access_key=bfbb3baa3a9fa924ef69d83cebb2111a&currencies='+convertido).then(function(result) {
            $scope.cambioCurrencies = result.data;
            getDayliCurrency($scope.cambioCurrencies, val);
        });
        console.log("backend não esta configurado")
    });  
    
    $scope.currenciesChoose.tes = val;
  }

//graficos divididos em função 
    var getDayliCurrency = function(cambioCurrencies,moeda){
    
    $(function () {
        Highcharts.chart('container', {
            title: {
                text: 'Cotação da moeda selecionada',
                x: -20 //center
            },
            subtitle: {
                text: 'http://apilayer.net/',
                x: -20
            },
            xAxis: {
                categories: [getDateNow()]
            },
            yAxis: {
                title: {
                    text: 'Conversão a partir do USD'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: moeda,
                data: [cambioCurrencies.quotes[Object.keys(cambioCurrencies.quotes)[0]]]
            }]
        });
    });
    }
  
  
    var getDayliCurrencyDefault = function(cambioCurrencies){
    $(function () {
        Highcharts.chart('container', {
            title: {
                text: 'Cotação da ultima semana',
                x: -20 //center
            },
            subtitle: {
                text: 'http://apilayer.net/',
                x: -20
            },
            xAxis: {
                categories: ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6',
                    'Dia 7']
            },
            yAxis: {
                title: {
                    text: 'USD'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Euro',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5]
            }, {
                name: 'Real',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0]
            }, {
                name: 'Peso Argentino',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6]
            }]
        });
    });
    }
  
    var getCurrencies = function(usdars,  usdbrl, usdeur){
    $(function () {
        Highcharts.chart('containerDay', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Cotação atual  '+getDateNow()
            },
            subtitle: {
                text: 'Cotação do euro, real e peso argentino'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Valor tranformado a partir do dolar'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Euro €',
                    y: usdeur,
                    drilldown: 'Euro'
                }, {
                    name: 'Real R$ ',
                    y: usdbrl,
                    drilldown: 'Real'
                }, {
                    name: 'Peso Argentino ‎$',
                    y: usdars,
                    drilldown: 'Peso Argentino'
                }]
            }],
        });
    });
    
    }
});