
// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')
const { Console } = require('console')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!

  // After testing, I have realized that the current parameter inputs in the API are case senstitive and require full match. For exmaple, I cannot type "com" or "COMEDY" for the genre "Comedy" in the CSV file. I have utilized includes in order to be able to display a movie that has the genre input in the parameter even if it has more than one genre (as long as the input has been properly written). I would like to learn how to make the inputs not require an exact match. 

  // Create variable for year and genre to store the parameters.
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  

 
  //First, check whether if either of the year or genre variables are undefined. I have found that the only way results with no genres to appear-i.e. when the genres is \\N - is if the user inputs "\N" or "\" as the genre parameter input as this is the vlaue in CSV. Tehrefore, I am also blocking the input "\N" in order to make sure that these results do not come up. It appears that there should be no other way that results with no genre can appear. However, I am not sure how to get filter out from here; I have instead added it to the final IF statement before the push below. 
  
  if (year == undefined || genre == undefined ) {
    // If they are underfined, provide an error message. 
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Error: no information found! Please include year and genre parameters :)` // a string of data displaying the error message
    }
  }

  // Second, if year and genre are both defined, create an new array to be returned by the API with two key-value pairs - numResults and movies. 
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // Loop through all movies. 
    for (let i=0; i < moviesFromCsv.length; i++) {
      // Store each movie from the csv in memory.
      let movie = moviesFromCsv[i]
      // Create a new movie Object containing the following fields: primary title; release year; genres.  
      let movieObject = {
        primaryTitle: movie.primaryTitle,
        releaseYear: movie.startYear,
        genres: movie.genres
      }
    
      // Filter by year and genre parameters. Make sure genre input includes all movies that have at least the genre input associated with it. Remove outputs with runtime = \\N. 
      if(movie.startYear == year && movie.genres.includes(genre) && movie.runtimeMinutes != '\\N' && movie.genres != '\\N'){
        
        // Add (push) the movie object to the new array. 
        returnValue.movies.push(movieObject)
      }
    }

    // Increase the numResults attribute by the length of the movies attribute after IF statements. 
    returnValue.numResults = returnValue.movies.length

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // stringified version of the result
    }
  }
}