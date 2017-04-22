function loop (arg, callback) {
  console.log(`do something with ${arg} and return 1 sec later`)
  // replace setTimeout with any delayed operation like IO, DB query etc
  setTimeout(function () { callback(arg * 2) }, 1000)
}

// Final task (return data / perform further operations)
function final () { console.log('Done', results) }

// A simple async series:
var items = [ 1, 2, 3, 4, 5, 6 ]
var results = []
function series (item) {
  if (item) {
    loop(item, function (result) {
      results.push(result)
      return series(items.shift())
    })
  } else {
    return final()
  }
}

series(items.shift())
