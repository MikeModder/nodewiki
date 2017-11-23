let bcrypt = require('bcryptjs');

function findByUsername(db, username){
  let user;
  db.get('', function(rows){

  })
  return user;
}

function insertUser(db, user){
  
  db.run('', function(err){
    if(err) return false;
    return true;
  })
}
