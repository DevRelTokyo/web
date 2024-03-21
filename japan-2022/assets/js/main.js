"use strict";

const ncmb = new NCMB('a62f86a8619ebbe39f54d35a8ae5b7276365a16c2ac6af63f043a6221025c190', '753e7193dafe9a9eb132dfb103ab91d16c6e9b0df97c7b95ab785ce28e96f603');

/* ======= Header animation ======= */   
const header = document.getElementById('header');  

window.onload=function() 
{   
    headerAnimation(); 

};

window.onresize=function() 
{   
    headerAnimation(); 

}; 

window.onscroll=function() 
{ 
    headerAnimation(); 

}; 
    

function headerAnimation () {
    var scrollTop = window.scrollY;
	if ( scrollTop > 100 ) {	    
	    header.classList.add('header-shrink');
	} else {
	    header.classList.remove('header-shrink');
	}

};

/* ===== Smooth scrolling ====== */
/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
/* Ref: https://github.com/iamdustan/smoothscroll */


let scrollLinks = document.querySelectorAll('.scrollto');
const pageNavWrapper = document.getElementById('navigation');

scrollLinks.forEach((scrollLink) => {

	scrollLink.addEventListener('click', (e) => {
		
		e.preventDefault();

		let element = document.querySelector(scrollLink.getAttribute("href"));
		
		const yOffset = 69; //page .header height
		
		//console.log(yOffset);
		
		const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
		
		window.scrollTo({top: y, behavior: 'smooth'});
		
		
		//Collapse mobile menu after clicking
		if (pageNavWrapper.classList.contains('show')){
			pageNavWrapper.classList.remove('show');
		}

		
    });
	
});
    

/* ===== Gumshoe SrollSpy ===== */
/* Ref: https://github.com/cferdinandi/gumshoe  */
// Get the sticky header


// Initialize Gumshoe
var spy = new Gumshoe('#navigation a', {
	offset: 69 //page .header heights
});


/* ======= Countdown ========= */
// set the date we're counting down to
var target_date = new Date("2022/08/06 13:00").getTime();
 
// variables for time units
var days, hours, minutes, seconds;
 
// get tag element
var countdown =  document.getElementById("countdown-box");
if (countdown) {
    var days_span = document.createElement("SPAN");
    days_span.className = 'days';
    countdown.appendChild(days_span);
    var hours_span = document.createElement("SPAN");
    hours_span.className = 'hours';
    countdown.appendChild(hours_span);
    var minutes_span = document.createElement("SPAN");
    minutes_span.className = 'minutes';
    countdown.appendChild(minutes_span);
    var secs_span = document.createElement("SPAN");
    secs_span.className = 'secs';
    countdown.appendChild(secs_span);
    
    // update the tag with id "countdown" every 1 second
    setInterval(function () {
    
        // find the amount of "seconds" between now and target
        var current_date = new Date().getTime();
        var seconds_left = (target_date - current_date) / 1000;
    
        // do some time calculations
        days = parseInt(seconds_left / 86400);
        seconds_left = seconds_left % 86400;
        
        hours = parseInt(seconds_left / 3600);
        seconds_left = seconds_left % 3600;
        
        minutes = parseInt(seconds_left / 60);
        seconds = parseInt(seconds_left % 60);
        
        // format countdown string + set tag value.
        days_span.innerHTML = '<span class="number">' + days + '</span>' + '<span class="unit">日</span>';
        hours_span.innerHTML = '<span class="number">' + hours + '</span>' + '<span class="unit">時間</span>';
        minutes_span.innerHTML = '<span class="number">' + minutes + '</span>' + '<span class="unit">分</span>';
        secs_span.innerHTML = '<span class="number">' + seconds + '</span>' + '<span class="unit">秒</span>'; 
    
    }, 1000);
}

document.addEventListener('DOMContentLoaded', e => {
    const form = document.querySelector('form#proposal');
    if (form) {
        saveInput();
        sendProposal();
    }
});

const saveInput = () => {
    for (const key of [1, 2]) {
        let storage = localStorage.getItem(`save${key}`);
        if (storage) {
            storage = JSON.parse(storage);
            for (const name in storage) {
                const ele = document.querySelector(`form#proposal [name="${name}"]`);
                if (ele) ele.value = storage[name];
            }
        }
        const eles = document.querySelectorAll(`form#proposal [data-save="${key}"]`);
        eles.forEach(ele => {
            ele.addEventListener('keyup', e => {
                let storage = localStorage.getItem(`save${key}`);
                if (!storage) {
                    storage = {};
                } else {
                    storage = JSON.parse(storage);
                }
                const { name, value } = e.target;
                storage[name] = value;
                localStorage.setItem(`save${key}`, JSON.stringify(storage));
            });
        });
    }
}
const sendProposal = () => {
    const form = document.querySelector('form#proposal');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const params = {};
        Array.prototype.slice.call(form.elements).forEach(ele => {
            const { name, type, value } = ele;
            if (name === '') return;
            params[name] = value;
            if (type === 'checkbox' && value !== 'on') {
                alert('同意していないチェックボックスがあります');
                return;
            }
        });
        const Proposal = ncmb.DataStore('Proposal');
        const proposal = new Proposal;
        for (const key in params) {
            proposal.set(key, params[key]);
        }
        await proposal.save();
        localStorage.removeItem('save2');
        const eles = document.querySelectorAll(`form#proposal [data-save="2`);
        eles.forEach(e => e.value = '');
        alert('プロポーザルありがとうございます！')
    })
}