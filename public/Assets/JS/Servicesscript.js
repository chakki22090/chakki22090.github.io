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

];



var testimonialChangeInterval = setInterval(function() { changeTestimonial(1); }, 10000); // Change every 10 seconds

function displayTestimonial(index) {
  document.querySelector('.testimonial-text').innerText = testimonials[index].text;
  document.querySelector('.testimonial-author').innerText = testimonials[index].author;
}

function changeTestimonial(direction) {
  clearInterval(testimonialChangeInterval); // Clear interval when user manually changes testimonial
  
  currentTestimonial += direction;
  if (currentTestimonial < 0) {
    currentTestimonial = testimonials.length - 1;
  } else if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0;
  }
  
  displayTestimonial(currentTestimonial);

  // Restart the interval after changing testimonial
  testimonialChangeInterval = setInterval(function() { changeTestimonial(1); }, 10000);
}

// Initial display
displayTestimonial(currentTestimonial);