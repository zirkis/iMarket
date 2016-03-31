'use strict';
/*
* ------------------------------------------------------------------------
* Require
* ------------------------------------------------------------------------
*/
const EventEmitter = require('events');
const util = require('util');
const importMar = require ('./market.js');
const importRes = require('./restaurant.js');
const importCus = require('./customer.js');
/*
 * ------------------------------------------------------------------------
 * Objects
 * ------------------------------------------------------------------------
 */
var rungis = new importMar.Market('Rungis');
var restaurants = [new importRes.Restaurant('The Batman',9,16,rungis), new importRes.Restaurant('The Superman',11,19,rungis), new importRes.Restaurant('Wonder Woman',14,23,rungis)];
var clients = [];
var id = 0;
var numberOfClients = 0;
/*
 * ------------------------------------------------------------------------
 * HTML
 * ------------------------------------------------------------------------
 */
var elm_textarea = document.getElementById('console');
var elm_clock = document.getElementById('clock');
var elm_calendar = document.getElementById('calendar');
var elm_client = document.getElementById('client');
scroll = true;
elm_textarea.onfocus = function(){
    scroll = false;
}
elm_textarea.onblur = function(){
    scroll = true;
}
document.getElementById(restaurants[0].name).innerHTML = restaurants[0].name;
document.getElementById(restaurants[0].name+'4').innerHTML = restaurants[0].displayStocks(restaurants[0].ingredients);
document.getElementById(restaurants[0].name+'6').innerHTML = restaurants[0].openHour + ':00 - ' + restaurants[0].closeHour + ':00';
document.getElementById(restaurants[1].name).innerHTML = restaurants[1].name;
document.getElementById(restaurants[1].name+'4').innerHTML = restaurants[1].displayStocks(restaurants[1].ingredients);
document.getElementById(restaurants[1].name+'6').innerHTML = restaurants[1].openHour + ':00 - ' + restaurants[1].closeHour + ':00';
document.getElementById(restaurants[2].name).innerHTML = restaurants[2].name;
document.getElementById(restaurants[2].name+'4').innerHTML = restaurants[2].displayStocks(restaurants[2].ingredients);
document.getElementById(restaurants[2].name+'6').innerHTML = restaurants[2].openHour + ':00 - ' + restaurants[2].closeHour + ':00';
document.getElementById(rungis.name).innerHTML = rungis.name;
document.getElementById(rungis.name+'4').innerHTML = rungis.displayStocks(rungis.stocks);

var html_textArea = function(text){
    elm_textarea.innerHTML += '\n' + elm_clock.innerHTML + '| ' +text;
    if (scroll){
        elm_textarea.scrollTop = elm_textarea.scrollHeight;
    }
}
/*
 * ------------------------------------------------------------------------
 * Emitter
 * ------------------------------------------------------------------------
 */
function MyEmitter() {
    EventEmitter.call(this);
}
util.inherits(MyEmitter, EventEmitter);

const emitterTime = new MyEmitter();
/*
 * ------------------------------------------------------------------------
 * Clock
 * ------------------------------------------------------------------------
 */
const intervalTime = setInterval(() => emitterTime.emit('signal', (i += 10) % 60), 300);
let i = 0;
var hours = 0, minutes = 0, day = 1;
elm_calendar.innerHTML = 'Day' + '</br>' + day;
elm_client.innerHTML = 'Clients' + '</br>' + numberOfClients;
/*
 * ------------------------------------------------------------------------
 * Events
 * ------------------------------------------------------------------------
 */
emitterTime.on('signal', (unit) => {
    minutes = unit;
    if (minutes === 0){
        minutes += '0';
        hours++;
    }
    if (hours === 24){
        hours = 0;
        day++;
        elm_calendar.innerHTML = 'Day' + '</br>' + day;
    }
    //console.log(hours + 'h' + minutes + 'm');
    elm_clock.innerHTML = hours + ':' + minutes;
    //elm_textarea.innerHTML += hours + ':' + minutes + '\n';
    if (scroll){
        elm_textarea.scrollTop = elm_textarea.scrollHeight;
    }

    for (var e = 0; e < restaurants.length; e++){
        if (!restaurants[e].open && restaurants[e].isAnyReceiptAvailable() && hours > restaurants[e].openHour && hours < restaurants[e].closeHour){
            restaurants[e].setOpen(true);
        }
    }

    if (minutes === 20 && hours >= 9 && hours < 23){
        var number = Math.floor(Math.random() * 3);
        for(let i=0; i<number; i++){
            clients.push(new importCus.Customer(id, restaurants));
            clients[id].tryRestaurant()
                .then((data) => html_textArea(data))
                .catch((data) => html_textArea(data));
            id++;
            numberOfClients++;
            elm_client.innerHTML = 'Clients' + '</br>' + numberOfClients;
        }
    }
    for (let j in clients){
        if(clients[j].alreadyEaten){
            //elm_textarea.innerHTML += "The client number " + clients[j].id + ' has been deleted';
            //console.log('The client number ' + clients[j].id + ' has been deleted');
            delete clients[j];
            numberOfClients--;
            elm_client.innerHTML = 'Clients' + '</br>' + numberOfClients;
        }
    }
    /*
     * ------------------------------------------------------------------------
     * Market : Rungis
     * ------------------------------------------------------------------------
     */
    if (hours === rungis.openHour-1 && minutes === '00'){
        rungis.fillStocks();
    }
    if (hours === rungis.openHour && minutes === '00'){
        rungis.setOpen(true);
    }
    if (hours === rungis.closeHour && minutes === '00'){
        rungis.setOpen(false);
    }
    /*
     * ------------------------------------------------------------------------
     * Restaurants[0] : The Batman
     * ------------------------------------------------------------------------
     */
    if (hours === restaurants[0].openHour && minutes === '00'){
        restaurants[0].setOpen(true);

    }
    if (hours === restaurants[0].closeHour && minutes === '00'){
        restaurants[0].setOpen(false);
    }
    /*
     * ------------------------------------------------------------------------
     * Restaurants[1] : The Superman
     * ------------------------------------------------------------------------
     */
    if (hours === restaurants[1].openHour && minutes === '00'){
        restaurants[1].setOpen(true);
    }
    if (hours === restaurants[1].closeHour && minutes === '00'){
        restaurants[1].setOpen(false);
    }
    /*
     * ------------------------------------------------------------------------
     * Restaurants[2] : The WonderWoman
     * ------------------------------------------------------------------------
     */
    if (hours === restaurants[2].openHour && minutes === '00'){
        restaurants[2].setOpen(true);

    }
    if (hours === restaurants[2].closeHour && minutes === '00'){
        restaurants[2].setOpen(false);
    }
});

//setTimeout(() => clearInterval(intervalTime), 15000);

