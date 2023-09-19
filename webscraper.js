const cheerio = require('cheerio');
const fs = require('fs');
const https = require('https'); // or 'https' for https:// URLs
var exec = require('child_process').exec;

var list = [];

fetch('https://www.nomoreransom.org/en/decryption-tools.html').then(function (response) {
	// The API call was successful!
	return response.text();
}).then(function (html) {
	// This is the HTML from our response as a text string
    const $ = cheerio.load(html);
    
    $('a[title=download]').each(function (i, elem) {
        list[i] = {
            url: $(this).attr("href"), 
            name: $(this).parent().parent().parent().parent().parent().first().first().text().split("\n                                ")[1].replace(/ /g,"_"),
            guideurl: $(this).parent().parent().find("a[title='how-to guide']").attr("href")}

    });

    console.log(
       list
      )

      fs.writeFile('./output.txt', JSON.stringify(list), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
      for(i in list){
        if(!isValidUrl(list[i].guideurl)){
            list[i].guideurl = `https://www.nomoreransom.org/${list[i].guideurl}`
        }
        let mkdir = `mkdir files/${list[i].name}`
        let command = `cd "./files/${list[i].name}/" && wget "${list[i].url}" && wget "${list[i].guideurl}"`
        child = exec(mkdir, function(error, stdout, stderr){

            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            
            if(error !== null)
            {
                console.log('exec error: ' + error);
            }   
        }); 
        child = exec(command, function(error, stdout, stderr){

            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            
            if(error !== null)
            {
                console.log('exec error: ' + error);
            }   
        }); 
    }
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});


const isValidUrl = urlString=> {
	  	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	  return !!urlPattern.test(urlString);
	}

