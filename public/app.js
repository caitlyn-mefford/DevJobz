const cowsay = require('cowsay');
const Quote = require('inspirational-quotes');


$('#job-search').on('submit', async (event) => {
  event.preventDefault()
  try {
      const response = await fetch('/job-search', {
          method: "POST",
          body: JSON.stringify({
              description: $('#description').val(),
              fulltime: $('#fulltime').is(':checked')
          })
      })
      const { results } = await response.json()
      renderJobList(results)
  } catch (error) {
      console.error(error)
  }
})
function renderJobList(jobList) {
  $('#cow').remove()
  $('#results').empty()
  jobList.forEach(job => {
      $('#results').append(createJobsHTML(job))
  })
}
const createJobsHTML = (job) => { 
  return $(`
    <div class="card" style="width: 35rem;">
    <div class="card-body">
    <img src="${job.company_logo}" width="100px" height="100px"/>
    <h5 class="card-company"><a href="${job.company_url}"></a>${job.company}</h5>
    <p class="card-location">${job.location}</p>
    <p class="card-type">Job Type: ${job.type}</p>
    <ul class="list-group">
        <li class="list-item">Title: ${job.title}</li>
        <li class="list-item">Location: ${job.description}</li>
        <li class="list-item">${job.how_to_apply}</li> 
    </ul>
    </div>
    </div>
    `)
};
 renderJobList();

async function fetchQuote() {
    const response = await fetch('/cowspiration');
    const { cow } = await response.json();
  
    $('#results').empty().append($(`<pre>${ cow }</pre>`))
  }
  
  fetchQuote();

  server.post('/job-search', async (req, res) => {
    try {
      const { description, fulltime } = req.body;
      const URL = `https://jobs.github.com/positions.json?${
        description ? `description=${ description }&` : ''
      }${
        fulltime ? 'fulltime=true' : ''
      }`;
      const { data } = await axios.get(URL);
      res.send({ results: data });
    } catch (error) {
      res.send({ error });
    }
  });
  server.get('/cowspiration', (req, res) => {
    const {text, author} = Quote.getQuote()
    const cow = cowsay.say({
      text: `${text}\n\n- ${author}`,
      W: 80,
    });
    res.send({cow})
  });


  async function fetchWeather() {
    if (!navigator || !navigator.geolocation) {
      $('#weather').append($('<h3>Weather not available on this browser</h3>'))
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { coords: { latitude, longitude } } = position;
  
      const response = await fetch(`/weather?lat=${ latitude }&lon=${ longitude }`);
      const { results } = await response.json();
  
      if (results.daily) {
        $('#weather').empty();
  
        results.daily.forEach(day => {
          const { weather: [{ icon }] } = day;
  
          $('#weather').append($(`
            <img src="http://openweathermap.org/img/wn/${ icon }@2x.png" />
          `));
        });
      }
    }, async (error) => {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      if (result.state == "denied") {
        $('#weather').html(
          $(`<div>
              <h3>You have denied access to location services.</h3>
              <h4>If you wish to see your forecast, update your settings and refresh.</h4>
            </div>`)
        )
      }
    });
  }
  
  fetchWeather();