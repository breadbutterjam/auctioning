let TEAM_CAPACITY_TOTAL = 10;
let TEAM_CAPACITY_BOYS = 8;
let TEAM_CAPACITY_GIRLS = 2;

let currentBiddingTeam;
let currentlyBiddingPlayer;

function onBodyLoad()
{
    // alert("A")
    console.log("A");
    init();
    AddeventListeners();
    // $("#btn-sold")[0].disabled = true;
}

function Players()
{
    let oThis = this;
    this.setName = function(name)
    {
        oThis.name = name;
    }

    
}

let marqueePlayers = [];
let availablePlayers = [];

function init()
{
    loadDataFromLocalStorage();

    getAvailablePlayers();
    getAvailableMarqueePlayers();

    addTeamDetails();
    
}

function loadDataFromLocalStorage()
{
    if (localStorage.auctionData)
    {
        data = JSON.parse(localStorage.auctionData)
    }
    else
    {
        saveToLocalStorage();
    }
}

function saveToLocalStorage()
{
    localStorage.auctionData = JSON.stringify(data)
}

function AddeventListeners()
{
    $("#btn-generate-another").on("click", GenerateAnotherClicked);

    $('.team-details').on("click", TeamClicked);

    $("#btn-unsold").on("click", UnsoldClicked);

    $("#btn-sold").on("click", SoldClicked);
}

function SoldClicked(event)
{
    let player = availablePlayers[currentlyBiddingPlayer];
    player.status = "sold";
    availablePlayers.splice(currentlyBiddingPlayer, 1);

    let bidValue = Number($('.bid-amount')[0].value);

    AddPlayerToTeam(player, currentBiddingTeam, bidValue);

    ResetTeamSelection();

    GenerateAnotherClicked();

    saveToLocalStorage();
}

function AddPlayerToTeam(playerObject, TeamObject, bidValue)
{

    //depending on the gender of the player to be added, update the value in the team object
    let gender = playerObject.gender;
    if (gender === "Male")
    {
        currentBiddingTeam.selected.boys += 1;
    }
    else
    {
        currentBiddingTeam.selected.girls += 1;
    }

    //update total players in the team
    currentBiddingTeam.selected.total += 1;


    //add player 
    currentBiddingTeam.selected.playerIDs.push(playerObject.playerID)


    //add bid details
    let detailsObject = {
        "playerID": playerObject.playerID,
        "bid": bidValue,
        "name": playerObject.name
    }
    currentBiddingTeam.selected.details.push(detailsObject)

    //update remaining purse value
    currentBiddingTeam.remainingPurse -= bidValue;
    
    //update dabba
    updateTeamDetailsDabba();

}


function UnsoldClicked(event)
{
    let player = availablePlayers[currentlyBiddingPlayer];
    player.status = "unsold";
    availablePlayers.splice(currentlyBiddingPlayer, 1);

    saveToLocalStorage();

    GenerateAnotherClicked()
}

function TeamClicked(event)
{
    //console.log(event.currentTarget);
    let team = event.currentTarget;
    let teamID = team.querySelectorAll('h3')[0].textContent;
    
    if($(team).hasClass("currently-bidding-team"))
    {
        ResetTeamSelection();
    }
    else
    {
        $('.bid-amount').focus();
        SetCurrentBiddingTeam(teamID);
    }
}

function ResetTeamSelection()
{
    $('.currently-bidding-team').removeClass("currently-bidding-team");
    currentBiddingTeam = "";

}

function SetCurrentBiddingTeam(teamID)
{   
    ResetTeamSelection();
    $("#" + teamID).addClass("currently-bidding-team");
    currentBiddingTeam = data.teams[teamID];
}

