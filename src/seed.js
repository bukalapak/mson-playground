const seed01 = {
  label: "seed-01",
  dataStructure: `
## Person A

+ name: \`Jack\` (string, required)
+ age: 54 (number)

## Person B

+ name: \`Mark\` (string, required)
+ age: 34 (number)
+ partners (array, fixed-type)
  + (object)
      + Include Person A
  `,
  mson: `
+ people (array, fixed-type, required)
  + (object)
      + Include Person A
  + (object)
      + Include Person B
  `
};

const seeds = [seed01];

export default seeds;
