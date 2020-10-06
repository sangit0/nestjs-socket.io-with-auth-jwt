var socket = io();
let selectChatUser = null;

if (getToken()) {
  socket.on('connect', () => {
    socket.emit('subscribe', getUser().user._id);
  });
}

$(document).ready(function() {
  if (getToken()) {
    getFriends();

    socket.on('messageReceive', function(msg) {
      insertOtherChat(msg.message);
    });
  }
});

function sendMessage(toUser) {
  if (getToken()) {
    if (!$('#chatMessage').val()) {
      return;
    }
    const message = {
      from_user: getUser().user._id,
      to_user: toUser,
      message: $('#chatMessage').val(),
    };
    socket.emit('messageToUser', message);
    insertMyChat(message.message);
    saveChat(message);
    $('#chatMessage').val('');
  }
}
function sentRequest() {
  if (getToken()) {
    let user = getUser();
    let toUser = $('#friendUsername').val();
    if (toUser) {
      $.ajax({
        type: 'GET',
        url: `chats/sent-request/${toUser}`,
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + user.accessToken);
        },
        success: function() {
          getFriends();
        },
        error: function(xhr, status, errorThrown) {
          alert(xhr.responseText);
        },
      });
    }
  }
}
function getFriends() {
  if (getToken()) {
    $('#chatFriends').html(getLoader());

    let user = getUser();
    $.ajax({
      type: 'GET',
      url: `/chats/friends`,
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.accessToken);
      },
      success: function(json) {
        generateFriendsHtml(json);
      },
      error: function(xhr, status, errorThrown) {
        alert(xhr.responseText);
      },
    });
  }
}

function saveChat(data) {
  if (getToken()) {
    let user = getUser();
    $.ajax({
      type: 'POST',
      url: `/chats`,
      data: data,
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.accessToken);
      },
      success: function(json) {},
      error: function(xhr, status, errorThrown) {
        alert(xhr.responseText);
      },
    });
  }
}
function loadChat(id, name) {
  if (getToken()) {
    let user = getUser();
    insertChartBox(id);

    if (getToken()) {
      socket.emit('subscribe', getUser().user._id);
    }
    $('#chatPanel').html(getLoader());
    $('#userSelected').html(' with ' + name);

    $.ajax({
      type: 'GET',
      url: `/chats/${id}`,
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.accessToken);
      },
      success: function(json) {
        if (json.length) {
          $('#chatPanel').html('');

          json.forEach(element => {
            if (element.from_user === getUser().user._id) {
              insertMyChat(element.message);
            } else {
              insertOtherChat(element.message);
            }
          });
        } else {
          $('#chatPanel').html(' <code>No chat head is selected</code>');
        }
      },
      error: function(xhr, status, errorThrown) {
        alert(xhr.responseText);
      },
    });
  }
}
function accpectReq(id) {
  if (getToken()) {
    let user = getUser();
    $.ajax({
      type: 'GET',
      url: `/chats/approve-request/${id}`,
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + user.accessToken);
      },
      success: function(json) {
        getFriends();
      },
      error: function(xhr, status, errorThrown) {
        alert(xhr.responseText);
      },
    });
  }
}
function insertChartBox(id) {
  $('#chatBox').html(`<div class="col s12">
  
    <div class="input-field col s9">
      <input
        placeholder="Type your message here "
        id="chatMessage"
        type="text"
        class="validate"
      />
    </div>
    <div class="input-field col s3">
      <button
        class="btn waves-effect waves-light btn-small indigo btn-block"
        type="button"
        onclick="sendMessage('${id}')"
      >
        <i class="material-icons white-text">SEND</i>
      </button>
    </div>
  </div>`);
}

function insertOtherChat(message) {
  $('#chatPanel').append(` 
  <div class="row left-align">
  <div class="col s12 m8 l6 left">
    <div class="row valign-wrapper">
      <div
        class="col "
        style="margin-top:-22px; margin-right:-10px;"
      >
        <i class="material-icons circle  responsive-img"
          >account_circle</i
        >
      </div>
      <div class="chat-other red">
        <span class="chat-message white-text">${message.trim('')}</span>
        <div class="arrowToOther"></div>
      </div>
  </div></div>
  </div>`);
}
function insertMyChat(message) {
  $('#chatPanel').append(` 
  <div class="row right-align">
				<div class="col s12 m8 l6 right">
            <div class="row valign-wrapper">
            
            <div class="col s2" >
            <i class="material-icons circle  responsive-img">account_circle</i>
            </div>
							<div class="chat-me grey">
								<span class="chat-message white-text">
									${message.trim('')}
								</span>
								<div class="arrowToMe"></div>  
							</div>
						</div>
					
				</div>
            
			</div>`);
}
function clearAll() {
  $('#chatFriends').html('No Friends to show');
  $('#chatPanel').html('');
  $('#chatBox').html(`<div class="col s9">
  <code>No user selected</code>
</div>`);
}

function generateFriendsHtml(friends) {
  if (!friends.length) {
    $('#chatFriends').html('No Friends to show');
    return;
  }
  let html = ` <ul class="collection">`;
  friends.forEach(item => {
    html += `<li class="collection-item">
    <i class="material-icons">account_circle</i>
    <span class="title">${item.id.username}</span>
   ${
     item.approved
       ? `<button class="secondary-content" 
      onclick="loadChat('${item.id._id}','${item.id.username}')"
      ><i class="material-icons">chat</i></button
    >`
       : `<small>${
           item.need_approval
             ? `
            <button
            class="btn waves-effect waves-light btn-small indigo btn-block"
            type="button"
            onclick="accpectReq('${item._id}')"
          >
          Receive
          </button>
       
       `
             : 'Request Sent'
         }</small>`
   }
  </li>`;
  });

  html += '</ul>';

  $('#chatFriends').html(html);
}

function getLoader() {
  return ` <div class="preloader-wrapper small active">
  <div class="spinner-layer spinner-green-only">
    <div class="circle-clipper left">
      <div class="circle"></div>
    </div><div class="gap-patch">
      <div class="circle"></div>
    </div><div class="circle-clipper right">
      <div class="circle"></div>
    </div>
  </div>
</div>`;
}
