const config = require('./config');
const functions = require('./functions');
let fireflies = [];
const fireflyGenerator = () => {
  return functions[config.generator]();
};

const initializePopulation = () => {
  while (fireflies.length != config.fireflyPopulation) {
    fireflies.push(fireflyGenerator());
  }
};

const updateLightIntensity = (index, leastFirefly) => {
  for (let k = 0; k < config.dimension; k++) {
    fireflies[index] = leastFirefly[k];
  }
  fireflies[index].fnValue = functions[config.functionName]({ ...fireflies[index] });
};

const distance = (leastFirefly, betterFirefly) => {
  let distance = 0.0;
  let values;
};
const move = (leastFirefly, betterFirefly) => {
  const thirdTerm = config.alpha * (Math.random() - 0.5);
  //(Double.parseDouble("" + ff_I.get(k)) - Double.parseDouble("" + ff_J.get(k))) * (Double.parseDouble("" + ff_I.get(k)) - Double.parseDouble("" + ff_J.get(k)));
  // const r =
};
const main = () => {
  console.log('running algo');
  initializePopulation();
  let bestFirefly = fireflies[0];
  let candidateFirefly = null;
  for (let generationIndex = 0; generationIndex < config.numberOfGenerations; generationIndex++) {
    for (let i = 0; i < config.fireflyPopulation; i++) {
      for (let j = 0; j < i; j++) {
        if (fireflies[j].fnValue < fireflies[i].fnValue) {
          candidateFirefly = fireflies[j];
        }
      }
    }
  }
};

main();
