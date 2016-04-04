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
const market = new importMar.Market('Rungis');
const restaurants = [
    new importRes.Restaurant('The Batman',9,16,market),
    new importRes.Restaurant('The Superman',11,19,market), 
    new importRes.Restaurant('Wonder Woman',14,23,market)
 ];
var clients = [];
/*
 * ------------------------------------------------------------------------
 * HTML : Clock, Calendar, Text Area, Clients Counter
 * ------------------------------------------------------------------------
 */
const elm_textarea = document.getElementById('console');
const elm_clock = document.getElementById('clock');
const elm_calendar = document.getElementById('calendar');
const elm_client = document.getElementById('client');
/*
 * ------------------------------------------------------------------------
 * HTML : Text Area Updates
 * ------------------------------------------------------------------------
 */
scroll = true;
elm_textarea.onfocus = function(){
    scroll = false;
}
elm_textarea.onblur = function(){
    scroll = true;
}
var html_textArea = function(text){
    elm_textarea.innerHTML += '\n' + elm_clock.innerHTML + '| ' +text;
    if (scroll){
        elm_textarea.scrollTop = elm_textarea.scrollHeight;
    }
}
/*
 * ------------------------------------------------------------------------
 * HTML : Initialization
 * ------------------------------------------------------------------------
 */
document.getElementById(restaurants[0].name).innerHTML = restaurants[0].name;
document.getElementById(restaurants[0].name+'4').innerHTML = restaurants[0].displayStocks(restaurants[0].ingredients);
document.getElementById(restaurants[0].name+'6').innerHTML = restaurants[0].openHour + ':00 - ' + restaurants[0].closeHour + ':00';
document.getElementById(restaurants[1].name).innerHTML = restaurants[1].name;
document.getElementById(restaurants[1].name+'4').innerHTML = restaurants[1].displayStocks(restaurants[1].ingredients);
document.getElementById(restaurants[1].name+'6').innerHTML = restaurants[1].openHour + ':00 - ' + restaurants[1].closeHour + ':00';
document.getElementById(restaurants[2].name).innerHTML = restaurants[2].name;
document.getElementById(restaurants[2].name+'4').innerHTML = restaurants[2].displayStocks(restaurants[2].ingredients);
document.getElementById(restaurants[2].name+'6').innerHTML = restaurants[2].openHour + ':00 - ' + restaurants[2].closeHour + ':00';
document.getElementById(market.name).innerHTML = market.name;
document.getElementById(market.name+'4').innerHTML = market.displayStocks(market.stocks);
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
 * Signal
 * ------------------------------------------------------------------------
 */
const intervalTime = setInterval(() => emitterTime.emit('signal', (i += 10) % 60),300);
let i = 0;
/*
 * ------------------------------------------------------------------------
 * Counters
 * ------------------------------------------------------------------------
 */
var hours = 0, minutes = 0, day = 1, id = 0, numberOfClients = 0;
/*
 * ------------------------------------------------------------------------
 * Events
 * ------------------------------------------------------------------------
 */
emitterTime.on('signal', (unit) => {
    /*
     * ------------------------------------------------------------------------
     * Minutes, Hours, Days Update & Display
     * ------------------------------------------------------------------------
     */
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
    elm_clock.innerHTML = hours + ':' + minutes;
    /*
     * ------------------------------------------------------------------------
     * Automatic Scroll of the Text Area
     * ------------------------------------------------------------------------
     */
    if (scroll){
        elm_textarea.scrollTop = elm_textarea.scrollHeight;
    }
    /*
     * ------------------------------------------------------------------------
     * Reopening of the restaurants after going to the market if possible
     * ------------------------------------------------------------------------
     */
    for (let e = 0; e < restaurants.length; e++){
        if (!restaurants[e].open && restaurants[e].isAnyReceiptAvailable() && hours > restaurants[e].openHour && hours < restaurants[e].closeHour){
            restaurants[e].setOpen(true);
        }
    }
    /*
     * ------------------------------------------------------------------------
     * Creation of Customers & Clients Counter Update
     * ------------------------------------------------------------------------
     */
    if (minutes == 20 && hours >= 9 && hours < 23){
        var numberRandom = Math.floor(Math.random() * 3);
        for(let i=0; i<numberRandom; i++){
            clients.push(new importCus.Customer(id, restaurants));
            clients[id].tryRestaurant()
                .then((data) => html_textArea(data))
                .catch((data) => html_textArea(data));
            id++;
            numberOfClients++;
            elm_client.innerHTML = 'Clients' + '</br>' + numberOfClients;
        }
    }
    /*
     * ------------------------------------------------------------------------
     * Removal of the clients who have already eaten & Clients Counter Update
     * ------------------------------------------------------------------------
     */
    for (let j in clients){
        if(clients[j].alreadyEaten){
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
    if (hours === market.openHour-1 && minutes === '00'){
        market.fillStocks();
    }
    else if (hours === market.openHour && minutes === '00'){
        market.setOpen(true);
    }
    else if (hours === market.closeHour && minutes === '00'){
        market.setOpen(false);
    }
    /*
     * ------------------------------------------------------------------------
     * Restaurants[0] : The Batman
     * ------------------------------------------------------------------------
     */
    if (hours === restaurants[0].openHour && minutes === '00'){
        restaurants[0].setOpen(true);

    }
    else if (hours === restaurants[0].closeHour && minutes === '00'){
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
    else if (hours === restaurants[1].closeHour && minutes === '00'){
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
    else if (hours === restaurants[2].closeHour && minutes === '00'){
        restaurants[2].setOpen(false);
    }
});

//setTimeout(() => clearInterval(intervalTime), 15000);

