//Add local storage and variable editing

var AstroBot = {
                obj: [],
                data: [],
                Information: {
                        Version: 0.1,
                        BotName: "AstroBot",
                },
                Resources: {
                        SongCount: 0,
                        history_counter: [],
                        history_counter2: [],
                        CheckUsername: null,
                        CheckID: null,
                        divArray: [],
                },
                Settings: {
                        AutoWoot: true,
                        Stats: true,
                        WelcomeMessage: false,
                        CheckInterval: 10,
                        SocialMedia: true,
                        HistorySkip: true,
                        
                },
                Events: {
                        AutoWoot: function(){
                                if (AstroBot.Settings.AutoWoot){
                                        $("#woot").click();
                                }
                        },
                        Stats: function(){
                                if (AstroBot.Settings.Stats){
                                        API.sendChat("/me " + AstroBot.obj.lastPlay.dj.attributes.username + 
                                                        " Played " + AstroBot.obj.lastPlay.media.attributes.author + AstroBot.obj.lastPlay.media.attributes.title +
                                                        " | Woots: " + AstroBot.obj.lastPlay.score.positive + 
                                                        " | Mehs: " + AstroBot.obj.lastPlay.score.negative + 
                                                        " | Curates: " + AstroBot.obj.lastPlay.score.curates);
                                }
                        },
                        Welcome: function(){
                                if (AstroBot.Settings.WelcomeMessage){
                                        API.sendChat("Hello! @" + AstroBot.data.username + " Welcome to Scientist Wanted! Please make sure to consult the rules before playing!");
                                        Astrobot.NormalArray.Rules();
                                }
                        },
                        SocialMedia: function(){
                                if (AstroBot.Settings.SocialMedia){
                                        if (AstroBot.Resources.SongCount<AstroBot.Settings.CheckInterval){
                                                AstroBot.Resources.SongCount++;
                                        }
                                        else if (AstroBot.Resources.Check===AstroBot.Settings.CheckInterval){
                                                API.sendChat("Follow Scientists Wanted: https://www.facebook.com/groups/ScientistsWanted/ - https://twitter.com/ScientistWanted - https://soundcloud.com/scientistswanted");
                                                AstroBot.Resources.SongCount=0;
                                        }
                                }
                        },
                        HistoryCheck: function(){
                                if (AstroBot.Settings.HisotrySkip){
                                        for (i in _.range(50)){
                                                i++;
                                                if (API.getHistory()[i-1].media.id===API.getMedia().id){
                                                        AstroBot.Resources.history_counter ++;
                                                        AstroBot.Resources.history_counter2 += " | " + i + "/50 ";
                                                }
                                                if (i===50 && AstroBot.Resources.history_counter>0){
                                                        API.SendChat("This song is in history " + AstroBot.Resources.history_counter + " time(s)! " + AstroBot.Resources.history_counter2);
                                                        API.sendChat("This song will now be skipped!");
                                                        API.moderateForceSkip();
                                                        AstroBot.Resources.history_counter = [];
                                                        AstroBot.Resources.history_counter2 = [];
                                                }
                                        }
                                }
                        }
                },
                HandyFunctions: {
                        CheckUsername: function(){
                                for (i in _.range(API.getUsers().length)){
                                        if (API.getUsers()[i].username === AstroBot.data.message.substr(7).trim()){
                                                API.sendChat("Username: " + i);
                                                AstroBot.Resources.CheckUsername = API.getUsers()[i].username;
                                                break;
                                        }
                                }
                        },
                        GetID: function(){
                                for(i in _.range(API.getUsers().length)){
                                        if(API.getUsers()[i].username == AstroBot.data.message.substr(7).trim()){
                                                API.sendChat("GetID: " + i);
                                                AstroBot.Resources.CheckID = API.getUsers()[i].id;
                                                break;
                                        }
                                }
                        }
                },
                NormalArray: {
                        Rules: function(){API.sendChat("/me The rules can be found here: http://goo.gl/M4cgIF");},
                        Op: function(){API.sendChat("/me The OP list can be found here: http://goo.gl/Rdds3c");},
                        Faq: function(){API.sendChat("/me The FAQ's can be found here: http://goo.gl/KF7sN0");},
                        Ping: function(){API.sendChat("/me Pong!");},
                        Eta: function(){API.sendChat("/me @" + AstroBot.data.from + " I have no clue how long you have to wait, gawsh!");}
                },
                ResidentArray: {
                        Theme: function(){API.sendChat("/me We prefer EDM (Electronic Dance Music), but anything can be played as long as it abides by our rules!");},
                        Crap: function(){API.sendChat("/me [" + AstroBot.data.from + "] Flagged this video for poor quality. Do not play such a terrible tune again!");},
                        Commands: function(){API.sendChat("/me {" + AstroBot.data.from + "} The commands list can be found here: http://goo.gl/Svitgl");},
                        Meh: function(){API.sendChat("/me [" + AstroBot.data.from + "] Has forced me to meh!"); $("#meh").click();},
                        Settings: function(){
                                API.sendChat("/me Settings:");
                                for (i in AstroBot.Settings){
                                        API.sendChat(i + ": " + AstroBot.Settings[i]);
                                }
                        }
                },
                BouncerArray: {
                        Skip: function(){API.sendChat("/me [" + AstroBot.data.from + "] Has forced me to skip the current song!");API.moderateForceSkip();},
                        Ban: function(){
                                AstroBot.HandyFunctions.CheckUsername();
                                AstroBot.HandyFunctions.GetID();
                                if(AstroBot.Resources.CheckUsername !== null){
                                        if(API.getUser(AstroBot.Resources.CheckID).permission === 0){
                                                API.sendChat("/me [" + AstroBot.data.from + "] Used ban!");
                                                API.moderateBanUser(getUserId(AstroBot.data.message.substr(7).trim()), 1, API.BAN.DAY);
                                                }
                                        else{API.sendChat("/me [" + AstroBot.data.from + "] "+ AstroBot.Information.BotName + " refuses to ban people with ranks!");}
                                }
                                else{API.sendChat("/me [" + AstroBot.data.from + "] I don't see " + AstroBot.data.message.substr(7).trim() + " in the room." );}
                                AstroBot.Resources.CheckUsername  = null;
                                AstroBot.Resources.CheckID = null;
                        },
                        Kick: function(){ 
                                AstroBot.HandyFunctions.CheckUsername();
                                AstroBot.HandyFunctions.GetID();
                                if(AstroBot.Resources.CheckUsername !== null){
                                        if(API.getUser(AstroBot.Resources.CheckID).permission === 0){
                                                API.sendChat("/me [" + AstroBot.data.from + "] Used kick!");
                                                API.moderateBanUser(getUserId(AstroBot.data.message.substr(7).trim()), 1, API.BAN.HOUR);
                                                }
                                        else{API.sendChat("/me [" + AstroBot.data.from + "] "+ AstroBot.Information.BotName + " refuses to kick people with ranks!");}
                                }
                                else{API.sendChat("/me [" + AstroBot.data.from + "] I don't see " + AstroBot.data.message.substr(7).trim() + " in the room." );}
                                AstroBot.Resources.CheckUsername  = null;
                                AstroBot.Resources.CheckID = null;
                        }
                },
                ManagerArray: {
                        Toggle: function(){
                                //AutoWoot Toggle
                                if (AstroBot.data.message.substr(8).trim()==="AutoWoot" && AstroBot.Settings.AutoWoot){API.sendChat("/me AutoWoot is now disabled!"); AstroBot.Settings.AutoWoot = false;}
                                else if (AstroBot.data.message.substr(8).trim()==="AutoWoot" && !AstroBot.Settings.AutoWoot){API.sendChat("/me AutoWoot is now enabled!"); AstroBot.Settings.AutoWoot = true;}
                                //Stats Toggle
                                else if (AstroBot.data.message.substr(8).trim()==="Stats" && AstroBot.Settings.Stats){API.sendChat("/me Stats are now disabled!"); AstroBot.Settings.Stats = false;}
                                else if (AstroBot.data.message.substr(8).trim()==="Stats" && !AstroBot.Settings.Stats){API.sendChat("/me Stats are now enabled!"); AstroBot.Settings.Stats = true;}
                                //WelcomeMessage Toggle
                                else if (AstroBot.data.message.substr(8).trim()==="WelcomeMessage" && AstroBot.Settings.WelcomeMessage){API.sendChat("/me Welcome Messages are now disabled!"); AstroBot.Settings.WelcomeMessage = false;}
                                else if (AstroBot.data.message.substr(8).trim()==="WelcomeMessage" && !AstroBot.Settings.WelcomeMessage){API.sendChat("/me Welcome Messages are now enabled!"); AstroBot.Settings.WelcomeMessage = true;}
                        },
                        Disable: function(){
                                API.off(API.CHAT),
                                API.off(API.DJ_ADVANCE),
                                API.off(API.USER_JOIN),
                                API.sendChat("Bot killed!");
                        },
                        Reload: function(){
                                API.off(API.CHAT),
                                API.off(API.DJ_ADVANCE),
                                API.off(API.USER_JOIN);
                                $.getScript("https://googledrive.com/host/0B7i3ZWcsXbnWYmNDeW9pTW9HZEE");
                        },
                }
};
(function(){
        //API.on Bank
        API.on(API.CHAT, chat);
        API.on(API.DJ_ADVANCE, advance);
        API.on(API.USER_JOIN, user_join);
        //API.on(API.ROOM_SCORE_UPDATE, scoreUpdate);
        //API.on(API.CHAT_COMMAND, insideCommand);
        //Event Listeners.
        function user_join(data){
                AstroBot.data = data;
                AstroBot.Events.Welcome();
        }
        function advance(obj){
                AstroBot.obj = obj;
                AstroBot.Events.Stats();
                AstroBot.Events.AutoWoot();
                AstroBot.Events.SocialMedia();
                AstroBot.Events.HistoryCheck();
        }
        function chat(data){
                AstroBot.data = data;
                if(data.message.indexOf("!") == 0) commands(data);
        }
        function commands(data){
                API.moderateDeleteChat(data.chatID);
                var role = API.getUser(data.fromID).permission;
                
                if (role !== null){
                        if (role >= 0){
                                switch(data.message){
                                case "!rules": AstroBot.NormalArray.Rules(); break;
                                case "!op": AstroBot.NormalArray.Op(); break;
                                case "!faq": AstroBot.NormalArray.Faq(); break;
                                case "!ping": AstroBot.NormalArray.Ping(); break;
                                case "!eta": AstroBot.NormalArray.Eta(); break;
                                }       
                        }
                        if (role >= 1){
                                switch(data.message){
                                case "!theme": AstroBot.ResidentArray.Theme(); break;
                                case "!128": AstroBot.ResidentArray.Crap(); break;
                                case "!commands": AstroBot.ResidentArray.Commands(); break;
                                case "!meh": AstroBot.ResidentArray.Meh(); break;
                                case "!settings": AstroBot.ResidentArray.Settings(); break;
                                }
                        }
                        if (role >= 2){
                                if (data.message.substring(1,5)==="ban") AstroBot.BouncerArray.Ban();
                                if (data.message.substring(1,5)==="kick") AstroBot.BouncerArray.Kick();
                                switch(data.message){
                                case "!skip": AstroBot.BouncerArray.Skip(); break;
                                }
                        }
                        if (role >= 3){
                                if (data.message.substring(1,7)==="toggle") AstroBot.ManagerArray.Toggle(); 
                                switch(data.message){
                                case "!disable": AstroBot.ManagerArray.Disable(); break;
                                case "!reload!": AstroBot.ManagerArray.Reload(); break;
                                }       
                        }
                }
        }

}());
API.sendChat(AstroBot.Information.BotName + " " + AstroBot.Information.Version + " is now running!");
//API.setVolume(0);
