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
 * Class : Customer
 * ------------------------------------------------------------------------
 */
module.exports = {
  Customer: class Customer {
    constructor(id, restaurantsList) {
      this.id = id;
      this.restaurantsList = restaurantsList;
      this.alreadyEaten = false;
      this.waitingResistance = Math.floor(Math.random() * (40 - 10 + 1) + 10);
    }

    setAlreadyEaten() {
      this.alreadyEaten = true;
    }

    tryRestaurant() {
      var chosenRestaurant = this.restaurantsList[Math.floor(Math.random() *
        (this.restaurantsList.length))];
      return new Promise((resolve, reject) => {
        if (chosenRestaurant.open && chosenRestaurant.isAnyReceiptAvailable()) {
          resolve('Event Customer : The client number ' + this.id +
            ' successfully entered to ' + chosenRestaurant.name);
          setTimeout(() => {
            this.chooseMeal(chosenRestaurant)
              .then((data) => this.HtmlTextArea(data))
              .catch((data) => this.HtmlTextArea(data));
          }, 310);
        } else {
          if (!chosenRestaurant.open && ElmClock.innerHTML.substr(0,2) < 23) {
            reject('Event Customer : The client number ' + this.id +
              ' tried to enter to ' + chosenRestaurant.name +
              ' but it is closed !');
            setTimeout(() => {
              this.tryRestaurant()
                .then((data) => this.HtmlTextArea(data))
                .catch((data) => this.HtmlTextArea(data));
            }, 310);
          } else if (!chosenRestaurant.isAnyReceiptAvailable() &&
              ElmClock.innerHTML.substr(0,2) < 23) {
            reject('Event Customer : The client number ' + this.id +
              ' tried to enter to ' + chosenRestaurant.name +
              ' but they don\'t have any meal available anymore !');
            setTimeout(() => {
              this.tryRestaurant()
                .then((data) => this.HtmlTextArea(data))
                .catch((data) => this.HtmlTextArea(data));
            }, 310);
          }
        }
      });
    }

    chooseMeal(restaurant) {
      return new Promise((resolve, reject) => {
        var chosenReceiptNumber = Math.floor(Math.random() *
          restaurant.getNumberOfReceipts());
        var chosenReceiptName;
        var i = 0;
        /*jshint -W089 */
        for (let j in restaurant.receipts) {
          if (i === chosenReceiptNumber) {
            chosenReceiptName = j;
          }
          i++;
        }
        var timeToServe = restaurant.timeToServe();
        if (restaurant.isReceiptAvailable(chosenReceiptName)) {
          restaurant.bookTheIngredients(chosenReceiptName, timeToServe);
          resolve('Event Customer : The client number ' + this.id +
            ' wants to order ' + chosenReceiptName +
            ' and this meal is available !');
          setTimeout(() => {
            restaurant.cookTheMeal(chosenReceiptName, timeToServe,
              this.waitingResistance, this.id);
            this.setAlreadyEaten();
          }, timeToServe * 30);
        } else if (!restaurant.isReceiptAvailable(chosenReceiptName) &&
          restaurant.isAnyReceiptAvailable()) {
          reject('Event Customer : The client number ' + this.id +
            ' wants to order ' + chosenReceiptName +
            ' but this meal is not available anymore !');
          setTimeout(() => {
            this.chooseMeal(restaurant)
              .then((data) => this.HtmlTextArea(data))
              .catch((data) => this.HtmlTextArea(data));
          }, 50);

        } else if (!restaurant.isReceiptAvailable(chosenReceiptName) &&
          !restaurant.isAnyReceiptAvailable()) {
          reject('Event Customer : The client number ' + this.id +
            ' wants to order ' + chosenReceiptName +
            ' but there is no meal available anymore !');
          setTimeout(() => {
            this.tryRestaurant(this.restaurantsList)
              .then((data) => this.HtmlTextArea(data))
              .catch((data) => this.HtmlTextArea(data));
          }, 50);
        }
      });
    }

    HtmlTextArea(text) {
      ElmTextarea.innerHTML += '\n' + ElmClock.innerHTML + '| ' + text;
      if (scroll) {
        ElmTextarea.scrollTop = ElmTextarea.scrollHeight;
      }
    }


  }
};
