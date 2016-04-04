'use strict';
/*
 * ------------------------------------------------------------------------
 * HTML : Clock,Text Area
 * ------------------------------------------------------------------------
 */
const ElmTextarea = document.getElementById('console');
const ElmClock = document.getElementById('clock');
/*
 * ------------------------------------------------------------------------
 * Class : Market
 * ------------------------------------------------------------------------
 */
module.exports = {
  Market: class Market {
    constructor(name) {
      this.name = name;
      this.open = false;
      this.openHour = 5;
      this.closeHour = 14;
      this.restaurantsProvided = 0;
      this.stocks = {
        Ham: 100,
        Beef: 100,
        Cheese: 100,
        Tomato: 100,
        Salmone: 100,
        Lettuce: 100
      };
    }

    setOpen(bool) {
      this.open = bool;
      this.HtmlTextArea('Event Market : ' + this.name +
        ' is ' + this.getOpen());
      document.getElementById(this.name + '2').innerHTML = this.getOpen();
    }

    getOpen() {
      if (this.open) {
        document.getElementById(this.name + '0').style.border =
          '5px green solid';
        document.getElementById(this.name + '0').style.opacity = '1';
        return 'OPEN';
      } else {
        document.getElementById(this.name + '0').style.border =
          '5px red solid';
        document.getElementById(this.name + '0').style.opacity = '0.5';
        return 'CLOSED';
      }
    }

    fillStocks() {
      /*jshint -W089 */
      for (let i in this.stocks) {
        this.stocks[i] += 25;
      }
      this.HtmlTextArea('Event Market : ' + this.name +
        ' filled its stocks from producers.');
      document.getElementById(this.name + '4').innerHTML =
        this.displayStocks(this.stocks);
    }

    emptyStocks() {
      /*jshint -W089 */
      for (let i in this.stocks) {
        this.stocks[i] -= 10;
      }
      this.restaurantsProvided++;
      document.getElementById(this.name + '3').innerHTML =
        'Restaurants Provided : ' + this.restaurantsProvided;
      document.getElementById(this.name + '4').innerHTML =
        this.displayStocks(this.stocks);
    }


    HtmlTextArea(text) {
      ElmTextarea.innerHTML += '\n' + ElmClock.innerHTML + '| ' + text;
      if (scroll) {
        ElmTextarea.scrollTop = ElmTextarea.scrollHeight;
      }
    }

    displayStocks(json) {
      var list = '';
      /*jshint -W089 */
      for (let i in json) {
        list += i + ' : ' + json[i] + ' ';
      }
      list = list.substring(0, list.length - 1);
      document.getElementById(this.name + '4').innerHTML = list;
      return list;
    }
  }
};
