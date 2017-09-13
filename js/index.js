$('#loadRecords').hide();
var globalStore = [], 
    globalDivStore,
  displayData =  function(data){
    data = _.sortBy(data, 'number');
    if (data.length === 0) {
      $('#table-results').find("tr").slice(1).remove();
      $('#noRecords').show();
    } else {
      $('#table-results').find("tr").slice(1).remove();
      $('#noRecords').hide();
    }
      _.forEach(data, function(record){
        var newRecord = document.createElement('tr'),
            newRecordClass = document.createAttribute('class'),
            newPR = document.createElement('th'),
            newPRClass = document.createAttribute('class'),
            newTitle = document.createElement('td'),
            newTitleClass = document.createAttribute('class'),
            newUser = document.createElement('td'),
            newUserClass = document.createAttribute('class'),
            newPath = document.createElement('td'),
            newPathClass = document.createAttribute('class'),
            newState = document.createElement('th'),
            newStateClass = document.createAttribute('class');
       
        newRecordClass.value = 'backgroundColorDiv';
        newRecord.setAttributeNode(newRecordClass);
        newPRClass.value = 'PR';
        newPR.setAttributeNode(newPRClass);
        newTitleClass.value = 'title'
        newTitle.setAttributeNode(newTitleClass);
        newUserClass.value = 'user'
        newUser.setAttributeNode(newUserClass);
        newPathClass.value = 'path';
        newPath.setAttributeNode(newPathClass);
        newStateClass.value = 'path';
        newState.setAttributeNode(newStateClass);
        
        newPR.textContent = record.number;
        newTitle.textContent = record.title;
        newUser.textContent = record.user.login;
        newPath.textContent = record.url;
        newState.textContent = record.state;

       newRecord.appendChild(newPR);
       newRecord.appendChild(newTitle);
       newRecord.appendChild(newUser);
       newRecord.appendChild(newPath);
       newRecord.appendChild(newState);
        
       document.getElementById('table-results').appendChild(newRecord);
              globalDivStore = _.cloneDeep($('#table-results').find('tr'));
        
      });
  };
$('#btn-fetchRepo').on('click', function(){
  var orgName = $('#userInput1').val(),
      repoName = $('#userInput2').val();
  
  //parsing logic if any..
  
  
  // url formation..
  var url_closed_issues = 'https://api.github.com/repos/'+orgName+'/'+repoName+'/issues?state=closed',
      url_open_issues = 'https://api.github.com/repos/'+orgName+'/'+repoName+'/issues?state=open';
 
  // fetch.. open
  $('#table-results').find("tr").slice(1).remove();
  $('#noRecords').hide();
  $('#loadRecords').show();
  //Check local Storage
  globalStore = [];
  if (!_.isEmpty(JSON.parse(localStorage.getItem(orgName+'-'+repoName)))) {
      globalStore = JSON.parse(localStorage.getItem(orgName+'-'+repoName));
      displayData(_.cloneDeep(globalStore));
      $('#loadRecords').hide();
      $('#searchTitle').val('')
  } else {
  $.ajax({
    url : url_open_issues,
    type: 'GET',
    crossdomain: true,
    success: function(data){
      globalStore = _.union(globalStore, data);
      $('#searchTitle').val('')
      //displayData(_.cloneDeep(globalStore));
    },
    error: function(){
      $('#table-results').find("tr").slice(1).remove();
      $('#noRecords').show();
      $('#searchTitle').val('')
      alert('Failed!, Check the Organization & Repository Entered for Open Issues.');
    }
  });
  
    $.ajax({
    url : url_closed_issues,
    type: 'GET',
    crossdomain: true,
    success: function(data){
      globalStore = _.union(globalStore, data);
      localStorage.setItem(orgName+'-'+repoName, JSON.stringify(globalStore));
      setTimeout(function(){ localStorage.removeItem(orgName+'-'+repoName); }, 60000);
      displayData(_.cloneDeep(globalStore));
      $('#loadRecords').hide();
      $('#searchTitle').val('')
    },
    error: function(){
      $('#table-results').find("tr").slice(1).remove();
      $('#noRecords').show();
      $('#loadRecords').hide();
      $('#searchTitle').val('')
      alert('Failed!, Check the Organization & Repository Entered for Closed Issues.');
    }
  });
}
});

$('#searchTitle').on('keyup', function(){
  var searchText = this.value;
    var markedRows = [];
    var newSearchTest = new RegExp(searchText, "i");
    var records = _.cloneDeep(globalDivStore);
    records.splice(0,1);
    _.forEach(records, function(row){
	    row.style.display = 'none';
    });
    _.forEach(records, function(row){
      for(var col=0; col< (row.children).length; col++){
	      if (newSearchTest.test((row.children)[col].textContent)){
	        row.style.display = 'table-row';
          break;
        }
      }
    });
});