var currentTestimonial = 0;
var testimonials = [
  {
    text: "It's been great working with Conquest Communications Canada. Their advice along the ways to strategically improve our business - from social media input, to technical insights for our website, to overall business strategy - has been invaluable. Highly recommend their services!",
    author: "-Hayley Mundeva, CEO of ThriveHire-"
  }, 
  {
    text: "Jim is the best and i love working with him!!!!",
    author: "-Charlie Weir, Great guy-"
  }, 
  {
    text: "The Conquest Communications team worked closely with us to ensure that our needs and our ideas were reflected in our website relaunch. Conquest has a wealth of experience and the technical know-how to get the job done. They listened closely to our ideas and worked with us to implement them. Our new website is a tool that works for our users and we can easily keep it up to date using our internal resources. Website traffic increased with the relaunch and we received positive feedback from users on the clarity and professionalism of our site. Many thanks to Jim Sheppard and the Conquest team",
    author: "-Michael Smart, co-director, Finances of the Nation-"
  }, 

];



var testimonialChangeInterval = setInterval(function() { changeTestimonial(1); }, 10000);  

function displayTestimonial(index) {
  document.querySelector('.testimonial-text').innerText = testimonials[index].text;
  document.querySelector('.testimonial-author').innerText = testimonials[index].author;
}

function changeTestimonial(direction) {
  clearInterval(testimonialChangeInterval); 
  
  currentTestimonial += direction;
  if (currentTestimonial < 0) {
    currentTestimonial = testimonials.length - 1;
  } else if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0;
  }
  
  displayTestimonial(currentTestimonial);

  testimonialChangeInterval = setInterval(function() { changeTestimonial(1); }, 10000);
}

displayTestimonial(currentTestimonial);






