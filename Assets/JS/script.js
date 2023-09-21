window.addEventListener('load', function() {
    function initClient() {
      gapi.client.init({
        apiKey: 'AIzaSyBlF8m0HQdlUJlQTM-faW4Ot7wL9KGiJfU',
        clientId: '487982267194-9712tlg70bh8nts9jj4je5lotf69e78f.apps.googleusercontent.com',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
      }).then(() => {
        loadBlogs();
      }).catch(error => {
        console.error("Well, shit hit the fan: ", error);
      });
    }
    
    function loadBlogs() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '12k6Asi5tJNTG8YcdqatETSZES-aqA0gqxeDR58b-aJI',
        range: 'Sheet1:A:B'
      }).then(response => {
        let rows = response.result.values;
        let blogContainer = document.querySelector('.blog-container');
        if (rows) {
          rows.forEach(row => {
            let blogEntry = `
              <div class="blog-post">
                <h2>${row[0]}</h2>
                <p>${row[1]}</p>
              </div>
            `;
            blogContainer.innerHTML += blogEntry;
          });
        } else {
          blogContainer.innerHTML = "It's empty like your soul.";
        }
      }).catch(error => {
        console.error("Well, you fucked up: ", error);
      });
    }
    
    gapi.load('client:auth2', initClient);
  });
  