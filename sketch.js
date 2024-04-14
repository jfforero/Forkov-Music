

let data = [1];
let uniqueStates = [...new Set(data)];
let transitionMatrix = [];
let stateCounts = [];
let predictButton;
let predictionElement = document.getElementById("prediction");
let newData_input = document.getElementById("newData");
let newData ;
let textini;
let largo_secuencia;

const synth = new Tone.Synth();


function setup() {
  createCanvas(600, 600);
  
  
  newData = newData_input.value;
  predictionElement.innerHTML = "Next state: ";
  predictButton = createButton("Predict");
  predictButton.mousePressed(predictSequence);
  
  //////////////////////////////////

  // Create a submit button
  let submitButton = createButton("Submit");
  submitButton.mousePressed(submitData);

  // Initialize the transition matrix
  for (let i = 0; i < uniqueStates.length; i++) {
    transitionMatrix[i] = [];
    for (let j = 0; j < uniqueStates.length; j++) {
      transitionMatrix[i][j] = 0;
    }
    stateCounts[i] = 0;
    
  }

  // Fill the transition matrix
  for (let i = 0; i < data.length - 1; i++) {
    let from = data[i];
    let to = data[i + 1];
    let fromIndex = uniqueStates.indexOf(from);
    let toIndex = uniqueStates.indexOf(to);
    transitionMatrix[fromIndex][toIndex]++;
    stateCounts[fromIndex]++;
  }

  // Normalize the transition matrix
  for (let i = 0; i < uniqueStates.length; i++) {
    for (let j = 0; j < uniqueStates.length; j++) {
      transitionMatrix[i][j] /= stateCounts[i];
    }
  }
}

////////////////////////////////////////////////

function weightedRandom(probabilities) {
  let sum = 0;
  

  print(probabilities.length);
  largo_secuencia = probabilities.length;

  for (let i = 0; i < probabilities.length; i++) {
    sum += probabilities[i];
  }
  
  let randomNumber = random(sum);
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (cumulativeProbability >= randomNumber) {
      return i;
    }
  }
}

/////////////////////////////////////////////////////////////////////

function submitData() {
  let newData = document.getElementById("newData").value;
  

  if (!newData) {
    document.getElementById("newData").placeholder = "Warning: Fill with a sequence first";
    return;
  }
  
  data = newData.split(",").map(Number);
  uniqueStates = [...new Set(data)];

  
  
  // Initialize the transition matrix
  transitionMatrix = [];
  stateCounts = [];
  for (let i = 0; i < uniqueStates.length; i++) {
    transitionMatrix[i] = [];
    for (let j = 0; j < uniqueStates.length; j++) {
      transitionMatrix[i][j] = 0;
    }
    stateCounts[i] = 0;
  }
  // Fill the transition matrix
  for (let i = 0; i < data.length - 1; i++) {
    let from = data[i];
    let to = data[i + 1];
    let fromIndex = uniqueStates.indexOf(from);
    let toIndex = uniqueStates.indexOf(to);
    transitionMatrix[fromIndex][toIndex]++;
    stateCounts[fromIndex]++;
  }
  // Normalize the transition matrix
  for (let i = 0; i < uniqueStates.length; i++) {
    for (let j = 0; j < uniqueStates.length; j++) {
      transitionMatrix[i][j] /= stateCounts[i];
    }
  }
}
//////////////////////////////////////////////////////////

  function predictSequence() {
  let currentState = data[data.length - 1];
  let currentStateIndex = uniqueStates.indexOf(currentState);
  let nextStateProbabilities = transitionMatrix[currentStateIndex];
  let nextStateIndex = weightedRandom(nextStateProbabilities);
  let nextState = uniqueStates[nextStateIndex];
    
    
     
if (typeof nextState == 'undefined') {
  largo_secuencia = 10;
  nextState = 1;
  data.push(nextState);
  //document.getElementById("newData").value = "";
  document.getElementById("newData").placeholder = "Inavalid Seq Please try another one";
  //console.error("Invalid value:", nextState);
  
  return;
}
    
  data.push(nextState);
    
  // Set the content of the <div> element to the predicted state
  document.getElementById("prediction").innerHTML = "Next state: " + nextState;
  document.getElementById("newData").placeholder = "Add your sequence here separated with ','";

  // Play the MIDI sound
    
  let note = (nextState + 60);
  let  notita= Tone.Midi(note).toFrequency(); // 261.6255653005986
  synth.triggerAttackRelease(notita, "8n");

}

///////////////////
function draw() {
  background(255);

  // Draw the transition matrix
  let w = width / uniqueStates.length;
  let h = height / (uniqueStates.length + 1);
  for (let i = 0; i < uniqueStates.length; i++) {
    for (let j = 0; j < uniqueStates.length; j++) {
      let x = j * w;
      let y = i * h;
      fill(transitionMatrix[i][j] * 255);
      rect(x, y, w, h);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(transitionMatrix[i][j].toFixed(2), x + w / 2, y + h / 2);
    }
  }

  // Draw the predicted state
  let predictedState = data[data.length - 1];
  let predictedStateIndex = uniqueStates.indexOf(predictedState);
  for (let i = 0; i < uniqueStates.length; i++) {
    let x = predictedStateIndex * w;
    let y = (uniqueStates.length) * h -0;
    fill(0, 255, 0, 128);
    rect(x, y, w, h);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(uniqueStates[i], x + w / 2, y);
  }

  // Draw the labels for the x-axis
  fill(0);
  textSize(16);
  for (let i = 0; i < uniqueStates.length; i++) {
    textAlign(CENTER, TOP);
    text(uniqueStates[i], i * w + w / 2, height - 20);
  }

  // Draw the labels for the y-axis
  textSize(16);
  fill(255);
  for (let i = 0; i < uniqueStates.length; i++) {
    textAlign(LEFT, CENTER);
    text(uniqueStates[i], 0, i * h + h / 2);
  }

  // Draw the label for the predicted state
  textAlign(LEFT, CENTER);
  fill(0);
  text("Prediction", 0, (uniqueStates.length) * h + h / 2);

  // Play a MIDI sound with a pitch that corresponds to the predicted state
  //let synth = new Tone.Synth().toMaster();
    synth.oscillator.volume = 5;
  synth.oscillator.count = 3;
  synth.oscillator.spread = 40;
  synth.oscillator.type = "fatsawtooth";
  synth.toMaster();
  
}

