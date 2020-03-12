import { CountUp } from './node_modules/countup.js/dist/countUp.js';

$('#counter').waypoint(function(direction){
  let counter = new CountUp('counter', 6000043);
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
