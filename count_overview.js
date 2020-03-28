import { CountUp } from './node_modules/countup.js/dist/countUp.js';

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

