regDeviceWithUATap: function(){
	
	registerAPN(); //call to register with APN (apple push notification) which has a callback for UA registration
	
	PushNotification.prototype.notificationCallback = function (notification) {
        window.plugins.pushNotification.log("Received a notification.");
        var msg = '';
        for (var property in notification) {
            msg += property + ' : ' + notification[property] + '<br>';
        }
        message.innerHTML='notification received:<br><br>' + msg;

        alert(notification['alert']);

    };

    // when APN register succeeded
    function successCallback(e) {
		console.log('SUCCESS');
        registerUAPush(e.deviceToken, e.host, e.appKey, e.appSecret);
    }

    // when APN register failed
    function errorCallback(e) {
        console.log(e.error);
        registerButton.disabled=false;
    }

    // register button action
    function registerAPN() {

        window.plugins.pushNotification.log("Registering with APNS via the App Delegate");


        window.plugins.pushNotification.register(successCallback, errorCallback, [{ alert:true, badge:true, sound:true }]);
		
        //or unregister
        //navigator.pushNotification.register();
    }


    // register urban airship push service after APN is registered successfully
    function registerUAPush(deviceToken, host, appKey, appSecret) {

        window.plugins.pushNotification.log("Registering with Urban Airship.");

        console.log('Registering with Urban Airship Push Service...');

        // open the client and encode our URL
		$.ajax({
			url: host+'api/device_tokens/'+deviceToken,
			dataType: 'json',
			type: 'PUT',
			data: {
				"alias": "testguy"
			},
			beforeSend: function(xhr){
				console.log('authenticating...'+ btoa(appKey + ":" + appSecret));
				xhr.setRequestHeader("Authorization", "Basic " + btoa(appKey + ":" + appSecret)); //May need to use "Authorization" instead
			},
			success: function(){
				alert('success');
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert(jqXHR.status);
			}				
		});
    }
	
},