function GenerateAnotherClicked(event)
{
    let numberOfPlayersInPool;
    let randomIndex;
    let PlayerObject;
    
    let pool;

    if (document.getElementById("generate-only-marquee").checked)
    {
        pool = marqueePlayers;
        
    }
    else
    {
        pool = availablePlayers;
    }

    numberOfPlayersInPool = pool.length;
    randomIndex = generateRandomNumber(numberOfPlayersInPool - 1);
    playerObject = pool[randomIndex]; 

    currentlyBiddingPlayer = randomIndex;

    addPlayerDetails(playerObject);

    updateTeamStatus();
}

function updateTeamStatus()
{
    let teams = data.teams;
    let numberOfTeams = teams.length;
    
    let teamNow;

    let bidValue = Number($('.bid-amount')[0].value);
    let currentPlayerobject = availablePlayers[currentlyBiddingPlayer]

    for (let i=0; i<numberOfTeams; i++)
    {
        teamNow = teams[i];

        //check if the current bid exceeds max limit for any team


        //check if the number of boys / girls in the team has already reached max 

    }
}

function getAvailablePlayers()
{
    let len = data.players.length;

    for (var i=0; i<len; i++)
    {
        if (data.players[i].status === "Available")
        {
            availablePlayers.push(data.players[i])
        }
    }
}

function getAvailableMarqueePlayers()
{
    let len = data.players.length;

    for (var i=0; i<len; i++)
    {
        if (data.players[i].isMarque && data.players[i].status === "available")
        {
            marqueePlayers.push(data.players[i])
        }
    }
}

function addTeamDetails()
{
    $("#teams").html("");

    let teams = data.teams;

    for (const key of Object.keys(teams)) {
        if (typeof(teams[key]) === "object")
        {
            addTeamDetailDabba(teams[key]);
        }
    }
}

function updateTeamDetailsDabba(teamObject)
{
    if(teamObject === undefined)
    {
        teamObject = currentBiddingTeam;
    }

    let teamsContainer = $("#teams");
    let teamToUpdateElem = $("#" + teamObject.id);

    let totalSelected = teamObject.selected.total;

    //update selected count
    teamToUpdateElem.find('.selected-total')[0].textContent = totalSelected;

    teamToUpdateElem.find('.selected-boys')[0].textContent = teamObject.selected.boys;
    teamToUpdateElem.find('.selected-girls')[0].textContent = teamObject.selected.girls;
    
    if(teamObject.selected.total === 0)
    {
        teamToUpdateElem.find('.selected-boys-girls-details').addClass("empty");
    }
    else
    {
        teamToUpdateElem.find('.selected-boys-girls-details').removeClass("empty");
    }


    //update remaining counts
    let remaining_total = TEAM_CAPACITY_TOTAL - totalSelected;
    let remaining_boys = TEAM_CAPACITY_BOYS - teamObject.selected.boys;
    let remaining_girls = TEAM_CAPACITY_GIRLS - teamObject.selected.girls;

    teamToUpdateElem.find('.remaining-total')[0].textContent = remaining_total;
    teamToUpdateElem.find('.remaining-boys')[0].textContent = remaining_boys;
    teamToUpdateElem.find('.remaining-girls')[0].textContent = remaining_girls;
    
    //update balance7
    teamToUpdateElem.find('.balance')[0].textContent = teamObject.remainingPurse;

    let maxBid = teamObject.remainingPurse - remaining_total * 100;
    teamToUpdateElem.find('.max-bid')[0].textContent = maxBid;

}

