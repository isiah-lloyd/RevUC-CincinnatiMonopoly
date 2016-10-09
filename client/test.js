player_one_cash  = 1500;
player_one_position = 0;
player_two_cash = 1500;
player_two_position = 0;
current_turn = 0;
properties = {1:{name:"Dabney Hall", cost:60,owner:0}, 3:{name:'Crosley Tower', cost:60, owner:0},5:{name:'Calhoun Street', cost:200, owner:0},6:{name:'Braunstein Hall',cost:100,owner:0}, 8:{name:'Geology-Physics Building', cost:100, owner:0},9:{name:'McMicken Hall', cost:120, owner:0},11:{name:'CCM',cost:140, owner:0},13:{name:'TUC',cost:140,owner:0},14:{name:'DAAP',cost:160, owner:0},15:{name:'Clifton Ave',cost:200, owner:0},16:{name:'Swift Hall', cost:180, owner:0},18:{name:'Old Chem', cost:180, owner:0}, 19:{name:'Baldwin Hall', cost:200, owner:0}, 21:{name:'Zimmer Hall', cost:220, owner:0},23:{name:'Rhodes Hall', cost:220, owner:0},24:{name:'ERC', cost:240, owner:0},25:{name:'MLK Drive', cost:200, owner:0}, 26:{name: 'Daniels Hall', cost:260, owner:0}, 27:{name:'Siddall Hall', cost:260, owner:0},28:{name:'MarketPointe', cost:150, owner:0}, 29:{name:'Calhoun Hall', cost:280, owner:0},31:{name:'Gettler Stadium', cost:300,owner:0},32:{name:'Fifth Third Arena', cost:300, owner:0},34:{name:'Nippert Stadium', cost:320, owner:0}, 35:{name:'Jefferson Avenue', cost:200, owner:0}, 37:{name:'Bearcat Statue', cost:350, owner:0},39:{name:'Triceracopter', cost:400, owner:0}};
$('#button-group').click(function() {
    die_num_1 = Math.floor(Math.random() * 6) + 1;
    die_num_2 = Math.floor(Math.random() * 6) + 1;
    total_die = die_num_1 + die_num_2;
    switch (current_turn) {
        case 0:
        if(player_one_position == 40){
            $('#messages').text('Player 1 paid their 20BCB jail fine/');
            player_one_cash = player_one_cash - 20;
            break;
        }
            player_one_position = player_one_position + total_die;
            if (player_one_position > 40) {
                step1 = (player_one_position - 40);
                player_one_position = 0 + step1;
                $('#messages').text('Player one went past GO, collect 200BCB');
            }
            if(player_one_position in properties) {
                if(properties[player_one_position].owner === 0){
                    if(player_one_cash > properties[player_one_position].cost){
                        if(confirm('Player 1:\nBuy ' + properties[player_one_position].name +  ' for ' + properties[player_one_position].cost +' BCB')) {
                            player_one_cash = player_one_cash - properties[player_one_position].cost;
                            properties[player_one_position].owner = 1;
                            $('#messages').text('Player one just bought ' + properties[player_one_position].name + ' for ' + properties[player_one_position].cost +"BCB");
                        }
                    }
                    else {
                        $('#messages').text('Player one couldn\'t afford ' + properties[player_one_position].name + ' for ' + properties[player_one_position].cost +"BCB");
                    }
                }
                if(properties[player_one_position].owner === 2) {
                    player_two_cash = player_two_cash + properties[player_one_position].cost;
                    player_one_cash = player_one_cash - properties[player_one_position].cost;
                    $('#messages').text('Player one just landed on ' + properties[player_one_position].name + ' and owes Player 2 ' + properties[player_one_position].cost +"BCB");
                }
            }
            if(player_one_position == 30){
                $('#messages').text('Player one got caught underage drinking, go staight to jail; do not pass GO, do not collect 200BCB');
                player_one_position = 40;
            }
            current_turn = 1;
            $('#p2container').css('color', 'yellow');
            $('#p1container').css('color', 'white');
            break;
        case 1:
        if(player_one_position == 40){
            $('#messages').text('Player 1 paid their 20BCB jail fine/');
            player_one_cash = player_one_cash - 20;
            break;
        }
        player_two_position = player_two_position + total_die;
        if (player_one_position > 40) {
            step1 = (player_one_position - 40);
            player_one_position = 0 + step1;
            $('#messages').text('Player two went past GO, collect 200BCB');

        }
        if(player_two_position in properties) {
            if(properties[player_two_position].owner === 0){
                if(player_two_cash > properties[player_two_position].cost){
                    if(confirm('Player 2: \nBuy ' + properties[player_two_position].name +  ' for ' + properties[player_two_position].cost +' BCB')) {
                        player_two_cash = player_two_cash - properties[player_two_position].cost;
                        properties[player_two_position].owner = 2;
                        $('#messages').text('Player two just bought ' + properties[player_two_position].name + ' for ' + properties[player_two_position].cost +"BCB");
                    }
                }
                else {
                    $('#messages').text('Player two couldn\'t afford ' + properties[player_one_position].name + ' for ' + properties[player_one_position].cost +"BCB");
                }
            }
        }
        if(player_two_position == 30){
            $('#messages').text('Player two got caught underage drinking, go staight to jail; do not pass GO, do not collect 200BCB');
            player_one_position = 40;
        }
            if(properties[player_two_position].owner === 1) {
                player_one_cash = player_one_cash + properties[player_two_position].cost;
                player_two_cash = player_two_cash - properties[player_two_position].cost;
                $('#messages').text('Player two just landed on ' + properties[player_one_position].name + ' and owes Player 1 ' + properties[player_one_position].cost +"BCB");
            }
            current_turn = 0;
            $('#p1container').css('color','yellow');
            $('#p2container').css('color','white');
            break;
    }

});
