



 
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("myBtn").style.display = "block";
  } else {
    document.getElementById("myBtn").style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}



// Get modal element
var modal = document.getElementById('requestQuoteModal');

// Get open modal button
var btn = document.getElementsByClassName('btn-request')[0];

// Get close button
var span = document.getElementsByClassName('close')[0];

// Listen for open click
btn.onclick = function() {
    modal.style.display = 'block';
}

// Listen for close click
span.onclick = function() {
    modal.style.display = 'none';
}

// Listen for outside click
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}



