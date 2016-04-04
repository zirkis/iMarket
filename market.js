'use strict';
/*
 * ------------------------------------------------------------------------
 * HTML : Clock,Text Area
 * ------------------------------------------------------------------------
 */
const elm_textarea = document.getElementById('console');
const elm_clock = document.getElementById('clock');
/*
 * ------------------------------------------------------------------------
 * Class : Market
 * ------------------------------------------------------------------------
 */
module.exports = {
    Market: class Market
    {
        constructor(name)
        {
            this.name = name;
            this.open = false;
            this.openHour = 5;
            this.closeHour = 14;
            this.restaurantsProvided = 0;
            this.stocks = {
                Ham : 100,
                Beef : 100,
                Cheese : 100,
                Tomato : 100,
                Salmone : 100,
                Lettuce : 100
            };
        }

        setOpen(bool){
            this.open = bool;
            this.html_textArea('Event Market : ' + this.name + " is " + this.getOpen());
            document.getElementById(this.name + '2').innerHTML = this.getOpen();
        }

        getOpen(){
            if (this.open){
                document.getElementById(this.name + '0').style.border = '5px green solid';
                document.getElementById(this.name + '0').style.opacity = '1';
                return 'OPEN'
            }
            else{
                document.getElementById(this.name + '0').style.border = '5px red solid';
                document.getElementById(this.name + '0').style.opacity = '0.5';
                return 'CLOSED'
            }
        }

        fillStocks(){
            for (let i in this.stocks){
                this.stocks[i] += 50;
            }
            this.html_textArea('Event Market : ' + this.name + ' filled its stocks from producers.');
            document.getElementById(this.name+'4').innerHTML = this.displayStocks(this.stocks);
        }

        emptyStocks(){
            for (let i in this.stocks){
                this.stocks[i] -= 5;
            }
            this.restaurantsProvided++;
            document.getElementById(this.name+'3').innerHTML = 'Restaurants Provided : ' + this.restaurantsProvided;
            document.getElementById(this.name+'4').innerHTML = this.displayStocks(this.stocks);
        }

        html_textArea(text){
            elm_textarea.innerHTML += '\n' + elm_clock.innerHTML + '| ' +text;
            if (scroll){
                elm_textarea.scrollTop = elm_textarea.scrollHeight;
            }
        }

        displayStocks(json){
            var list = '';
            for (let i in json){
                list += i + ' : ' + json[i] + ' ';
            }
            list = list.substring(0,list.length-1);
            document.getElementById(this.name + '4').innerHTML = list;
            return list;
        }
    }
};
