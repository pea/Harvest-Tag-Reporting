'use strict'

const parseName = (name) => {
  var match = name.match(/(\[(.*?)\])|(?!$) \S(.*?)+/g);

  if (match == null) {
    return false;
  }

  var match = match.reverse();
  var name = match[0];
  match.splice(0, 1);
  var i = 0;
  var tags = [];
  while(typeof(match[i]) !== 'undefined'){
    tags.push(match[i].replace(/[\[\]']+/g, ''));
    i++;
  }
  return {
    name: name.trim(),
    tags: tags.reverse()
  };
}

module.exports = parseName
