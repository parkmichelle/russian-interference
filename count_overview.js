import { CountUp } from './node_modules/countup.js/dist/countUp.js';

$('#counter-accounts').waypoint(function(direction){
  let counter = new CountUp('counter-accounts', 454);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

$('#counter-tweets').waypoint(function(direction){
  let counter = new CountUp('counter-tweets', 203482);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

$('#counter-mentions').waypoint(function(direction){
  let counter = new CountUp('counter-mentions', 33162);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

$('#counter-days').waypoint(function(direction){
  let counter = new CountUp('counter-days', 1170);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

$('#counter-favorites').waypoint(function(direction){
  let counter = new CountUp('counter-favorites', 2061661);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

$('#counter-retweets').waypoint(function(direction){
  let counter = new CountUp('counter-retweets', 2302521);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});


$('#counter-retweets').waypoint(function(direction){
  let counter = new CountUp('counter-retweets', 2302521);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});


$('#counter-impact').waypoint(function(direction){
  let counter = new CountUp('counter-impact', 4362182);
  if (!counter.error) {
    counter.start();
  } else {
    console.error(counter.error);
  }
},{
  //bottom-in-view ensures event is thrown 
  // when the element's bottom crosses bottom of viewport.
  offset: 'bottom-in-view'
});

