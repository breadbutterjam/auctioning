let TEAM_CAPACITY_TOTAL = 10;
let TEAM_CAPACITY_BOYS = 8;
let TEAM_CAPACITY_GIRLS = 2;



function onBodyLoad()
{
    // alert("A")
    console.log("A");
    init();
    AddeventListeners();
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
    getAvailablePlayers();
    getAvailableMarqueePlayers();

    addTeamDetails();
    
}

function AddeventListeners()
{
    $("#btn-generate-another").on("click", GenerateAnotherClicked)
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

    addPlayerDetails(playerObject);
}

function getAvailablePlayers()
{
    let len = data.players.length;

    for (var i=0; i<len; i++)
    {
        if (data.players[i].status === "available")
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
    strHTML_body += '<div><b>Selected:</b>' + teamObject.selected.total;
    if (teamObject.selected.total > 0)
    {
        strHTML_body += ' [' + teamObject.selected.boys + ' boys ' + teamObject.selected.girls + ' girls]'   
    }   
    strHTML_body += '</div>'; 

    
    let remaining_total = TEAM_CAPACITY_TOTAL - teamObject.selected.total;
    let remaining_boys = TEAM_CAPACITY_BOYS - teamObject.selected.boys;
    let remaining_girls = TEAM_CAPACITY_GIRLS - teamObject.selected.girls;
    strHTML_body += '<div><b>Remaining:</b>' + remaining_total + ' [' + remaining_boys + ' boys ' + remaining_girls + ' girls]';
    strHTML_body +=  '</div>';


    strHTML_body += '<div><b>Balance:</b>' + teamObject.remainingPurse + 'credits</div>';

    let maxBid = teamObject.remainingPurse - remaining_total * 100;
    strHTML_body += '<div><b>Max bid:</b>' + maxBid +' credits</div>'

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

}

function generateRandomNumber(maxNumber)
{
    let retunVal;
    
    retunVal = Math.round(Math.random() * maxNumber);

    return retunVal;
}