function addTeamDetailDabba(teamObject)
{
    {/* <span class="team-details" id="team1">
			<h3>Team 1</h3>
			<div><b>Selected:</b>0</div>
			<div><b>Remaining:</b>10 [8 boys 2 girls]</div>
			<div><b>Balance:</b>10,000 credits</div>
			<div><b>max bid:</b>9,000 credits</div>
        </span> */}
        
    let teamsContainer = $("#teams");
    let strHTML = "";
    
    let strHTMLspan = '<span class="team-details" id="' + teamObject.id + '">';
    let strHTMLspan_end = '</span>';

    let strHTML_body = '<h3>' + teamObject.id + '</h3>';
    strHTML_body += '<div><b>Selected:</b> <span class="selected-total">' + teamObject.selected.total + '</span>';
    
    let emptyClass = "empty";
    
    if (teamObject.selected.total > 0)
    {
        emptyClass = ""
    }   

    strHTML_body += '<span class="selected-boys-girls-details ' + emptyClass + '"> [<span class="selected-boys">' + teamObject.selected.boys + '</span> boys <span class="selected-girls">' + teamObject.selected.girls + '</span> girls]</span>'   
        
    strHTML_body += '</div>'; 

    
    let remaining_total = TEAM_CAPACITY_TOTAL - teamObject.selected.total;
    let remaining_boys = TEAM_CAPACITY_BOYS - teamObject.selected.boys;
    let remaining_girls = TEAM_CAPACITY_GIRLS - teamObject.selected.girls;
    strHTML_body += '<div><b>Remaining:</b> <span class="remaining-total">' + remaining_total + '</span> [<span class="remaining-boys">' + remaining_boys + '</span> boys <span class="remaining-girls">' + remaining_girls + '</span> girls]';
    strHTML_body +=  '</div>';


    strHTML_body += '<div><b>Balance:</b> <span class="balance">' + teamObject.remainingPurse + '</span>credits</div>';

    let maxBid = teamObject.remainingPurse - remaining_total * 100;
    strHTML_body += '<div><b>Max bid:</b><span class="max-bid">' + maxBid +'</span> credits</div>'

    strHTML = strHTMLspan + strHTML_body + strHTMLspan_end;
    teamsContainer.append(strHTML);
}


function addPlayerDetails(playerObject)
{
    {/* <h1 id="current-player-name">John Oliver</h1>
		<h3 id="isMarqueePlayer">marquee player</h3>
        <span id="player-notes">part of u-19 mumbai</span> */}
        
    let playerDetailsContainer = $("#player-details");
    let strHTML;
    
    strHTML = '<h1 id="current-player-name">' + playerObject.name + '</h1>';
    if (playerObject.isMarque)
    {
        strHTML += '<h3 id="isMarqueePlayer">marquee player</h3>';
    }
    
    strHTML += '<h3 id="player-gender">' + playerObject.gender + ' </h3>'

    if (playerObject.notes.length > 0)
    {
        strHTML += '<span id="player-notes">' + playerObject.notes + '</span>';
    }

    
    playerDetailsContainer.html(strHTML);

    let basePrice = playerObject.basePrice;
    $('.bid-amount')[0].value = basePrice;
    ResetTeamSelection();
}

function generateRandomNumber(maxNumber)
{
    let retunVal;
    
    retunVal = Math.round(Math.random() * maxNumber);

    return retunVal;
}
// ================================ADMIN ONLY=========================
function getIndexFromAvailablePlayer(name)
{
    let len = availablePlayers.length;
    let ret = [];
    for (let i=0; i<len; i++)
    {
        if (availablePlayers[i].name.toLowerCase().indexOf(name.toLowerCase()) > -1)
        {
            ret.push({"i": i, "playerObject": availablePlayers[i]});
        }
    }

    return ret;
}


function addUnsoldToPool()
{
    let numPlayers = data.players.length;
    let unsoldPlayers = getUnsoldPlayers();


    //change status of unsold players and add them to available pool. 
    let numOfUnsoldPlayers = unsoldPlayers.length;
    for(let i=0; i<numOfUnsoldPlayers; i++)
    {
        unsoldPlayers[i].status = "Available";
        availablePlayers.push(unsoldPlayers[i]);
    }

}


function getUnsoldPlayers()
{
    let numPlayers = data.players.length;
    let unsoldPlayers = [];
    let playerObject;
    for (let i=0; i<numPlayers; i++)
    {
        playerObject = data.players[i];
        if (playerObject.status === "unsold")
        {
            unsoldPlayers.push(playerObject);
        }
    }

    return unsoldPlayers;
}