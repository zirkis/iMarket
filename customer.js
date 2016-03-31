/**
 * Created by Benjamin on 24/03/2016.
 */
'use strict';
var elm_textarea = document.getElementById('console');
var elm_clock = document.getElementById('clock');


module.exports = {
    Customer: class Customer{
        constructor(id, restaurantsList)
        {
            this.id = id;
            this.restaurantsList = restaurantsList;
            this.alreadyEaten = false;
            this.waitingResistance = Math.floor(Math.random() * (40 - 10 + 1) + 10);
        }

        setAlreadyEaten(){
            this.alreadyEaten = true;
            //this.html_textArea('Event Customer : The client number ' + this.id + ' has eaten');
        }

        tryRestaurant(){
            var chosenRestaurant = this.restaurantsList[Math.floor(Math.random() * (this.restaurantsList.length))];
            /*console.log('Event Customer : The client number ' + this.id + ' chose ' + chosenRestaurant.name);
            this.html_textArea('Event Customer : The client number ' + this.id + ' chose ' + chosenRestaurant.name);*/
            return new Promise((resolve, reject) => {
                if (chosenRestaurant.open && chosenRestaurant.isAnyReceiptAvailable()) {
                    //this.html_textArea('Event Customer : The client number ' + this.id + ' successfully entered to ' + chosenRestaurant.name);
                    resolve('Event Customer : The client number ' + this.id + ' successfully entered to ' + chosenRestaurant.name);
                    setTimeout(() => {this.chooseMeal(chosenRestaurant)
                        .then((data) => this.html_textArea(data))
                        .catch((data) => this.html_textArea(data));
                    },310);
                }

                else {
                    if (!chosenRestaurant.open){
                        //this.html_textArea('Event Customer : The client number ' + this.id + ' tried to enter to ' + chosenRestaurant.name + ' but it is closed !');
                        reject('Event Customer : The client number ' + this.id + ' tried to enter to ' + chosenRestaurant.name + ' but it is closed !');
                        setTimeout(() => {
                            this.tryRestaurant()
                            .then((data) => this.html_textArea(data))
                            .catch((data) => this.html_textArea(data));
                        }, 310);
                    }
                    else if (!chosenRestaurant.isAnyReceiptAvailable()){
                        //this.html_textArea('Event Customer : The client number ' + this.id + ' tried to enter to ' + chosenRestaurant.name + ' but they don\'t have any meal available anymore !');
                        reject('Event Customer : The client number ' + this.id + ' tried to enter to ' + chosenRestaurant.name + ' but they don\'t have any meal available anymore !');
                        setTimeout(() => {
                            this.tryRestaurant()
                            .then((data) => this.html_textArea(data))
                            .catch((data) => this.html_textArea(data));
                        }, 310);
                    }
                }
            });
        }

        chooseMeal(restaurant){
            return new Promise((resolve, reject) => {
                var chosenReceiptNumber = Math.floor(Math.random() * restaurant.getNumberOfReceipts());
                var chosenReceiptName;
                var i = 0;
                for (let j in restaurant.receipts){
                    if (i === chosenReceiptNumber){
                        chosenReceiptName = j;
                    }
                    i++;
                }
                var timeToServe = restaurant.timeToServe();
                if (restaurant.isReceiptAvailable(chosenReceiptName)){
                    restaurant.bookTheIngredients(chosenReceiptName, timeToServe);
                    //console.log('Event Restaurant : ' + chosenReceiptName + ' is available !');
                    //this.html_textArea('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName + ' and this meal is available !');
                    resolve('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName + ' and this meal is available !');
                    setTimeout(() => {restaurant.cookTheMeal(chosenReceiptName, timeToServe, this.waitingResistance, this.id); this.setAlreadyEaten();}, timeToServe*30);
                }
                else if (restaurant.isAnyReceiptAvailable()) {
                    //console.log('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but this particular meal is not available anymore !');
                    //this.html_textArea('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but this meal is not available anymore !');
                    reject('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but this meal is not available anymore !');
                    this.chooseMeal(restaurant)
                        .then((data) => this.html_textArea(data))
                        .catch((data) => this.html_textArea(data));

                }
                else if (!restaurant.isAnyReceiptAvailable()){
                    //console.log('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but there is no meal available anymore !');
                    //this.html_textArea('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but there is no meal available anymore !');
                    reject('Event Customer : The client number ' + this.id + ' wants to order ' + chosenReceiptName  + ' but there is no meal available anymore !');
                    this.tryRestaurant(this.restaurantsList)
                        .then((data) => this.html_textArea(data))
                        .catch((data) => this.html_textArea(data));
                }
            });
        }

        html_textArea(text){
            elm_textarea.innerHTML += '\n' + elm_clock.innerHTML + '| ' +text;
            if (scroll){
                elm_textarea.scrollTop = elm_textarea.scrollHeight;
            }
        }

    }
};
