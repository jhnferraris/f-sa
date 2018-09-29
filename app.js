const { performance } = require('perf_hooks');
const arguments = process.argv;
if (arguments[2] !== '--problem') {
  console.log('Missing argument: problem');

  process.exit(1);
}
const problem = arguments[3];
if (problem !== 'spring') {
  console.log('It only supports spring function for now');
  process.exit(1);
}

const config = require('./config');
const functions = require('./functions');
const simulatedAnnealing = require('./simulated-annealing');
const fireflies = [];
const { population } = config.fsaConfig;
const designFunction = config.functions[problem];
const { initialAlpha, finalAlpha } = config.globalSearchConfig;
let alpha = initialAlpha;
const initializePopulation = () => {
  while (fireflies.length != population) {
    fireflies.push(functions[problem].generator());
  }
};

const updateLightIntensity = (index, leastFirefly) => {
  for (let k = 0; k < designFunction.dimension - 1; k++) {
    fireflies[index][k] = leastFirefly[k];
  }
  fireflies[index][designFunction.config.dimension] = functions[designFunction.fn]['function'](...fireflies[index]);
};

const cartesianDistance = (leastFirefly, betterFirefly) => {
  let distance = 0.0;
  for (let k = 0; k < designFunction.dimension; k++) {
    distance += Math.pow(leastFirefly[k] - betterFirefly[k], 2);
  }
  return Math.sqrt(distance);
};

const moveFirefly = (leastFirefly, betterFirefly) => {
  let newLeastFirefly = new Array(designFunction.dimension);
  const distance = cartesianDistance(leastFirefly, betterFirefly);
  const { initialAttractiveness, absorptionCoefficient } = config.globalSearchConfig;
  for (let k = 0; k < designFunction.dimension; k++) {
    const secondTerm = initialAttractiveness * Math.exp(-1 * absorptionCoefficient * Math.pow(distance, 2.0)) * (betterFirefly[k] - leastFirefly[k]);
    const thirdTerm = alpha * (Math.random() - 0.5);
    newLeastFirefly = leastFirefly[k] + secondTerm + thirdTerm;
  }

  newLeastFirefly = functions[problem].checkLimits(newLeastFirefly);
  return newLeastFirefly;
};

const main = () => {
  console.log('Running F-SA');
  initializePopulation();
  let bestFirefly = fireflies[0];
  let candidateFirefly = null;
  const { globalGeneration } = config.fsaConfig;
  const startTime = performance.now();
  for (let generationIndex = 1; generationIndex <= globalGeneration; generationIndex++) {
    for (let i = 0; i < population; i++) {
      for (let j = 0; j < i; j++) {
        const lightIntensityJ = fireflies[j][designFunction.config.dimension];
        const lightIntensityI = fireflies[i][designFunction.config.dimension];
        if (lightIntensityJ < lightIntensityI) {
          candidateFirefly = fireflies[j];
          updateLightIntensity(i, moveFirefly(fireflies[i], fireflies[j]));
          const localFirefly = simulatedAnnealing.executeLocalSearch(problem, fireflies[i]);
          if (fireflies[i][designFunction.config.dimension] > localFirefly[designFunction.config.dimension]) {
            updateLightIntensity(i, localFirefly);
          }
        } else if (lightIntensityI < lightIntensityJ) {
          candidateFirefly = fireflies[i];
          updateLightIntensity(j, moveFirefly(fireflies[j], fireflies[i]));
          const localFirefly = simulatedAnnealing.executeLocalSearch(problem, fireflies[j]);
          if (fireflies[j][designFunction.config.dimension] > localFirefly[designFunction.config.dimension]) {
            updateLightIntensity(j, localFirefly);
          }
        } else {
          updateLightIntensity(j, moveFirefly(fireflies[j], fireflies[i]));
          const localFirefly = simulatedAnnealing.executeLocalSearch(problem, fireflies[j]);
          if (candidateFirefly[designFunction.config.dimension] > localFirefly[designFunction.config.dimension]) {
            updateLightIntensity(i, localFirefly);
          }
        }

        if (candidateFirefly[designFunction.dimension] < bestFirefly[designFunction.dimension]) {
          bestFirefly = candidateFirefly;
        }
      }
    }
    alpha = finalAlpha + (initialAlpha - finalAlpha) * Math.exp(-1 * generationIndex);
  }

  console.log({
    bestFirefly,
    runtime: performance.now() - startTime
  });
};

main();
