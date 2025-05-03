/*
 Source: Coding train. Daniel Shiffman
 https://codingtrain.github.io/Monty-Hall/
*/

const doors = [];

let totalDoors = 3;

let state = "PICK";
let pickedDoor;

let autoMode = false;
let timeoutId;

let stats = {
  totalSwitchPlays: 0,
  totalStayPlays: 0,
  totalSwitchWins: 0,
  totalStayWins: 0,
};

function getDelayValue() {
  const speedSlider = select("#speed-slider");
  return speedSlider.elt.max - speedSlider.value();
}

function clearStats() {
  stats = {
    totalSwitchPlays: 0,
    totalStayPlays: 0,
    totalSwitchWins: 0,
    totalStayWins: 0,
    totalPlayed: 0
  };
  clearStorage();
  updateStats();
}

function reset() {
  for (const door of doors) {
    door.prize = "🐐";
    door.revealed = false;
    select(".door", door).html(door.index + 1);
    door.removeClass("revealed");
    door.removeClass("picked");
    door.removeClass("won");
  }

  const winner = random(doors);
  winner.prize = "💵";

  state = "PICK";
  select("#instruction > p").html("Pick a Door!");
  select("#instruction > .choices").hide();
  select("#instruction > #play-again").hide();

  if (autoMode) {
    timeoutId = setTimeout(pickDoor, getDelayValue());
  }
}

function updateStats() {
  const switchWinRate =
    nf((100 * stats.totalSwitchWins) / stats.totalSwitchPlays || 0, 2, 1) + "%";
  select("#stats #switches .total").html(stats.totalSwitchPlays);
  select("#stats #switches .bar").style("width", switchWinRate);
  select("#stats #switches .bar .win-rate").html(switchWinRate);

  const stayWinRate =
    nf((100 * stats.totalStayWins) / stats.totalStayPlays || 0, 2, 1) + "%";
  select("#stats #stays .total").html(stats.totalStayPlays);
  select("#stats #stays .bar").style("width", stayWinRate);
  select("#stats #stays .bar .win-rate").html(stayWinRate);
  
  const played = stats.totalSwitchPlays + stats.totalStayPlays;
  select("#stats #played .total").html(played);
}

function checkWin(hasSwitched) {
  for (const door of doors) {
    door.addClass("revealed");
    select(".content", door).html(door.prize);
  }

  if (pickedDoor.prize === "💵") {
    pickedDoor.addClass("won");
    if (hasSwitched) {
      stats.totalSwitchWins++;
    } else {
      stats.totalStayWins++;
    }
    select("#instruction > p").html("You win!");
  } else {
    select("#instruction > p").html("You lose!");
  }

  if (autoMode) {
    timeoutId = setTimeout(reset, getDelayValue());
  } else {
    select("#instruction > #play-again").show();
  }

  updateStats();
  storeItem("montey-hall-stats", stats);
  
}

function chooseDoor(hasSwitched = false) {
  select("#instruction > .choices").hide();

  if (hasSwitched) {
    stats.totalSwitchPlays++;
    const newPick = doors.find(
      (door) => !door.hasClass("revealed") && !door.hasClass("picked")
    );
    newPick.addClass("picked");
    pickedDoor.removeClass("picked");
    pickedDoor = newPick;
  } else {
    stats.totalStayPlays++;
  }

  if (autoMode) {
    select("#instruction > p").html(hasSwitched ? "Switch!" : "Stay!");
    timeoutId = setTimeout(() => checkWin(hasSwitched), getDelayValue());
  } else {
    checkWin(hasSwitched);
  }
}

function revealDoor() {
  const options = doors.filter(
    (door, i) => i !== pickedDoor.index && door.prize !== "💵"
  );

  // The player got the right door!
  if (options.length === doors.length - 1) {
    // Randomly remove 1
    options.splice(floor(random(options.length)), 1);
  }

  for (const revealedDoor of options) {
    revealedDoor.addClass("revealed");
    select(".content", revealedDoor).html(revealedDoor.prize);
  }

  const lastDoor = doors.find(
    (door) => !door.hasClass("revealed") && !door.hasClass("picked")
  );
  select("#instruction > p").html(
    `Do you want to switch to door #${lastDoor.index + 1}?`
  );

  if (autoMode) {
    // 0.1 => Stays more often
    // 0.9 => Switches more often
    // 0.5 => approx 50 % each one
    if (random(1) < 0.5) { 
      timeoutId = setTimeout(() => chooseDoor(true), getDelayValue());
    } else {
      timeoutId = setTimeout(() => chooseDoor(false), getDelayValue());
    }
  } else {
    select("#instruction > .choices").show();
  }
}

function pickDoor() {
  if (state !== "PICK") return;
  state = "REVEAL";
  if (autoMode) {
    pickedDoor = random(doors);
  } else {
    pickedDoor = this;
  }
  pickedDoor.addClass("picked");
  if (autoMode) {
    setTimeout(revealDoor, getDelayValue());
  } else {
    revealDoor();
  }
}

function makeDoors() {
  // clear array
  for (let door of doors) {
    door.remove();
  }
  doors.splice(0, doors.length);
  console.log(doors);

  for (let i = 0; i < totalDoors; i++) {
    doors[i] = createDiv();
    doors[i].parent("#doors");
    doors[i].class("door-container");
    if (totalDoors > 10) {
      doors[i].addClass("small");
    }
    doors[i].index = i;
    doors[i].mousePressed(pickDoor);

    const door = createDiv();
    door.class("door");
    door.parent(doors[i]);

    const content = createDiv();
    content.class("content");
    content.parent(doors[i]);
  }
}

function setup() {
  noCanvas();

  makeDoors();
  reset();
  clearStats();

  stats = getItem("montey-hall-stats") || stats;
  updateStats();
  makeDoors();
  reset();

  select("#nb-doors").changed(function () {
    totalDoors = +this.value();
    makeDoors();
    reset();
    clearStats();
  });

  select("button#yes").mousePressed(function () {
    chooseDoor(true);
  });

  select("button#no").mousePressed(function () {
    chooseDoor(false);
  });

  select("button#play-again").mousePressed(function () {
    reset();
  });

  select("button#autorun").mousePressed(function () {
    autoMode = !autoMode;
    if (autoMode) {
      this.addClass("on");
      reset();
      pickDoor();
      select("#speed-slider").show();
    } else {
      clearTimeout(timeoutId);
      this.removeClass("on");
      select("#speed-slider").hide();
      reset();
    }
  });
  select("#speed-slider").hide();

  select("#reset").mousePressed(function () {
    makeDoors();
    reset();
    clearStats();
  });
}
