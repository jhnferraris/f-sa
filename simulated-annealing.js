const { fsaConfig, localSearch, functions } = require('./config');
const functionsList = require('./functions');
module.exports = {
  executeLocalSearch: (problem, firefly) => {
    let temp = localSearch.initialTemperature;
    let bestLocalFirefly;
    for (let j = 0; j < fsaConfig.localIteration; j++) {
      const newFirefly = functionsList[problem].generator();
      let rand = Math.random() * 1;
      let energyDelta = newFirefly[functions[problem]['config']['dimension']] - firefly[functions[problem]['config']['dimension']];
      if (energyDelta < 0) {
        bestLocalFirefly = newFirefly;
      } else if (rand < Math.pow(Math.E, -1 * (energyDelta / temp))) {
        bestLocalFirefly = newFirefly;
      }

      temp *= localSearch.geometricRatio;
    }

    return bestLocalFirefly;
  }
};
