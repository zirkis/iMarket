'use strict';
var Promise = require('bluebird');
/*
 * ------------------------------------------------------------------------
 * HTML : Clock,Text Area
 * ------------------------------------------------------------------------
 */
const ElmTextarea = document.getElementById('console');
const ElmClock = document.getElementById('clock');
/*
 * ------------------------------------------------------------------------
 * Class : Restaurant
 * ------------------------------------------------------------------------
 */
module.exports = {
  Restaurant: class Restaurant {

    constructor(name, openHour, closeHour, market) {
      this.name = name;
      this.open = false;
      this.openHour = openHour;
      this.closeHour = closeHour;
      this.score = 0;
      this.client = 0;
      this.market = market;
      this.ingredients = {
        Ham: 2,
        Beef: 3,
        Cheese: 5,
        Tomato: 6,
        Salmone: 2,
        Lettuce: 3
      };
      this.receipts = {
        'Veggie Pizza': ['Cheese', 'Lettuce', 'Tomato'],
        'Beef Pizza': ['Beef', 'Cheese', 'Tomato'],
        'Salmone Pizza': ['Salmone', 'Cheese', 'Lettuce'],
        'Margarita Pizza': ['Lettuce', 'Ham', 'Tomato']
      };
    }

    setOpen(bool) {
      this.open = bool;
      this.HtmlTextArea('Event Restaurant : ' + this.name +
        ' is ' + this.getOpen());
      document.getElementById(this.name + '2').innerHTML = this.getOpen();
    }

    getOpen() {
      if (this.open) {
        document.getElementById(this.name + '0').style.opacity = '1';
        return 'OPEN';
      } else {
        document.getElementById(this.name + '0').style.opacity = '0.5';
        return 'CLOSED';
      }
    }

    getNumberOfReceipts() {
      var numberReceipts = 0;
      /*jshint -W089 */
      /*jshint unused:false*/
      for (let i in this.receipts) {
        numberReceipts++;
      }
      return numberReceipts;
    }

    fillStocks() {
      /*jshint -W089 */
      for (let i in this.ingredients) {
        this.ingredients[i] += 10;
      }
    }

    isReceiptAvailable(receipt) {
      var ok = true;
      /*jshint -W089 */
      for (let i in this.receipts[receipt]) {
        if (this.ingredients[this.receipts[receipt][i]] === 0) {
          ok = false;
        }
      }
      return ok;
    }

    isAnyReceiptAvailable() {
      var isAny = false;
      var isAvail = false;
      /*jshint -W089 */
      for (let i in this.receipts) {
        isAvail = this.isReceiptAvailable(i);
        if (isAvail) {
          isAny = true;
          break;
        }
      }
      return isAny;
    }

    timeToServe() {
      var servingTime = Math.floor(Math.random() * (50 - 5 + 1) + 5);
      return servingTime;
    }

    timeToFillStocks() {
      var fillingTime = Math.floor(Math.random() * (75 - 15 + 1) + 15);
      return fillingTime;
    }

    bookTheIngredients(receipt, timeToServe) {
      /*jshint -W089 */
      for (let i in this.receipts[receipt]) {
        this.ingredients[this.receipts[receipt][i]] -= 1;
      }
      if (!this.isAnyReceiptAvailable()) {
        setTimeout(() => {
          this.setOpen(false);
          this.goToMarket()
            .then((data) => this.HtmlTextArea(data))
            .catch((data) => this.HtmlTextArea(data));
        }, timeToServe * 30 + 100);
      }
    }

    cookTheMeal(receipt, timeToServe, waitingResistance, id) { //id à remettre
      var bonus = 1;
      if (timeToServe <= waitingResistance - 10) {
        bonus += 1;
      } else if (timeToServe >= waitingResistance + 5) {
        bonus -= 1;
      }
      bonus *= (24 - (this.closeHour - this.openHour));
      this.score += bonus;
      this.HtmlTextArea('Event Restaurant : ' + this.name +
        ' cooked the meal ' + receipt + ' for client number ' + id + ' !' +
        ' Time to serve : ' + timeToServe +
        'min, Customer waiting resistance : ' +
        waitingResistance + 'min. ' + this.name + ' got +' + bonus + 'pt(s) !');
      this.displayStocks(this.ingredients);
      this.client += 1;
      document.getElementById(this.name + '5').innerHTML =
        'Score : ' + this.score;
      document.getElementById(this.name + '3').innerHTML =
        'Clients : ' + this.client;
    }

    goToMarket() {
      return new Promise((resolve, reject) => {
        this.HtmlTextArea('Event Restaurant : ' + this.name +
          ' arrived at ' + this.market.name);
        document.getElementById(this.name + '2').innerHTML = 'Market';
        document.getElementById(this.name + '0').style.border =
          '2px green solid';
        var timeToFill = this.timeToFillStocks();
        if (this.market.open) {
          setTimeout(() => {
            this.HtmlStatus('CLOSED');
            this.fillStocks();
            this.market.emptyStocks();
            this.displayStocks(this.ingredients);
            resolve('Event Restaurant : ' + this.name +
              ' filled its stocks at ' + this.market.name +
              ' in ' + timeToFill + 'min.');
          }, timeToFill * 30);
        } else {
          this.HtmlStatus('CLOSED');
          //jscs:disable maximumLineLength
          reject('Event Restaurant : ' + this.name +
            ' tried to fill its stocks but ' +
            this.market.name + ' is close !');
          setTimeout(() => {
            this.goToMarket()
              .then((data) => this.HtmlTextArea(data))
              .catch((data) => this.HtmlTextArea(data));
          }, 5405);
        }
      });
    }


    HtmlTextArea(text) {
      ElmTextarea.innerHTML += '\n' + ElmClock.innerHTML + '| ' + text;
      if (scroll) {
        ElmTextarea.scrollTop = ElmTextarea.scrollHeight;
      }
    }

    HtmlStatus(text) {
      document.getElementById(this.name + '2').innerHTML = text;
      document.getElementById(this.name + '0').style.border =
        '2px #404040 solid';
    }

    displayStocks(json) {
      var list = '';
      /*jshint -W089 */
      for (let i in json) {
        list += i + ' : ' + json[i] + '</br>';
      }
      document.getElementById(this.name + '4').innerHTML = list;
      return list;
    }

  }
};
