const { functions } = require('../config');
module.exports = {
  spring: {
    generator() {
      console.log('Running Spring function');
      const { bounds } = functions.spring.config;
      let g1, g2, g3, g4, x1, x2, x3, x4;

      x1 = bounds[0].lower + Math.random() * (bounds[0].upper - bounds[0].lower);
      x2 = bounds[1].lower + Math.random() * (bounds[1].upper - bounds[1].lower);
      x3 = bounds[2].lower + Math.random() * (bounds[2].upper - bounds[2].lower);

      g1 = 1 - Math.pow(x2, 3) * x3 / (7178 * Math.pow(x1, 4));
      g2 = 4 * Math.pow(x2, 2) - x1 * x2 / (12566 * (x2 * Math.pow(x1, 3) - Math.pow(x1, 4))) + 1 / (5108 * Math.pow(x1, 2)) - 1;
      g3 = 1 - 140.45 * x1 / (Math.pow(x2, 2) * x3);
      g4 = (x2 + x1) / 1.5 - 1;

      // Limits
      while (!(g1 <= 0 && g2 <= 0 && g3 <= 0 && g4 <= 0)) {
        x1 = bounds[0].lower + Math.random() * (bounds[0].upper - bounds[0].lower);
        x2 = bounds[1].lower + Math.random() * (bounds[1].upper - bounds[1].lower);
        x3 = bounds[2].lower + Math.random() * (bounds[2].upper - bounds[2].lower);
        g1 = 1 - Math.pow(x2, 3) * x3 / (7178 * Math.pow(x1, 4));
        g2 = 4 * Math.pow(x2, 2) - x1 * x2 / (12566 * (x2 * Math.pow(x1, 3) - Math.pow(x1, 4))) + 1 / (5108 * Math.pow(x1, 2)) - 1;
        g3 = 1 - 140.45 * x1 / (Math.pow(x2, 2) * x3);
        g4 = (x2 + x1) / 1.5 - 1;
      }

      let firefly = [x1, x2, x3, this.function(x1, x2, x3)];
      return firefly;
    },
    checkLimits(firefly) {
      const { bounds, dimension } = functions.spring.config;
      for (let i = 0; i < dimension - 1; i++) {
        if (firefly[i] < bounds[i].lower) {
          firefly[i] = bounds[i].lower;
        }
        if (firefly[i] > bounds[i].upper) {
          firefly[i] = bounds[i].upper;
        }
      }

      return firefly;
    },
    function(x1, x2, x3) {
      return (x3 + 2) * x2 * Math.pow(x1, 2);
    }
  }
};
